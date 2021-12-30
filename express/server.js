'use strict';
const express = require('express');
const puppeteer = require("puppeteer");
const app = express();
const path = require('path');
const serverless = require('serverless-http');

//const bodyParser = require('body-parser');
const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});
//How to Run the code 
//http://localhost:3000/pdf?target=https://stackoverflow.com/questions/14417592/node-js-difference-between-req-query-and-req-params

router.get('/pdf', async (req, res) => {
    const url = req.query.target;
console.log('url',url);
    const browser = await puppeteer.launch({
        headless: true
    });

    const webPage = await browser.newPage();

    await webPage.goto(url, {
        waitUntil: "networkidle0"
    });

    const pdf = await webPage.pdf({
        printBackground: true,
        format: "Letter",
        margin: {
            top: "20px",
            bottom: "40px",
            left: "20px",
            right: "20px"
        }
    });

    await browser.close();

    res.contentType("application/pdf");
    res.send(pdf);
})
//app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
