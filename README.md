# Open-it-later (OIL)

When you click on any link, or open a tab for new URL, the current tab will
immediately be closed and the desired URL will be displayed in a new tab at
some random point in the future.

The extension installs a (right-click) context menu that lets you disable
it. On disable, all pending URLs will immediately be opened in the order
they were originally clicked.

## Why?

This is a silly hack to illustrate alternate browsing possibilities.  In
this case the idea is to make browsing less immediate and more considered.

## Installation from a bundled .crx file

You should be able to easily install the extension by visting
https://fluiddb.fluidinfo.com/about/open-it-later/fluidinfo.com/chrome.crx

## Installation from source

* Download the repo: `git clone http://github.com/terrycojones/open-it-later`
* In chrome, go to `chrome://extensions`
* Click on `Developer mode`
* Click on `Load Unpacked Extension...`
* Navigate to the directory where you cloned the repo and click `Open`

## Internals

Change the minimum and maximum wait times (`TC.minWait` and `TC.minWait`)
in background.js

Look at the console log for the extension background page to see when URLs
you try to open will actually be opened.  To see the console, go to
`chrome://extensions` and click the `_generated_background_page.html` link
next to the Open-it-later extension.

## Image credit

The "snake oil" icon used by the extension comes from
[Hugh McLeod](http://gapingvoid.com/)
