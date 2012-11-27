var TC = {
    enabled: true,
    maxWait: 300, // Maximum wait (seconds) before a URL opens.
    menuItem: null,
    minWait: 15, // Minimum wait (seconds) for a URL to open.
    pendingCount: 0,  // Number of items in urls object (below).
    urls: {},

    check: function(tab){
        var url = tab.url;
        if (!this.enabled ||
            url.indexOf('chrome://') === 0 ||
            url.indexOf('chrome-devtools://') === 0){
            // Let empty new tabs and developer tabs be opened.
            return;
        }

        var now = Date.now();

        if (this.urls[url]){
            if (this.urls[url].timeout === null){
                // This URL was scheduled for opening, and its timeout has fired.
                console.log('Automatically opening ' + url);
                delete this.urls[url];
                this.pendingCount--;
                this.updateMenuItem();
            }
            else {
                console.log('url ' + url + ' is scheduled to be opened, but not now!');
                chrome.tabs.remove(tab.id);
            }
        }
        else {
            // Unscheduled URL. Schedule it and remove the existing tab.
            var delta = 1000 * (
                this.minWait + Math.random() * (this.maxWait - this.minWait));
            console.log(url + ' will be opened in ' + (delta / 1000) + ' seconds.');
            var timeout = setTimeout(
                function(){
                    this.urls[url].timeout = null;
                    chrome.tabs.create({
                        active: false,
                        url: url
                    });
                }.bind(this),
                delta);
            this.urls[url] = {
                scheduledAt: now,
                timeout: timeout,
                when: now + delta
            };
            this.pendingCount++;
            this.updateMenuItem();
            chrome.tabs.remove(tab.id);
        }
    },

    openAllPending: function(){
        // Open all pending URLs, in the order they were scheduled to be opened.
        var toOpen = [];
        for (var url in this.urls){
            clearTimeout(this.urls[url].timeout);
            toOpen.push(url);
        }
        toOpen.sort(function(a, b){
            return this.urls[a].scheduledAt < this.urls[b].scheduledAt ? -1 : 1;
        }.bind(this));
        for (var i = 0; i < toOpen.length; i++){
            chrome.tabs.create({
                active: false,
                url: toOpen[i]
            });
        }
        this.urls = {};
        this.pendingCount = 0;
        this.updateMenuItem();
    },

    updateMenuItem: function(){
        if (this.enabled){
            chrome.contextMenus.update(
                this.menuItem, {
                    checked: true,
                    title: 'Enabled, ' + this.pendingCount + ' URL' + (this.pendingCount === 1 ? '' : 's') + ' pending'
                }
            );
        }
        else {
            chrome.contextMenus.update(
                this.menuItem, {
                    checked: false,
                    title: 'Disabled, click to enable'
                }
            );
        }
    },

    init: function(){
        chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
            changeInfo.status === 'loading' && this.check(tab);
        }.bind(this));

        this.menuItem = chrome.contextMenus.create({
            checked: true,
            title: 'Enabled. 0 URLs pending.',
            contexts: ['all'],
            type: 'checkbox',
            onclick : function(info, tab){
                this.enabled = info.checked;
                this.updateMenuItem();
                if (!this.enabled){
                    // Deactivated :-(
                    this.openAllPending();
                }
            }.bind(this)
        });
    }
};

TC.init();
