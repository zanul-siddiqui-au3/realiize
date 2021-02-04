import { User } from './user';
import { Action } from './action';

export interface Message {
    from?: User;
    to?: User;
    message?: any;
    action?: Action;
}
