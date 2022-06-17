(function() {
    if (!window.contentScriptInjected) {
        chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
            if (msg.id === 'copyBranchName') {
                const workItemId = getWorkItemId();
                const workItemTitle = getWorkItemTitle();

                sendResponse(msg.name + "/do" + workItemId + "/" + formatWorkItemTitle(workItemTitle));
            }

            if (msg.id === 'copyPrDescription') {
                const releaseData = parsePage();
                const releasePrDescr = buildReleasePullRequestDescription(releaseData);

                sendResponse(releasePrDescr);
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

function formatWorkItemTitle(text) {
    return text.toLowerCase().replace(/[^0-9a-z -]/g, '').replace(/ /g, '-');
}

function parsePage() {
    const tableWrapper = document.getElementsByClassName('pm-table-wrapper')[0];
    const table = tableWrapper.children[0];
    const tableBody = table.children[1];
    const rows = Array.prototype.slice.call(tableBody.children);
    return rows.slice(1).map(x => {
        const cells = Array.prototype.slice.call(x.children);
        return { pullRequest: tableCellToPr(cells[2]), tasks: tableCellToTasks(cells[1]) };
    });
}

function tableCellToTasks(cell) {
    const links = Array.prototype.slice.call(cell.getElementsByTagName("a"));
    return links.map(x => {
        const taskNames = x.innerHTML.split(' ');
        return taskNames[taskNames.length - 1];
    });
}

function tableCellToPr(cell) {
    const link = Array.prototype.slice.call(cell.getElementsByTagName("a"));
    return link[0].innerHTML;
}

function buildReleasePullRequestDescription(releaseData) {
    let result = "";
    for (let i = 0; i < releaseData.length; i++) {
        const dataPoint = releaseData[i];
        result += `${i + 1}. !${dataPoint.pullRequest} \r\n`;
        for (let j = 0; j < dataPoint.tasks.length; j++) {
            result += `#${dataPoint.tasks[j]} \r\n`;
        }
        result += "\r\n";
    }

    return result;
}
