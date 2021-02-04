const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require("mongoose");
const EmailService = require("../server/services/email");
var assert = chai.assert;
const server = require('../server/index');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
    db
} = require('../server/db');

const should = chai.should();
chai.use(chaiHttp);


describe('forgotpassword API Tests', function () {

    describe('POST /send-reset-email', function () {
        it('should send email to valid email id present in db',  function (done) {
            try {
                chai.request('http://localhost:8000')
                    .post('/api/auth/send-reset-email')
                    .send({
                            email: 'squadc007@gmail.com'
                    })
                    .end(function (err, res) {
                        if (err){
                            done(err);
                        }
                        assert.equal(res.body.status, 'Ok');
                        done()
                    })
                }
                catch (err) {
                    done(err);
                }
            }).timeout(10000);  
        it('should not send email to invalid email id',  function (done) {
            try {
                chai.request('http://localhost:8000')
                    .post('/api/auth/send-reset-email')
                    .send({
                            email: 'squadc07@gmail.com'
                    })
                    .end(function (err, res) {
                    //    it's always returning res
                        assert.equal(res.error.status, 409);
                        done()
                    })
                }
                catch (err) {
                    done(err);
                }
            }).timeout(10000);  
    });

    describe('POST /reset-password', function () {
        it('should  verify  token if token is not expired',  function (done) {
            try {
                const email = 'sanjaynextpage@gmail.com';
                var token = jwt.sign({exp: Math.floor(Date.now() / 1000) + (60 * 60),email_id:email},  'i am a tea pot');
                chai.request('http://localhost:8000')
                    .get('/api/auth/reset-password/'+token)
                    .redirects(0)
                    .end(function (err, res) {
                        if (err){
                            done(err);
                        }
                        assert.equal(res.redirect, true);
                        assert.equal(res.headers.location, 'http://localhost:8000/reset?email='+email)
                        done()
                    })
                }
                catch (err) {
                    done(err);
                }
        }); 
        it('should not verify  token if its expired',  function (done) {
            try {
                var token = jwt.sign({exp: Math.floor(1514745000000 / 1000) + (60 * 60),email_id:'sanjaynextpage@gmail.com'},  'i am a tea pot');
                chai.request('http://localhost:8000')
                    .get('/api/auth/reset-password/'+token)
                    .end(function (err, res) {
                        //    it's always returning res
                        const response = JSON.parse(res.error.text) 
                        assert.equal(response.name, 'TokenExpiredError');
                        done()
                    })
                }
                catch (err) {
                    done(err);
                }
        });  
    });


    describe('POST /update-password', function () {
        it('should update password',  function (done) {
            try{
                chai.request('http://localhost:8000')
                    .post('/api/auth/update-password')
                    .send({
                            email: 'squadc007@gmail.com',
                            password:'11111'
                    })
                    .end(function (err, res) {
                        if (err){
                            done(err);
                        }
                        bcrypt.compare('11111', res.body.password, function(err, res) {
                            assert.equal(res, true);
                            done()
                        });
                        
                    })
            }
            catch (err) {
                done(err);
            }
        });
        it('should return error for invalid email id which is not registered',  function (done) {
           try{
            chai.request('http://localhost:8000')
                .post('/api/auth/update-password')
                .send({
                        email: 'sanjayxxxxx@gmail.com',
                        password:'11111'
                })
                .end(function (err, res) {
                        // it's always returning res
                    assert.equal(res.body.message, 'Email is not registerd');
                    done()
                })
            }
            catch (err){
                done(err)
            }
        });   
    });


});