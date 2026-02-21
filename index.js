const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const compression = require('compression');

const ipNow = "134.199.147.136";
const hostdo = 
`134.199.147.136 growtopia1.com
134.199.147.136 growtopia2.com
134.199.147.136 www.growtopia1.com
134.199.147.136 www.growtopia2.com
134.199.147.136 growtopiagame.com
`;

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

app.use((req, res, next) => {
    if (req.url.match(/\.(js|css)$/i)) {
        const referer = req.get('referer');
        if (referer && !referer.startsWith(req.protocol + '://' + req.get('host'))) {
            return res.status(403).send('Forbidden');
        }
    }
    next();
});

app.all('/ios', (req, res) => {
     res.set('Content-Type', 'text/plain');
    res.send(
        `[General]

[Rule]
FINAL,DIRECT

[Host]
www.growtopia2.com = ${ipNow}
www.growtopia1.com = ${ipNow}
growtopia2.com = ${ipNow}
growtopia1.com = ${ipNow}
        `
    );
});
app.all('/android', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(hostdo);
});

app.all('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(5000, function () {
    console.log(`Listening on port 5000`);
});
