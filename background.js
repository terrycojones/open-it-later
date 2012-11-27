var TC = {
    maxWait: 300, // Maximum wait (seconds) before a URL opens.
    minWait: 15, // Minimum wait (seconds) for a URL to open.
    urls: {},
    
    check: function(tab){
        var url = tab.url;
        if (url.indexOf('chrome://') === 0 || url.indexOf('chrome-devtools://') === 0){
            // Let empty new tabs and developer tabs be opened.
            return;
        }
        
        var now = Date.now();
        
        if (this.urls[url]){
            if (now - this.urls[url] < 3000){
                // This URL was scheduled for opening, and the timing is ok.
                delete this.urls[url];
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
            this.urls[url] = now + delta;
            setTimeout(
                function(){
                    chrome.tabs.create({
                        active: false,
                        url: url
                    });
                },
                delta);
            chrome.tabs.remove(tab.id);
        }
    },
    
    init: function(){

        chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
            changeInfo.status === 'loading' && this.check(tab);
        }.bind(this));
    }
};

TC.init();
