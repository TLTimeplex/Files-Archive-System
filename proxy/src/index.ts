import fs from 'fs';
import https from 'https';
import express from 'express';
import httpProxy from 'http-proxy';

const app = express();
const apiProxy = httpProxy.createProxyServer();

// Weiterleitung von HTTP zu HTTPS
/*
app.use((req, res, next) => {
  if (req.secure) {
    // Wenn die Anfrage bereits über HTTPS erfolgt, weitermachen
    next();
  } else {
    // Ansonsten HTTP-Anfrage umleiten
    res.redirect(`https://${req.headers.host}${req.url}`);
  }
});
*/

// API-Route
app.use('/api', (req, res) => {
  apiProxy.web(req, res, { target: 'http://localhost:3000' });
});

// Fallback-Route für alle anderen Anfragen
app.get('*', (req, res) => {
  apiProxy.web(req, res, { target: 'http://127.0.0.1:2000' });
});

// SSL-Zertifikat laden
const sslOptions = {
  key: fs.readFileSync('./cert/privkey.pem'),
  cert: fs.readFileSync('./cert/fullchain.pem'),
};

// Starten Sie den Server mit HTTPS
https.createServer(sslOptions, app).listen(443, () => {
  console.log('Server listening on port 443 (HTTPS)');
});

// Starten Sie den Server mit HTTP
app.listen(80, () => {
  console.log('Server listening on port 80 (HTTP)');
});