const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require("mongoose");
const  Stripe = require('stripe');
const server = require('../server/index');
const {User} = require('../server/db');
const expect = chai.expect;

const should = chai.should();
chai.use(chaiHttp);


const BASE_URL = '/api/payment';

const CUSTOMER_DETAILS = {
    id:1,
    fullName: 'Test User',
    email: 'test@email.com',
    card: {
        "number": '4242424242424242',
        "exp_month": 12,
        "exp_year": 2019,
        "cvc": '123'
    }
};

const user = {
    email : 'bloggeraghu@gmail.com',
    password: 'Test@123'
};

let token;
let customer;
let charge;
let stripe;
let cards;
let userToken;

describe('POST /charge/guestCard', function () {

    before(async function() {
        stripe = new Stripe('sk_test_UzBnNHXu8EO4UaoYPLbcruJ5');
        token = await stripe.tokens.create({card: CUSTOMER_DETAILS.card});
    });

    it('should create charge for unauthenticated user', function (done) {
        let url = `${BASE_URL}/charge/guestCard`;
        const chargeData = {
            'currency': 'usd',
            'amount': 2000,
            'token': token,
            'email': CUSTOMER_DETAILS.email
        };

        chai.request(server)
            .post(url)
            .send({chargeData})
            .end(function (err, res) {
                const paymentResponse = res.body;
                res.should.have.status(200);
                res.should.be.json;
                (paymentResponse.status).should.be.equal('succeeded');
                (paymentResponse.amount).should.be.equal(chargeData.amount);
                (paymentResponse.email).should.be.equal(CUSTOMER_DETAILS.email);
                done();
            });
        });
    });

describe('POST /charge/create', function (done) {

    before(async function() {
        chai.request(server)
        .post('/api/auth/login')
        .send({user})
        .end(function (err, res, done) {
            userToken = res.body.token;
        });

        stripe = new Stripe('sk_test_UzBnNHXu8EO4UaoYPLbcruJ5');
        token = await stripe.tokens.create({card: CUSTOMER_DETAILS.card});

    });

    it('should create charge for authenticated user', function (done) {
        let url = `${BASE_URL}/charge/create`;
        const chargeData = {
            'currency': 'usd',
            'amount': 2000,
            'token': token,
            'email': CUSTOMER_DETAILS.email,
        };

        chai.request(server)
            .post(url)
            .set('authorization',userToken)
            .send({chargeData})
            .end(function (err, res) {
                const paymentResponse = res.body;
                res.should.have.status(200);
                res.should.be.json;
                (paymentResponse.status).should.be.equal('succeeded');
                (paymentResponse.amount).should.be.equal(chargeData.amount);
                (paymentResponse.email).should.be.equal(user.email);
                done();
            });
        });
});


describe('GET /getSavedCard', function (done) {

    before(async function() {
        chai.request(server)
        .post('/api/auth/login')
        .send({user})
        .end(function (err, res, done) {
            userToken = res.body.token;
        });

        stripe = new Stripe('sk_test_UzBnNHXu8EO4UaoYPLbcruJ5');
        token = await stripe.tokens.create({card: CUSTOMER_DETAILS.card});
        customer = await stripe.customers.create({source: token.id, email: user.email});
        CUSTOMER_DETAILS.stripeCustomerId = customer.id;
        await User.update({ 'email': user.email},{ stripeCustomerId: customer.id});    
    });

    it('should get all saved card', function (done) {

        let url = `${BASE_URL}/getSavedCard`;
        chai.request(server)
            .get(url)
            .set('authorization',userToken)
            .send()
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                (res.body.length).should.be.equal(1);
                done();
            });
        });

    after(async function() {
        const result = await stripe.customers.del(`${CUSTOMER_DETAILS.stripeCustomerId}`);
        await User.update({ 'email': user.email},
            { $unset: { stripeCustomerId: ""} })
        expect(result.deleted).to.be.true;        
    });
    
    
});