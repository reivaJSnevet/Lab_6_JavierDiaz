// npm install para descargar los paquetes...

// Librerías
import 'dotenv/config';

// Importar paquetes
import express from 'express';
import oktaPkg from '@okta/oidc-middleware';
const { ExpressOIDC } = oktaPkg;
import http from 'http';
import { Server } from 'socket.io';
import openidConnectPkg from 'express-openid-connect';
const { auth, requiresAuth } = openidConnectPkg;
import path from 'path';
import cookieParser from 'cookie-parser';
import unalib from './unalib/index.js';

const app = express();
app.use(cookieParser());
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

const OKTA_ISSUER_URI = process.env.OKTA_ISSUER_URI;
const OKTA_CLIENT_ID = process.env.OKTA_CLIENT_ID;
const OKTA_CLIENT_SECRET = process.env.OKTA_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const SECRET = process.env.SECRET;
const APP_BASE_URL = process.env.APP_BASE_URL;

// Configuración de Auth0
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: SECRET,
  baseURL: APP_BASE_URL,
  clientID: OKTA_CLIENT_ID,
  issuerBaseURL: OKTA_ISSUER_URI,
};

let oidc = new ExpressOIDC({
  issuer: OKTA_ISSUER_URI,
  client_id: OKTA_CLIENT_ID,
  client_secret: OKTA_CLIENT_SECRET,
  redirect_uri: REDIRECT_URI,
  routes: { callback: { defaultRedirect: REDIRECT_URI } },
  scope: 'openid profile',
  appBaseUrl: APP_BASE_URL
});

app.use(auth(config));
app.use(oidc.router);

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

// root: presentar html
app.get('/chat', requiresAuth(), function (req, res) {

  var payload = Buffer.from(req.appSession.id_token.split('.')[1], 'base64').toString('utf-8');
  const user = JSON.parse(payload);

  console.log(user);
  res.cookie('user', JSON.stringify(user));

  res.sendFile(path.join(process.cwd(), 'chat.html'));
});

app.get('logout', (req, res) => {
  req.logout();
  /* res.clearCookie('user'); */
  res.redirect('/');
});

// Escuchar conexiones de socket
io.on('connection', (socket) => {
  console.log('Un usuario se ha conectado');

  // Escuchar "Evento-Mensaje-Server"
  socket.on('Evento-Mensaje-Server', (msg) => {
    // Validar el mensaje con unalib
    const validatedMessage = unalib.validateMessage(msg);

    // Emitir el mensaje validado a todos los clientes conectados
    io.emit('Evento-Mensaje-Server', validatedMessage);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Cambiar http.listen a server.listen
server.listen(port, function () {
  console.log('Escuchando en *:' + port);
});
