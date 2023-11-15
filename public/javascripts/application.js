import { setCookieFromWorker, getCookieFromWorker } from'./apis/workerApi.js';
import { setCookie, getCookie } from './apis/api.js';
import { initWorker } from './worker/startWorker.js';

const requestStorageAccessButton = document.getElementById('requestAccess');

initWorker();
bindButtonActions();
handleCookieAccess();

function bindButtonActions() {
    document.getElementById('setCookies').onclick = async () => {
        setCookie().then(printResult);
    }
    
    document.getElementById('getCookies').onclick = async () => {
        getCookie().then(printResult);
    }
    
    document.getElementById('setCookiesFromWorker').onclick = async () => {
        setCookieFromWorker().then(printResult);
    }
    
    document.getElementById('getCookiesFromWorker').onclick = async () => {
        getCookieFromWorker().then(printResult);
    }
    
    requestStorageAccessButton.onclick = async () => {
        try {
            await document.requestStorageAccess();
            doThingsWithCookies();
          } catch (err) {
            // If there is an error obtaining storage access.
            console.error(`Error obtaining storage access: ${err}.
                          Please sign in.`);
          }
    }
}

async function handleCookieAccess() {
    if (!document.hasStorageAccess) {
      // This browser doesn't support the Storage Access API
      // so let's just hope we have access!
      doThingsWithCookies();
    } else {
      const hasAccess = await document.hasStorageAccess();
      if (hasAccess) {
        // We have access to unpartitioned cookies, so let's go
        doThingsWithCookies();
      } else {
        // Check whether unpartitioned cookie access has been granted
        // to another same-site embed
        try {
          const permission = await navigator.permissions.query({
            name: "storage-access",
          });
  
          if (permission.state === "granted") {
            // If so, you can just call requestStorageAccess() without a user interaction,
            // and it will resolve automatically.
            await document.requestStorageAccess();
            doThingsWithCookies();
          } else if (permission.state === "prompt") {
            // Need to call requestStorageAccess() after a user interaction
            requestStorageAccessButton.style.display = 'block'
          } else if (permission.state === "denied") {
            // User has denied unpartitioned cookie access, so we'll
            // need to do something else
          }
        } catch (error) {
          console.log(`Could not access permission state. Error: ${error}`);
          doThingsWithCookies(); // Again, we'll have to hope we have access!
        }
      }
    }
  }

function printResult(data) {
    document.getElementById('result').innerHTML = `<pre>${JSON.stringify(data,undefined,4)}</pre>`;
}

function doThingsWithCookies() {
}