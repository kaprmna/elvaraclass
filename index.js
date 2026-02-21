const express = require('express');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const compression = require('compression');

const server = express();

//SET SECURITY
server.use(compression({
    level: 5,
    filter: (req, res) => {
        if (req.headers['X-No-Compression']) return false;
        return compression.filter(req, res);
    }
}));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)} | Status: ${res.statusCode}`);
    next();
});
server.use(express.json());
server.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after an hour',
}));
server.set('trust proxy', 1);
server.use(express.static(__dirname + '/public'));

//ROUTE SET
server.all('/', function (req, res) {
    //const tempUrl = 'fancytest.vercel.app';
    const hostname = req.hostname;
    switch (hostname) {
        //case tempUrl:
        case 'fancycdn.fun':
            return res.sendFile(__dirname + '/public/html/main/index.html');

            case 'elvaraclass.fancycdn.fun':
                return res.sendFile(__dirname + '/public/html/elvara/dist/index.html');

                case 'ddika.fancycdn.fun':
                    return res.sendFile(__dirname + '/public/html/ddika/index.html');

                    default:
                        return res.sendFile(__dirname + '/public/html/main/index.html');
    }
});

//FOR ELVARA CLASS
server.use(express.static(__dirname + '/public/html/elvara/dist'));

//SERVER SET
module.exports = server;
/*
const runPort = 5000;
server.listen(runPort, function () {
    console.log(`Server Running`);
});*/
