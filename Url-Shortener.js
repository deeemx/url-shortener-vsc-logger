const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const validUrl = require('valid-url');
// paste exel working since i learnt
const app = express();
const PORT = 3000;

const urlDatabase = {}; //brace fixing #

app.use(bodyParser.json());

const isValidUrl = (url) => validUrl.isUri(url);
// paste header
app.post('/shorten', (req, res) => {
    const { longUrl, customAlias } = req.body;

    if (!longUrl || !isValidUrl(longUrl)) {
        return res.status(400).json({ error: 'Invalid URL provided' });
    }

    const shortId = customAlias || shortid.generate();

    if (customAlias && urlDatabase[customAlias]) {
        return res.status(409).json({ error: 'This custom alias is already in use' });
    }

    urlDatabase[shortId] = {
        longUrl,
        clicks: 0,
        createdAt: new Date().toISOString(),
    };
//add your own site
    res.json({ shortUrl: `http://localhost:${PORT}/${shortId}` });
});

app.get('/:shortId', (req, res) => {
    const { shortId } = req.params;

    const entry = urlDatabase[shortId];
    if (!entry) {
        return res.status(404).json({ error: 'Shortened URL not found' });
    }

    entry.clicks += 1;
    res.redirect(entry.longUrl);
});
// deleted all help 
app.get('/:shortId/stats', (req, res) => {
    const { shortId } = req.params;

    const entry = urlDatabase[shortId];
    if (!entry) {
        return res.status(404).json({ error: 'Shortened URL not found' });
    }
// litterallt no need for this
    res.json({
        longUrl: entry.longUrl,
        clicks: entry.clicks,
        createdAt: entry.createdAt,
    });
});
//mutex
app.get('/admin/list', (req, res) => {
    res.json(urlDatabase);
});
//dm .d.m.x. on dc for help
app.delete('/:shortId', (req, res) => {
    const { shortId } = req.params;

    if (!urlDatabase[shortId]) {
        return res.status(404).json({ error: 'Shortened URL not found' });
    }

    delete urlDatabase[shortId];
    res.json({ message: 'Shortened URL successfully deleted' });
});

app.listen(PORT, () => {
    console.log(`URL shortener is up and running at http://localhost:${PORT}`);
});
