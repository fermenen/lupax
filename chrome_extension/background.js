import deleteAllDomainCookies from "./js/cookie-service.js";
import get_UUID from "./js/uuid-service.js";


let c_participant_user = ''

let c_url_base_api = ''
let c_extension_id = ''

let c_tab_id = '';
let c_id_task = '';
let c_url = '';
let c_url_target = '';
let c_delete_cookie = false;

let c_recording = false;
let c_finish = false;

let c_preview_mode = false;

let c_start_time = 0;
let c_finish_time = 0;

let c_clicks = 0;

let c_participation_id = ''


chrome.runtime.onInstalled.addListener(() => {
    console.log('lupax ' + chrome.runtime.getManifest().version + ' ready');
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'FROM_STUDIE_CLICK') {
        c_clicks += 1
        sendResponse({})
    } else if (request.type === 'FROM_STUDIE_STOP') {
        stop_studie_task(request);
        sendResponse({})
    }
    return true;
});


chrome.runtime.onMessageExternal.addListener(async (request, sender, sendResponse) => {
    console.log("Received message from " + sender + ": ", request);
    c_participant_user = await get_UUID()
    if (request.type === 'FROM_LUPAX_START') {
        c_url_base_api = request.url_api;
        c_extension_id = request.extension_id;
        c_id_task = request.id_task;
        c_preview_mode = request.preview_mode;
        c_recording = true
        const data_task = await getDataTask(c_id_task);
        c_url = data_task.url;
        c_url_target = data_task.target_url
        c_delete_cookie = data_task.delete_cookie;
        c_tab_id = await openTab(c_url);
        start_studie_task(c_tab_id)
        sendResponse({ received: true });
        return true;
    } else if (request.type === 'FROM_LUPAX_STATUS') {
        sendResponse({ task: c_id_task, finish: c_finish, participation_id: c_participation_id });
        return true;
    } else if (request.type === 'FROM_LUPAX_INSTALL') {
        sendResponse({ version: chrome.runtime.getManifest().version, participant_id: c_participant_user });
        return true;
    }
});


// START STUDIE TASK
async function start_studie_task(tab_id) {
    console.log('%cSTART STUDIE TASK ' + c_id_task + ' ON TABid ' + c_tab_id, 'color: green;');
    c_start_time = performance.now();
    c_clicks = 0
    c_finish = false;
    if (c_delete_cookie) {
        await deleteAllDomainCookies(c_url)
    }
}

// STOP STUDIE TASK
async function stop_studie_task(request) {
    console.log('%cSTOP STUDIE TASK ' + c_id_task + ' ON TABid ' + c_tab_id, 'color: red;');
    c_finish_time = performance.now();
    const time_total = c_finish_time - c_start_time;
    c_finish = true;
    c_recording = false
    try {
        chrome.tabs.remove(c_tab_id);
    } catch (error) {
        console.error(error)
    }
    if (!c_preview_mode) {
        const data_results = {
            task_id: c_id_task,
            participant_user: c_participant_user,
            time_total: time_total,
            clicks: c_clicks,
            target_success: request.target_success
        }
        postDataTask(data_results);
    }
}


chrome.tabs.onUpdated.addListener(async function (tabId, info) {
    try {
        if (info.status === 'complete' && tabId === c_tab_id && c_recording && c_id_task !== '') {
            inyectJsOnPage(c_tab_id)
        }
    } catch (error) {
        console.error(error)
    }

});


// UTILS

function inyectJsOnPage(tab_id) {
    const data = {
        scriptOptions:
        {
            target_url: c_url_target,
            extension_id: c_extension_id
        }
    }
    chrome.scripting.executeScript(
        {
            target: { tabId: tab_id },
            files: ['content-script.js']
        },
        function () {
            chrome.tabs.sendMessage(tab_id, data, function (response) {
                console.log('%cJS injected ok. On TABid ' + c_tab_id, 'color: blue;');
            });
        }
    );

}


async function openTab(url) {
    const tab = await chrome.tabs.create({ url: url });
    return tab.id;
}


/// FETCH

async function getDataTask(task_id) {
    return fetch(`${c_url_base_api}/task/${task_id}/`, {
        method: 'GET',
        headers: { "content-type": "application/json" },
    }).then((response) => {
        return response.json().then((data) => {
            return data;
        }).catch((err) => {
            console.error(err);
        })
    });
}


function postDataTask(data_results) {
    fetch(`${c_url_base_api}/participation/`, {
        method: 'POST',
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data_results)
    }).then(function (res) {
        if (!res.ok) throw Error(res.statusText);
        return res;
    }).then(reponse => reponse.json()).then(data => {
        c_participation_id = data.id
    }).catch(err => {
        console.error(err);
    }
    );
}
