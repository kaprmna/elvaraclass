const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const compression = require('compression');

//SET SECURITY
app.use(compression({
    level: 5,
    filter: (req, res) => {
        if (req.headers['X-No-Compression']) return false;
        return compression.filter(req, res);
    }
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)} | Status: ${res.statusCode}`);
    next();
});
app.use(express.json());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after an hour',
}));
app.set('trust proxy', 1);
app.use(express.static(__dirname + '/public'));

//ROUTE SET
app.all('/', function (req, res) {
    const tempUrl = 'fancytest.vercel.app';
    const hostname = read.hostname;
    switch (hostname) {
        case tempUrl:
        case 'fancycdn.fun':
            return res.sendFile(__dirname + '/public/html/main/index.html');

            case 'elvaraclass.fancycdn.fun':
                return res.sendFile(__dirname + 'public/html/elvara/dist/index.html');

                case 'ddika.fancycdn.fun':
                    return res.sendFile(__dirname + 'public/html/ddika/index.html');

                    default:
                        res.send('Unknown domain');
    }
    //res.sendFile(__dirname + '/public/html/main/index.html');
});

//SERVER SET
const runPort = 5000;
app.listen(runPort, function () {
    console.log(`Server Running`);
});
