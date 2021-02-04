// Get dependencies
import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as socketio from 'socket.io';
import * as busboy from 'connect-busboy';
import * as busboyBodyParser from 'busboy-body-parser';

// Get DB
import * as models from './db';
import * as dotenv from 'dotenv';

// Get our API routes
import { api } from './routes/api';
import { chatService } from './services/chat';

export let io;

try {

  const app = express();

  dotenv.config();
  app.use(busboy());
  // Parsers for POST data
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(busboyBodyParser());

  // Point static path to dist
  app.use(express.static(path.join(__dirname, '../../dist')));

  // Set our api routes
  app.use('/api', api);

  // Catch all other routes and return the index file
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });

  /**
   * Get port from environment and store in Express.
   */
  const port = process.env.PORT || '8000';
  app.set('port', port);

  /**
   * Create HTTP server.
   */
  const server = http.createServer(app);
  chatService.establishSocket(server);
  // io = require('socket.io')(server);
  const user = new Map();

  // io.on('connection', function (socket) {
  //   const chatService = new ChatService(io, socket, user);
  // });


  server.listen(port, () => console.log(`API running on localhost:${port}`));

  module.exports = app;

} catch (error) {
  console.error(error);
  process.exit(1);
}

