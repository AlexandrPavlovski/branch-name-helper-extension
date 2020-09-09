document.getElementById('saveBtn').addEventListener('click', function() {
    let name = document.getElementById('nameInput').value;
    chrome.storage.sync.set({ name });
});