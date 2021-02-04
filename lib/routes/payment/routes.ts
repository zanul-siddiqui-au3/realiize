import * as express from 'express';
import * as status from 'http-status';
import * as Stripe from 'stripe';
import { User, Payment } from './../../db/index';
import { stripeService } from './../../services/stripe-service';
import { PaymentErrorHandlerService } from './payment-error-handler';
import * as StandardError from 'standard-error';
import { payPalService } from './../../services/paypal-service';
import { EmailService } from './../../services/email';
import { UsersHelpers } from './helpers/user.helper';

export class PaymentRoutes {

   
    public static async getPayments(req, res, next) {
        const loggerInUserDetails = req.user;
        const payments = await Payment.find({ user: loggerInUserDetails._id });
        const paymentClone = JSON.parse(JSON.stringify(payments))
        for (let i = 0; i < paymentClone.length; i++) {
            const data = await stripeService.getCardDetails(paymentClone[i].stripeCustomerId, paymentClone[i].cardToken)
            paymentClone[i]['cardDetails'] = data
        }
        res.json(paymentClone);
    }

    public static async getPaymentsById(req , res , next){
        const {id} = req.params;
        const userDetails = await User.findById(id);
        const payments = await Payment.find({user : userDetails._id});
        const paymentClone = JSON.parse(JSON.stringify(payments));
        for (let i = 0; i < paymentClone.length; i++) {
            const data = await stripeService.getCardDetails(paymentClone[i].stripeCustomerId, paymentClone[i].cardToken)
            paymentClone[i]['cardDetails'] = data
        }
        res.json(paymentClone);
    }

    public static async getUserCardDetails(req , res, next){
        const {defaultCardToken , stripeCustomerId} = await User.findById(req.params.userId);
        if(defaultCardToken && stripeCustomerId){
            let cardDetails = await stripeService.getCardDetails(stripeCustomerId, defaultCardToken)
            res.json(cardDetails)
        }else{
            res.json({message : 'Not a Subscribed User'})
        }
    }


    public static async createCharge(req, res, next) {
        const loggerInUserDetails = req.user;
        const chargeData = req.body.chargeData;
        let customer;
        if (!loggerInUserDetails.stripeCustomerId && chargeData.saveThisCard) {
            try {
                customer = await stripeService.createCustomer({ loggerInUserDetails, chargeData });
                console.log(customer)
                const user = await User.findByIdAndUpdate(loggerInUserDetails._id,
                    {
                        '$push': { cardTokens: chargeData.token.card.id },
                        stripeCustomerId: customer.id,
                        defaultCardToken: customer.default_source,
                    }, { new: true });
                loggerInUserDetails.stripeCustomerId = customer.id;
                const charge = await stripeService.createChargeWithSavedCard({ loggerInUserDetails, chargeData });
                const payment = await await stripeService.createPayment({ loggerInUserDetails, charge });
                res.json(payment);
            } catch (error) {
                PaymentErrorHandlerService.PaymentErrorHandleError(error, next);
            }
        } else if (loggerInUserDetails.stripeCustomerId && chargeData.saveThisCard) {
            try {
                const source = await stripeService.createSource({ loggerInUserDetails, chargeData });
                const user = await User.findByIdAndUpdate(loggerInUserDetails._id, { $push: { cardTokens: source.id } }, { new: true });
                const charge = await stripeService.createChargeWithSource({ loggerInUserDetails, chargeData, source });
                const payment = await stripeService.createPayment({ loggerInUserDetails, charge });
                res.json(payment);
            } catch (error) {
                PaymentErrorHandlerService.PaymentErrorHandleError(error, next);
            }
        } else {
            try {
                const charge = await stripeService.createChargeWithOutSavedCard(chargeData);
                const payment = await stripeService.createPayment({ loggerInUserDetails, charge });
                res.json(payment);
            } catch (error) {
                PaymentErrorHandlerService.PaymentErrorHandleError(error, next);
            }
        }
    }

    public static async changeSavedCard(req, res, next){
        try {
           const {customer_id , card_token , _id} = req.body;
           const newCard = await stripeService.addNewCard({customer_id , card_token});
           if(newCard){
               const customer = await stripeService.updateDefaultCard({customer_id , card_id : newCard.id});
               if(customer){
                    const updatedUser = await User.update({_id : _id} , {$addToSet : {'cardTokens' : newCard.id} , defaultCardToken : newCard.id});
                    res.json(updatedUser);
               }
           }
        } catch (error) {
            PaymentErrorHandlerService.PaymentErrorHandleError(error, next);
        }
    }


    public static async retrieveSavedCard(req, res, next) {
        const loggerInUserDetails = req.user;
        try {
            if (loggerInUserDetails && loggerInUserDetails.stripeCustomerId) {
                const cardList = await stripeService.listAllCards(loggerInUserDetails);
                if (cardList && cardList.data && cardList.data.length > 0) {
                    res.json(cardList.data);
                } else {
                    res.sendStatus(status.NO_CONTENT);
                }
            } else {
                res.sendStatus(status.NO_CONTENT);
            }
        } catch (error) {
            PaymentErrorHandlerService.PaymentErrorHandleError(error, next);
        }
    }

    public static async chargeSavedCard(req, res, next) {
        try {
            const loggerInUserDetails = req.user;
            const chargeData = req.body.chargeData;
            const charge = await stripeService.createChargeWithSavedCard({ loggerInUserDetails, chargeData });
            const payment = await stripeService.createPayment({ loggerInUserDetails, charge });
            res.json(payment);
        } catch (error) {
            PaymentErrorHandlerService.PaymentErrorHandleError(error, next);
        }
    }

