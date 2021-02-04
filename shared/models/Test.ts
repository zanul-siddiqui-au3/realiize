import * as mongoose from 'mongoose';

export interface Test {
    _id ?: mongoose.Schema.Types.ObjectID;

  invoice: String
}
