import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from './model/message';
import { Event } from './model/event';

import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:8000';

@Injectable()
export class SocketService {
    private socket;
    private namespace: string;
    public initSocket(chat): void {
        this.namespace = `${SERVER_URL}/chat/${chat._id}`;
        this.socket = socketIo(this.namespace);
    }

    public initUser(email: String): void {
        this.socket.emit('register', email);
    }

    public send(message: Message): void {
        this.socket.emit('message', message);
    }

    public onMessage(): Observable<Message> {
        return new Observable<Message>(observer => {
            this.socket.on('message', (data: Message) => observer.next(data));
        });
    }

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }
}
