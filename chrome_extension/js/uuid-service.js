

export default async function get_UUID() {
    return new Promise(function (resolve, reject) {
        chrome.storage.sync.get(['user_uuid'], function (result) {
            if (result.user_uuid) {
                resolve(result.user_uuid)
            } else {
                resolve(create_UUID())
            }
        });
    });
}

function create_UUID() {

    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    chrome.storage.sync.set({ 'user_uuid': uuid }, function () { });
    return uuid;
}