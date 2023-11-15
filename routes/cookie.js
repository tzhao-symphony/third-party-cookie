var express = require('express');
var router = express.Router();

const SET_COOKIE = 'Set-Cookie';

router.get('/setCookie', function(req, res, next) {
    const randomNumber = Math.round(Math.random() * 10000);
    const cookieName = `COOKIE_${randomNumber}`;
    const partitionedCookieName = `${cookieName}_Partitioned`;

    const cookie = `${cookieName}=cookie; HttpOnly; Secure; Path=/; SameSite=None`;
    const partitionedCookie = `${partitionedCookieName}=cookie; HttpOnly; Secure; Path=/; SameSite=None; Partitioned`;
    res.append(SET_COOKIE, cookie);
    res.append(SET_COOKIE, partitionedCookie);
    res.send(
        {
            cookie,
            partitionedCookie
        }
    )
});

router.get('/getCookie', function(req, res, next) {
    res.send(req.headers.cookie?.split(';') || '{}');
});

module.exports = router;

