import fs from 'fs';
import https from 'https';
import express from 'express';
import httpProxy from 'http-proxy';

const app = express();
const apiProxy = httpProxy.createProxyServer();

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
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem'),
};

// Starten Sie den Server mit HTTPS
https.createServer(sslOptions, app).listen(443, () => {
  console.log('Server listening on port 443 (HTTPS)');
});

// Starten Sie den Server mit HTTP
app.listen(80, () => {
  console.log('Server listening on port 80 (HTTP)');
});