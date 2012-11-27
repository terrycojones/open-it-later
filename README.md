# Open-it-later (OIL)

When you click on any link, or open a tab for new URL, the current tab will
immediately be closed and the desired URL will be displayed in a new tab at
some random point in the future.

This is just a silly hack meant to illustrate alternate browsing
possibilities.  In this case the idea is to make browsing less immediate
and more considered.

## Internals

Change the minimum and maximum wait times in background.js

Look at the console log for the extension background page to see when URLs
you try to open will actually be opened.  To see the console, go to
chrome://extensions and click the _generated_background_page.html link
next to the Open-it-later extension.

## Image credit

The "snake oil" icon used by the extension comes from Hugh McLeod at
http://gapingvoid.com/
