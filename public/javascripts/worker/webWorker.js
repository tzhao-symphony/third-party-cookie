import { GET_COOKIE, INIT, SET_COOKIE, WORKER_REPLY, WORKER_READY } from "./events.js";
import { getCookie, setCookie } from '../apis/api.js';

self.onmessage = async (event) => {
    const {type, id, payload} = event.data;
    if (event.data.type === INIT) {
        postMessage({
            type: WORKER_READY
        })
    } else if (event.data.type === GET_COOKIE) {
        const result = await getCookie();
        postResponse(id, result);
    } else if (event.data.type === SET_COOKIE) {
        const result = await setCookie();
        postResponse(id, result);
    } else {
        postResponse(id, {
            error: 'unable to find event'
        })
    }
}

function postResponse(id, responseData) {
    postMessage(
        {
            type: WORKER_REPLY,
            id,
            data: responseData
        })
}

