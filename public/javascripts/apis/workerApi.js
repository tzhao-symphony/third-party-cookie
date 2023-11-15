import { postMessageToWorker } from "../worker/startWorker.js";
import { SET_COOKIE, GET_COOKIE } from "../worker/events.js";

export async function setCookieFromWorker() {
    return postMessageToWorker(SET_COOKIE);
}

export async function getCookieFromWorker() {
    return postMessageToWorker(GET_COOKIE);
}