import * as mongoose from 'mongoose';

export const ChatSchema = mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});
