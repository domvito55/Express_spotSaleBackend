const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const JWTstrategy = require('passport-jwt').Strategy;
const User = require('../models/user.model');

const envConfig = require('./env');

module.exports = function() {

    var jwtOptions = {};
    jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
    jwtOptions.secretOrKey = envConfig.SECRETKEY;

    // console.log("local.js: " + envConfig.ATLASDB);

    passport.use(
        'tokencheck',
        new JWTstrategy(
            // {
            //     secretOrKey: envConfig.SECRETKEY,
            //     jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
            // },
            jwtOptions
            ,
            async (token, done) => {
                try {
                    console.log(token);
                    return done(null, token.payload);
                } catch (error) {
                    console.log(error);
                    done(error);
                }
            }
        )
    );

    passport.use(
        'login',
        new LocalStrategy((username, password, done)=>{
        User.findOne({username: username}, (err, user)=>{
            console.log('=====> LocalStrategy');
            
            if (err) {
                return done(err);
            }
            
            if (!user) {
                return done(null, false, {
                    message: 'Unknown user'
                });
            }
    
            if (!user.authenticate(password)) {
                return done(null, false, {
                    message: 'Invalid password'
                });
            }
            
            return done(null, user);
        });
    }));
};
