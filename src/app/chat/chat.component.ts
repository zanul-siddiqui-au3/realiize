import { Component, OnInit } from '@angular/core';
import { SocketService } from './socket.service';
import { Action } from './model/action';
import { Event } from './model/event';
import { Message } from './model/message';
import { User } from './model/user';
import { ChatService } from './../chat.service';
import { BPAuthService } from './../auth/bp-auth.service';
import { AuthUserService } from './../auth.user.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  chat: { _id: string };
  conversations: any[];
  action = Action;
  from: User;
  to: User;
  messages: Message[] = [];
  messageContent: string;
  email: string;
  ioConnection: any;
  loggedInUser: any;
  users: any;

  constructor(
    private socketService: SocketService,
    private chatService: ChatService,
    private authService: BPAuthService,
    private userService: AuthUserService
  ) { }

  ngOnInit() {
    this.chatService.getAll()
      .subscribe(data => {
        this.conversations = data.conversations;
      });
    // this.userService.getUser()
    //   .subscribe(data){
    //     this.loggedInUser = data;
    //   }
    this.authService.me()
      .subscribe((data) => {
        if (data) {
          this.loggedInUser = data;
        }
      });
  }

  selectConversation = ($event, conversation) => {
    this.chat = conversation;
    this.chatService.getOne(this.chat._id)
      .subscribe(data => {
        this.messages = data.messages;
        this.initIoConnection();
      });
  }

  private initIoConnection(): void {
    this.socketService.initSocket(this.chat);

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {
        this.messages.push(message);
      });

    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }
    this.from = this.loggedInUser;
    this.socketService.send({
      from: this.from,
      to: this.to,
      message: message
    });
    this.messages.push({ 'message': message, 'from': this.from });
    this.messageContent = null;
  }

  private selectUserForChat(user: any): void {
    this.to = user;
    this.chatService.getUserConversation(this.loggedInUser, this.to)
      .subscribe((data) => {
        this.messages = data;
      });
  }

}
