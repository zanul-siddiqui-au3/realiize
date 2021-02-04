import * as express from 'express';
import { AuthRoutes } from './routes';

export class AuthRouter {
  router: express.Router;
  constructor() {
    this.router = express.Router();
    this.router.post('/registerOauth', AuthRoutes.registerOauth);
    this.router.post('/register', AuthRoutes.register);
    this.router.post('/login', AuthRoutes.login);
    this.router.post('/loginOauth', AuthRoutes.loginOauth);
    this.router.post('/send-reset-email', AuthRoutes.sendResetEmail);
    this.router.get('/reset-password/:token', AuthRoutes.resetPassword);
    this.router.post('/update-password', AuthRoutes.updatePassword);
    this.router.get('/me', AuthRoutes.me);
    this.router.put('/:id/unsubscribe', AuthRoutes.unsubscribe);

  }
}

