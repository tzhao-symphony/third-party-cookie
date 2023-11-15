import {WORKER_READY, WORKER_REPLY, INIT } from './events.js';

const resolvePromisesMap = new Map();
let messageId = 0;

let worker;
let resolveInitialization;
const workerInitialized = new Promise(r => resolveInitialization = r);

export function initWorker() {
    worker = new Worker('./javascripts/worker/webWorker.js', {type: 'module'});
    worker.onmessage = (event) => {
        const {id, data, type} = event.data;
        if (type === WORKER_READY) {
            resolveInitialization();
        } else if (type === WORKER_REPLY) {
            const resolve = resolvePromisesMap.get(id);
            if (!resolve) {
                throw new Error(`Nothing found for id ${id}`);
            }
            resolve(data);
            resolvePromisesMap.delete(id);
        }
    }
    worker.postMessage({type: INIT});
}

export async function postMessageToWorker(type, payload) {
    await workerInitialized;
    let resolve;
    const promise = new Promise(r => resolve = r);
    messageId++;
    resolvePromisesMap.set(messageId, resolve);
    worker.postMessage({
        type, id: messageId, payload
    })
    return promise;
}