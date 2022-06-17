chrome.commands.onCommand.addListener(function (command) {
    if (command === "copy-branch-name") {
        chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT }, function (tabs) {
            chrome.tabs.executeScript({file: 'contentScript.js'}, function() {
                const activeTab = tabs[0];
                const isActiveTabAzureWorkItem = activeTab && activeTab.url && activeTab.url.startsWith('https://dev.azure.com') && activeTab.url.includes('workitem');

                if (isActiveTabAzureWorkItem) {
                    chrome.storage.sync.get(function(data) {
                        chrome.tabs.sendMessage(activeTab.id, {id: 'copyBranchName', name: data.name}, copyTextToClipboard);
                    });
                }
            });
        });
    }

    if (command === "copy-pr-description") {
        chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT }, function (tabs) {
            chrome.tabs.executeScript({file: 'contentScript.js'}, function() {
                const activeTab = tabs[0];
                const isActiveTabAtlassianReleaseDoc = 
                    activeTab
                    && activeTab.url
                    && activeTab.url.startsWith('https://theranest.atlassian.net/')
                    && activeTab.url.includes('Sprint')
                    && activeTab.url.includes('Release');

                if (isActiveTabAtlassianReleaseDoc) {
                    chrome.storage.sync.get(function(data) {
                        chrome.tabs.sendMessage(activeTab.id, {id: 'copyPrDescription', name: data.name}, copyTextToClipboard);
                    });
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