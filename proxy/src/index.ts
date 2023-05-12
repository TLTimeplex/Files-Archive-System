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

// Starten Sie den Server
app.listen(80, () => {
  console.log('Server listening on port 80');
});