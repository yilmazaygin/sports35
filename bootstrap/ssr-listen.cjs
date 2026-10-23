const http = require('http');

const listen = http.Server.prototype.listen;

http.Server.prototype.listen = function (port, hostname, backlog, callback) {
    if (typeof port === 'number' && (hostname === undefined || typeof hostname === 'function')) {
        return listen.call(this, port, '0.0.0.0', typeof hostname === 'function' ? hostname : callback);
    }

    return listen.call(this, port, hostname, backlog, callback);
};
