chrome.commands.onCommand.addListener(function (command) {
    if (command === "copy-branch-name") {
        chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT }, function (tabs) {
            chrome.tabs.executeScript({file: 'contentScript.js'}, function() {
                const activeTab = tabs[0];
                const isActiveTabAzureWorkItem = activeTab && activeTab.url && activeTab.url.startsWith('https://dev.azure.com') && activeTab.url.includes('workitem');

                if (isActiveTabAzureWorkItem) {
                    console.log("message sent");
                    chrome.tabs.sendMessage(activeTab.id, {id: 'copyBranchName'}, copyTextToClipboard);
                }
            });
        });
    }
});

function copyTextToClipboard(text) {
    const copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.blur();
    document.body.removeChild(copyFrom);
}