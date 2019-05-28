const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(proxy('/api/commodity/opera',
        {
            target: 'http://39.105.57.189:1297/',
            pathRewrite: {
                '^/api': '',
            },
        }
    ));
    app.use(proxy('/api/customer/order',
        {
            target: 'http://39.105.57.189:1297/',
            pathRewrite: {
                '^/api': '',
            },
        }
    ));

    app.use(proxy('/api',
        {
            target: 'http://39.105.57.189:1292/',
            pathRewrite: {
                '^/api': '',
            },
        }
    ));
};
