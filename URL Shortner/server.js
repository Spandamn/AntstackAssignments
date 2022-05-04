const express = require('express');
const app = express();
const UrlDb = {};
let urlnum = 1000;
const addUrl = function (url) {
    if (UrlDb[url]) return UrlDb[url].shortLink;
    let shortUrl = urlnum++;
    UrlDb[url] = {
        shortLink: shortUrl,
        longLink: url
    };
    return shortUrl;
};
const getLongUrl = function (url) {
    let allUrls = Object.keys(UrlDb);
    for (const i of allUrls) {
        if (UrlDb[i].shortLink === url) return UrlDb[i].longLink;
    }
    return null;
};
const PORT = process.env.PORT || 5000;
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false}));
app.get("/", (req, res) => {
    res.render('index');
});
app.get("/:shortUrl", async (req, res) => {
    let hook = req.params.shortUrl;
    let longUrl = getLongUrl(hook);
    console.log(hook);
    console.log(longUrl);
    if (longUrl) {
        res.redirect(longUrl);
    } else {
        res.sendStatus(404);
    }
});
app.post("/shortUrls", (req, res) => {
    let fullUrl = req.body.fullUrl;
    let shortUrl = addUrl(fullUrl);
    console.log(fullUrl);
    console.log(`localhost:5000/${shortUrl}`);
    res.redirect('/');
});
app.listen(PORT, () => console.log(`server started, listening PORT ${PORT}`));
