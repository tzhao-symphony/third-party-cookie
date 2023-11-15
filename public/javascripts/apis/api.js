export async function getCookie() {
    return (await fetch('/cookie/getCookie')).json();
}

export async function setCookie() {
    return (await fetch('/cookie/setCookie')).json();
}