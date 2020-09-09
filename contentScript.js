(function() {
    if (!window.contentScriptInjected) {
        chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
            if (msg.id === 'copyBranchName') {
                const workItemId = getWorkItemId();
                console.log(workItemId);
                
                const workItemTitle = getWorkItemTitle();
                console.log(workItemTitle);
                
                sendResponse(workItemId + "/" + workItemTitle);
            }
        });

        window.contentScriptInjected = true;
    }
})();
    
function getWorkItemId() {
    const workItemIdSpanWrapper = document.getElementsByClassName('workitemcontrol work-item-control work-item-form-id initialized')[0];
    if (!workItemIdSpanWrapper) {
        throw 'Cannot find work item id span wrapper';
    }

    const workItemIdSpan = workItemIdSpanWrapper.getElementsByTagName('span')[0];
    if (!workItemIdSpan) {
        throw 'Cannot find work item id span';
    }

    return workItemIdSpan.innerHTML;
}

function getWorkItemTitle() {
    const workItemIdInputWrapper = document.getElementsByClassName('workitemcontrol work-item-control work-item-form-title initialized')[0];
    if (!workItemIdInputWrapper) {
        throw 'Cannot find work item title input wrapper';
    }

    const workItemIdInput = workItemIdInputWrapper.getElementsByTagName('input')[0];
    if (!workItemIdInput) {
        throw 'Cannot find work item title input';
    }

    return workItemIdInput.value;
}