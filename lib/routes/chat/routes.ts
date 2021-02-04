import * as express from 'express';
import * as StandardError from 'standard-error';
import * as status from 'http-status';
import { User, Chat, Message } from './../../db/index';
import { AuthenticatedRequest } from 'lib/interfaces/authenticated-request';
import { chatService } from '../../services/chat';


export class ChatRoutes {

  public static async createConversation(req: AuthenticatedRequest, res: express.Response, next) {
    try {
      const chat = await Chat.create({ users: [req.user._id, req.params.recipient] });
      res.json({ chat });
    } catch (error) {
      next(error);
    }
  }

  public static async getUserConversations(req: AuthenticatedRequest, res: express.Response, next) {
    try {
      const conversations = await Chat.find({ users: req.user.id })
        .populate('users');
      res.json({ conversations });
    } catch (error) {
      next(error);
    }
  }

  public static async getConversationMessages(req: AuthenticatedRequest, res: express.Response, next) {
    try {
      const chat = await Chat.findOne({ _id: req.params.chat, users: req.user._id });
      if (!chat) {
        throw new StandardError({ message: 'User Not Authorized', status: status.UNAUTHORIZED });
      }
      chatService.establishNameSpace(chat);
      const messages = await Message
        .find({ chat: req.params.chat })
        .sort({ createdAt: 1 });
      res.json({ messages });
    } catch (error) {
      next(error);
    }
  }

  public static async messageHistory(req: express.Request, res: express.Response, next) {
    try {
      res.sendStatus(status.OK);
    } catch (error) {
      next(error);
    }
  }


  public static async listOfUser(req: express.Request, res: express.Response, next) {
    try {
      res.json(await User.find().lean());
    } catch (error) {
      next(error);
    }
  }

  public static async getUserConversation(req: express.Request, res: express.Response, next) {
    try {
      const { from, to } = req.body;
      const user = [from._id, to._id];
      const userData = await Chat.findOne({ 'users': { $all: user } });
      if (userData) {
        res.json(await Message.find({ 'chat': userData._id }));
      } else {
        res.json([]);
      }
    } catch (error) {
      next(error);
    }
  }
}
