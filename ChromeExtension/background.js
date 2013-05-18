/*
    Older version of chrome < 20 don't use sendRequest/onRequest but 
    sendMessage/onMessage. Older installs like mint/ubuntu 10 still sport chrome 
    18. What to do? Try to support both? Use sendRequest/onRequest until it is
    eventually deprecated?
*/
function onRequest(request, sender, sendResponse) {
    console.log('BlindsForPinterest -- extensionRequested');
    /*  No need for any validation as this script is only called on Pinterest 
     *  URLs, so we just always execute the call to display the Page Action icon.
     */
    chrome.pageAction.show(sender.tab.id);

    /*  This page is kept alive until a response is received, so we should 
     *  ALWAYS send a response, even if it is empty.
     */
     // @TODO: I don't like having to hit the localStore on each request.
     //        It should be looked up once and updated from the options page.
    sendResponse({"aSearchTerms": JSON.parse(localStorage['Pinterest-HidePins'] || '[]')});
};

function webRequestCompleted(request, sender, sendResponse){
    console.log('BlindsForPinterest -- webRequestCompleted');

    var aSearchTerms = JSON.parse(localStorage['Pinterest-HidePins'] || '[]');

    chrome.tabs.executeScript(null, {
        code: 'window.hidePins(["' + aSearchTerms.join('","') + '"]);'
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

//EOF
