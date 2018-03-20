const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJoi = require('express-joi');
const md5 = require('md5');
var Joi = expressJoi.Joi;
const passport = require('passport');
const passportJWT = require('passport-jwt');
const async = require('async');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

var models = require('../models');
var status = require('../config/status');
var auth = require('../config/auth');

const router = express.Router();

//passport
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = auth.superSecret;
router.use(passport.initialize());
var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    // usually this would be a database call:

    var user = models.User.User.findOne({
        _id: jwt_payload.id
    }, function (err, agent) {
        // console.log(agent)
        if (agent) {
            next(null, agent);
        } else {
            next(null, false);
        }
    })
});
passport.use('userjwt',strategy);
/////////////

//Signup
var Joi = {
    first_name: expressJoi.Joi.types.String().min(3).max(10).required(),
    last_name: expressJoi.Joi.types.String().min(3).max(10).required(),
    email: expressJoi.Joi.types.String().min(3).max(55),
    mobile: expressJoi.Joi.types.String().min(3).max(15).required(),
    password: expressJoi.Joi.types.String().min(3).max(55).required()
}
router.post('/signup', expressJoi.joiValidate(Joi), 
    (req, res) => {
        req.body.password = md5(req.body.password);
        console.log(req.body);
        models.User.User(req.body).save((err, data) => {
            if (err) {
                res.json({
                    status: status.status.ERROR.BAD_REQUEST,
                    message: err
                });
            } else {
                res.json({
                    status: status.status.SUCCESS.DEFAULT,
                    message: 'User added successfully',
                    data: data
                });
            }
        });
    }
);

//Login
var Joi = {
    email: expressJoi.Joi.types.String().min(3).max(55),
    password: expressJoi.Joi.types.String().min(3).max(55).required()    
}
router.post('/login', expressJoi.joiValidate(Joi), 
    (req, res) => {
        models.User.User.findOne({
            email: req.body.email
        }, (err, user) =>{  
            if(err) throw err
            if(!user){
                res.json({
                    status: status.status.ERROR.NOT_FOUND,
                    message: err
                });
            } else if(user) {
                if(user.password != md5(req.body.password)){
                    res.json({
                        status: status.status.ERROR.BAD_REQUEST,
                        message: "Invalid password"
                    })
                } else {
                    var payload = {
                        id: user.id
                    }
                    var token = jwt.sign(payload, auth.superSecret, {
                        expiresIn: 60 * 60 * 24 * 30
                    });
                    res.json({
                        status: status.status.SUCCESS.DEFAULT,
                        message: 'Login successful',
                        token: token,
                        user: user
                    });
                }
            }
        })
    }
);

//Add Todos
var Joi = {
    user_id: expressJoi.Joi.types.String().min(3).max(55),
    todo_name : expressJoi.Joi.types.String().min(3).max(55),
    details: expressJoi.Joi.types.String().min(3).max(555)
}
router.post('/addTodo', [ expressJoi.joiValidate(Joi), passport.authenticate('userjwt', { session: false })], 
    (req, res) => {
        models.todos.Todo(req.body).save(function (err, data) {
            if (err) {
                res.json({
                    status: status.status.BAD_REQUEST,
                    message: err
                });
            } else {
                res.json({
                    status: status.status.SUCCESS.DEFAULT,
                    message: 'To-do added successfully.',
                    data: data
                });
            }
        });
    }
);

//Get Todos
router.get('/getTodos', [passport.authenticate('userjwt', { session: false } )], 
    (req, res) => {
        models.todos.Todo.find((err, data) => {
            if(err){
                res.json({
                    status: status.status.ERROR.NOT_FOUND,
                    message: err
                });
            } else {
                res.json({
                    status: status.status.SUCCESS.DEFAULT,
                    data: data
                })
            }
        });
    }
);

//Delete Todos
var Joi = {
    todo_id: expressJoi.Joi.types.String().min(3).max(55)
}
router.delete('/deletetodo', expressJoi.joiValidate(Joi), [passport.authenticate('userjwt',{ session: false })], 
    (req, res) => {
        models.todos.Todo.remove(
            {_id: req.body.todo_id}, 
            (err, data) => {
                if(err){
                    res.json({
                        status: status.status.ERROR.BAD_REQUEST,
                        message: err
                    });
                } else {
                    res.json({
                        status: status.status.SUCCESS.DEFAULT,
                        message: 'To-Do deleted successfully.',
                        data: data
                    });
                }
            }
        )
    }
);

//Search Todos
router.get('/search', [ passport.authenticate('userjwt', { session: false } )], 
    (req, res) => {
        var todo_name = req.query.todo_name;
        var search = { todo_name: {$regex: todo_name}};
        models.todos.Todo.findOne(search,(err, data) => {
            if(err) {
                res.json({
                    status: status.status.ERROR.BAD_REQUEST,
                    message: err
                });
            } else {
                res.json({
                    status: status.status.SUCCESS.DEFAULT,
                    data: data
                });
            }
        })
    }
);

module.exports = router;