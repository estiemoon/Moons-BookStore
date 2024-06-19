const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const { promisify } = require('util');
dotenv.config();
const secret = process.env.PRIVATE_KEY
const redis = require('redis');


module.exports = {

    sign : (user) => {
        const payload = {
            email : user.email ,
            id : user.id
        }
        return jwt.sign(payload, 
                        secret,
                        {expiresIn : "1 min",
                        issuer : "moon"})
    },
    verify : (token) => {
        let user = null;
        try{
            user = jwt.verify(token,secret);
            return {
                ok : true,
                id: user.id,
                email : user.email
            }
        } catch (err) { //만료시
            return {
                ok: false,
                message: err.message
            };
        }
    },
    refresh : () => {
        return jwt.sign({}, secret, 
                        {expiresIn : "5 mins",issuer : "moon"})
    },
    refreshVerify : async (token,userId) => {
        const redisClient = redis.createClient(process.env.REDIS_PORT);
        await redisClient.connect();

        try {
            const data = await redisClient.get(toString(userId));
            console.log("data : ", data);
            console.log("token : ", token);
            if (token == data) {
                try{
                    jwt.verify(token, secret);
                    return {
                        ok : true
                    };
                } catch(err) {
                    return {
                        ok : false,
                        message: err.message
                    }
                }
            } else {
                return false;
            }

            } catch (err) {
                return false;
            }
        }
}