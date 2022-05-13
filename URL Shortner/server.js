const express = require('express');
const app = express();
//const UrlDb = {};
let urlnum = 1000;
const awsConfig = require('../awsConfig.json');
var aws = require('aws-sdk');
aws.config.update(awsConfig);
let docClient = new aws.DynamoDB.DocumentClient();
const addUrl = function (url) {
    let shortUrl = urlnum++;
    docClient.put({"TableName": "urldb", Item: {"shortif": `${shortUrl}`, "longUrl": url}}, function (err, data) {
        if (err) {
            console.log("ERROR: " + JSON.stringify(err));
        } else {
            console.log(data); 
        }
    });
    return shortUrl;
};
const getLongUrl = function (url) {
};
const PORT = process.env.PORT || 5000;
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false}));
app.get("/", (req, res) => {
    res.render('index');
});
app.get("/:shortUrl", async (req, res) => {
    let hook = req.params.shortUrl;
    docClient.get({TableName: "urldb", Key: {"shortif": hook}}, function (err, data) { // parseInt because in db, the id is a number
        if (err) {
            res.send("ERROR: " + JSON.stringify(err));
        } else {
            if (data.Item) {
                console.log(data.Item.longUrl);
                res.redirect(data.Item.longUrl);
            } else {
                console.log("URL Not Found");
                res.sendStatus(404);
            }
        }
    });
});
app.post("/shortUrls", (req, res) => {
    let fullUrl = req.body.fullUrl;
    let shortUrl = addUrl(fullUrl);
    console.log(fullUrl);
    console.log(`localhost:5000/${shortUrl}`);
    res.redirect('/');
});
app.listen(PORT, () => console.log(`server started, listening PORT ${PORT}`));
