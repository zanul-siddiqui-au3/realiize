
      
      import * as mongoose from 'mongoose';
      const ObjectId = mongoose.Schema.Types.ObjectId;
      
      export const TestSchema = mongoose.Schema( {
    invoice: {
        type: String,
        required: false
    }
}, { timestamps: true });
      TestSchema.index(
      {"invoice":"text"}
    )
      