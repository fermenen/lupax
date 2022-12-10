let c_target_url = ''
let c_extension_id = ''


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    var scriptOptions = message.scriptOptions;
    c_target_url = scriptOptions.target_url;
    c_extension_id = scriptOptions.extension_id;
    addHtml();
    modifyHref();
    sendResponse({});
    return true;
});

//UTIL

function modifyHref() {
    document.querySelectorAll('a[href]').forEach((element) => {
        const href_original = element.href;
        element.addEventListener('click', (event) => interceptEvt(href_original, event));
    });
    document.onclick = function (event) {
        addingClick();
    };
}


function interceptEvt(href, event) {
    if (href === c_target_url) {
        event.preventDefault()
        addingClick()
        finishTask(c_target_url, true);
    } else if (href.includes("/#finishTasklupax")) {
        event.preventDefault()
        finishTask("", false);
    } else {
        addingClick();
    }
}


function addingClick() {
    var data = {
        type: "FROM_STUDIE_CLICK",
    };
    chrome.runtime.sendMessage(c_extension_id, data, function (reponse) {
    });
}


function finishTask(c_target_url, success) {
    var data = {
        type: "FROM_STUDIE_STOP",
        url: c_target_url,
        target_success: success
    };
    chrome.runtime.sendMessage(c_extension_id, data, function (reponse) {
    });
}


function addHtml() {
    const codeHtml = "<div style='display: grid'><a href='/#finishTasklupax'><button type='button' style='background-color:red'>Finish Button</button></a></div>"
    document.body.insertAdjacentHTML("beforebegin", codeHtml);
}
