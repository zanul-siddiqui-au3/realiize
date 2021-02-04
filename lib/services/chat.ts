import { Message, Chat } from './../db/index';
import * as socketIo from 'socket.io';
class ChatService {
  io: socketIo.Server;
  namespaces: {
    [id: string]: number;
  } = {};
  establishSocket = (server) => {
    this.io = socketIo(server);
  }

  establishNameSpace = (chat) => {
    // the 'of' function looks up or creates a namespace
    const nsp = this.io.of(`chat/${chat._id.toString()}`);
    if (this.namespaces[chat._id.toString()]) {
      return;
    }

    nsp.on('connect', () => {
      if (!this.namespaces[chat._id.toString()]) {
        this.namespaces[chat._id.toString()] = 0;
      }
      this.namespaces[chat._id]++;
    });

    nsp.on('disconnect', () => {
      this.namespaces[chat._id]--;
    });

    nsp.on('connection', (socket) => {
      socket.on('message', this.createMessageHandler({ nsp, chat }));
    });
  }

  // Helper functions

  createMessageHandler = ({ nsp, chat }: { nsp: socketIo.Namespace, chat: { _id: string } }) => {
    return async (m: any) => {
      await Message.create({
        chat: chat._id,
        sender: m.from._id,
        content: m.content
      });
      nsp.emit('message', m);
    };
  }

  createTypingHandler = (nsp: socketIo.Namespace) => {
    return (user: { _id: string }) => {
      nsp.emit('typing', user);
    };
  }
}

export const chatService = new ChatService();