    public static async chargeGuestCard(req, res, next) {
        try {
            const chargeData = req.body.chargeData;
            const charge = await stripeService.createChargeWithOutSavedCard(chargeData);
            const loggerInUserDetails = { email: chargeData.email };
            const payment = await stripeService.createPayment({ loggerInUserDetails, charge });
            res.json(payment);
        } catch (error) {
            PaymentErrorHandlerService.PaymentErrorHandleError(error, next);
        }
    }

    public static async savePayPalPayment(req, res, next) {
        const loggerInUserDetails = req.user;
        const payPalData = req.body.paypalResponse;
        const payment = await payPalService.savePayPalPayment(loggerInUserDetails, payPalData);
        res.json(payment);
    }

    public static async saveCard(req, res, next) {
        const loggerInUserDetails = req.user;
        const { chargeData } = req.body;
        try {
            if (!loggerInUserDetails.stripeCustomerId) {
                const customer = await stripeService.createCustomer({ loggerInUserDetails, chargeData });
                const user = await User.findByIdAndUpdate(loggerInUserDetails._id,
                    {
                        '$push': { cardTokens: chargeData.token.card.id },
                        stripeCustomerId: customer.id,
                        defaultCardToken: customer.default_source,
                    }, { new: true });
                res.json(user);
            } else {
                const source = await stripeService.createSource({ loggerInUserDetails, chargeData });
                const user = await User.findByIdAndUpdate(loggerInUserDetails._id, { $push: { cardTokens: source.id } }, { new: true });
                res.json(user);
            }
        } catch (error) {
            PaymentErrorHandlerService.PaymentErrorHandleError(error, next);
        }
    }

    public static async deleteCard(req, res, next) {
        const loggerInUserDetails = req.user;
        const email = req.user.email;
        const { chargeData } = req.body;
        try {
            const confirmation = await stripeService.deleteCard({ loggerInUserDetails, chargeData });
            if (confirmation.deleted) {
                let updatedUser;
                const user = await User.findByIdAndUpdate(loggerInUserDetails._id,
                    { $pull: { cardTokens: chargeData.source } }, { new: true });
                if (user.cardTokens && user.cardTokens.length > 0) {
                    user.defaultCardToken = user.cardTokens[0];
                    updatedUser = await user.save();
                } else {
                    user.defaultCardToken = '';
                    updatedUser = await user.save();
                }
                res.json(updatedUser);
            }
        } catch (error) {
            PaymentErrorHandlerService.PaymentErrorHandleError(error, next);
        }
    }

    public static async createSubscriptionCharge(req, res, next) {
        try {
            const userDetails = req.user;
            var chargeData = req.body.chargeData;
            const email = new EmailService();
            let customer;
            if (!userDetails.stripeCustomerId) {
                try {
                    customer = await stripeService.createCustomer({
                        loggerInUserDetails: userDetails,
                        chargeData
                    });
                    userDetails.stripeCustomerId = customer.id;
                    const sub = await stripeService.createSubscription(userDetails);
                    await stripeService.createSubscriptionPayment({ loggerInUserDetails: userDetails, sub }, customer.default_source);
                    await User.findByIdAndUpdate(
                        userDetails._id,
                        {
                            $push: { cardTokens: chargeData.token.card.id },
                            stripeCustomerId: customer.id,
                            defaultCardToken: customer.default_source,
                            subscriptionActiveUntil: sub.current_period_end,
                            subscriptionId: sub.id
                        },
                        { new: true }
                    );
                    await email.newSubscriptionEmail(userDetails);
                    res.json(sub);
                } catch (error) {
                    PaymentErrorHandlerService.PaymentErrorHandleError(error, next);
                    await email.sendEmail({subject : 'Subscricption not made successfully' , email  : userDetails.email , data : `Something went wrong ${error.message}` })

                }
            } else {
                try {
                    const sub = await stripeService.createSubscription(userDetails);
                    await stripeService.createSubscriptionPayment({ loggerInUserDetails: req.user, sub });
                    await User.findByIdAndUpdate(
                        userDetails.id,
                        {
                            subscriptionActiveUntil: sub.current_period_end,
                            subscriptionId: sub.id
                        },
                        { new: true }
                    );
                    await email.newSubscriptionEmail(userDetails);
                    res.json(sub);
                } catch (error) {
                    PaymentErrorHandlerService.PaymentErrorHandleError(error, next);
                    await email.sendEmail({subject : 'Subscricption not made successfully' , email  : userDetails.email , data : `Something went wrong ${error.message} ` })
                }
            }
        } catch (error) {
            PaymentErrorHandlerService.PaymentErrorHandleError(error, next);
        }
    }


    public static async cancelRenewal(req, res, next) {
        try {
            let userDetails = req.user;
            const email = new EmailService();
            if (req.body.subId) { // The case when admin cancels renewal
                const subsciber = await UsersHelpers.findAll({ 'subscriptionId': req.body.subId });
                userDetails = subsciber[0];
            }
            const subscriptionId = req.body.subId || req.user.subscriptionId;
            try {
                const sub = await stripeService.cancelSubscription(subscriptionId);
                userDetails.subscriptionCancellationRequested = true;
                await userDetails.save();
                await email.sendCancellationEmail(userDetails);
                res.json(sub);
            } catch (error) {
                PaymentErrorHandlerService.PaymentErrorHandleError(error, next);
            }
        } catch (error) {
            PaymentErrorHandlerService.PaymentErrorHandleError(error, next);
        }
    }
}
