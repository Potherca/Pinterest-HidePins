console.log('Pinterest Blinds Loaded from Chrome Extension');

// This is triggered when the extension is installed or updated.
chrome.runtime.onInstalled.addListener(function(){
    alert('Blinds for Pinterest installed (or updated)!');
});
