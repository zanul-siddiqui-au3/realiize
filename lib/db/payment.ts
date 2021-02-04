import * as mongoose from 'mongoose';

export const PaymentSchema = mongoose.Schema({
    type: {
        type: String,
        enum: ['refund', 'subscription']
    },
    email: {
        type: String,
        required: true
    },
    cardToken: {
        type: String,
        required: false
    },
    chargeId: {
        type: String,
        required: function () { return this.type !== 'subscription'; }
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
    },
    stripeCustomerId: {
        type: String,
    },
    transactionId: {
        type: String,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    currency: {
        type: String,
        required: true
    },

    failureCode: {
        type: String
    },
    failureMessage: {
        type: String
    },
    gateWay: {
        type: String,
        required: true
    },
    subscriptionId: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});


PaymentSchema.index({ 'orderId': 1 });

