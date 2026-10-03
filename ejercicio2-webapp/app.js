const express = require('express');
const os = require('os');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('<h1>Lab 8 - Ejercicio 2</h1><p>Aplicación web hospedada (equivalente a Azure App Service)</p>');
});
app.get('/health', (req, res) => res.json({ estado: 'ok' }));
app.get('/info', (req, res) => res.json({
  sistema: os.type(),
  version: os.release(),
  host: os.hostname(),
  memoriaLibreMB: Math.round(os.freemem() / 1048576),
  cpus: os.cpus().length
}));

app.listen(PORT, () => console.log('App escuchando en puerto ' + PORT));
