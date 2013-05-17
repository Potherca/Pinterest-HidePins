/*
    Older version of chrome < 20 don't use sendRequest/onRequest but 
    sendMessage/onMessage. Older installs like mint/ubuntu 10 still sport chrome 
    18. What to do?
*/
function onRequest(request, sender, sendResponse) {
    /*  No need for any validation as this script is only called on Pinterest 
     *  URLs, so we just always execute the call to display the Page Action icon.
     */
    chrome.pageAction.show(sender.tab.id);

    /*  This page is kept alive until a response is received, so *alway* send a
     *  response, even if it empty.
     */
    sendResponse({"aSearchTerms": JSON.parse(localStorage['Pinterest-HidePins'] || '[]')});
};

function webRequestCompleted(request, sender, sendResponse){
    console.log(' -- webRequestCompleted');

var aSearchTerms = JSON.parse(localStorage['Pinterest-HidePins'] || '[]');
console.log(aSearchTerms, typeof aSearchTerms);

    chrome.tabs.executeScript(null, {
        code: 'window.hidePins(["' + aSearchTerms.join('","') + '"]);'
//        file: 'contentscript.js',
//        allFrames: true // <-- You might want to tweak this
    });

}

chrome.extension.onRequest.addListener(onRequest);

chrome.webRequest.onCompleted.addListener(webRequestCompleted, {urls: [
          "*://*.pinterest.com/*"
        , "*://pinterest.com/*"
    ]
    , types: ['xmlhttprequest']
});

//}
//EOF
