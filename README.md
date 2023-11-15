# UPDATE
It now works. As mentioned in the commit message from https://chromium-review.googlesource.com/c/chromium/src/+/4968438, the worker inherits storage access at creation time, as such it is required to `requestStorageAccess` before the worker creation.

# Reproduction steps
## Environment
- Chrome: Version 120.0.6099.18 (Official Build) beta (x86_64)
- Enable chrome://flags/#test-third-party-cookie-phaseout

## steps
1. set unpartitioned cookies at top level (backend response with "Set-Cookie" header `cookieName=cookie; HttpOnly; Secure; Path=/; SameSite=None`)
2. embed the application on another domain (for instance w3schools)
3. grant storage access to the embed
4. within the embed, `fetch` from a dedicated worker => the cookies from step 1) are not included in the request

Expected result: the `fetch` from the dedicated worker should include the unpartitioned cookies in its request header.

# Reproduction demo app
## Pre-requisites
- Node v18.18.1
- Port 3000 available

## Start the app
```
yarn install
yarn start
```

## Step
- Paste [w3schools_test_template.html](w3schools_test_template.html) in https://www.w3schools.com/html/tryit.asp?filename=tryhtml_default_default and run it
- Click on "Open app in new tab (1st Party)"
- [1st party] Click on "Set Cookies" > backend call to set a partitioned cookie and an unpartitioned one
- [1st party] Click on "Get Cookies" to see the cookies that are embedded in the request. The 2 cookies should be displayed
- [embed] Go back to the embed and click on "Request Storage Access", then grant access
- [embed] Click on "Get Cookies" > the unpartitioned cookie should be displayed
- [embed] Click on "Get Cookies from worker" > no cookie is displayed, the unpartitioned cookie was not embedded in the request that came from the worker



https://github.com/tzhao-symphony/third-party-cookie/assets/78357406/54701183-6285-4038-b34e-efa096ed9704


