import * as express from 'express';
import { ChatRoutes } from './routes';
import { Middleware } from '../../services/middleware';

export class ChatRouter {
    router: express.Router;
    constructor() {
        this.router = express.Router();
        this.router.use(new Middleware().requireLogin);
        this.router.get('/', ChatRoutes.getUserConversations);
        this.router.get('/:chat', ChatRoutes.getConversationMessages);
        this.router.post('/:receiver', ChatRoutes.createConversation);
    }
}

