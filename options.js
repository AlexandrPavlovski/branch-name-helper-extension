chrome.storage.sync.get(function(data) {
    document.getElementById('nameInput').value = data.name;
});

document.getElementById('saveBtn').addEventListener('click', function() {
    let name = document.getElementById('nameInput').value;
    chrome.storage.sync.set({ name: name });
});