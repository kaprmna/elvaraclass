const express = require('express');
const bodyParser = require('body-parser');
const rateLimiter = require('express-rate-limit');
const compression = require('compression');
const path = require('path');

const server = express();

//SET SECURITY
server.use(compression({
    level: 5,
    threshold: 0,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));
server.set('trust proxy', 1);
server.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    );
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url} - ${res.statusCode}`);
    next();
});
server.use(express.static("public"));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());
server.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100, headers: true }));

//SET API



//SET ROUTE
server.get('/', function (req, res) {
     let tempUrl = 'fancytest';
    const hostname = req.hostname;

    switch (hostname) {

        case 'fancytest.vercel.app':
            return res.sendFile(
                path.join(__dirname + '/html/main/index.html')
            );

        case 'elvaraclass.fancycdn.fun':
        case `elvaraclass.${tempUrl}.vercel.app`:
            return res.sendFile(
                path.join(__dirname, '../html/elvara/dist/index.html')
            );

        case 'ddika.fancycdn.fun':
        case `ddika.${tempUrl}.vercel.app`:
            return res.send('Portfolio are maintenance');

        default:
            return res.status(404).send('Unknown domain');
    }
});

//START SERVER
const runPort = 5000;
server.listen(runPort, function () {
    console.log(`Server Running On Port: ${runPort}`);
});