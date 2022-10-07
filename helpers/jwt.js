
const { expressjwt: expressJwt }         = require('express-jwt');


function authJwt() { 
    const secret = process.env.secret;
    const api = process.env.API_URL;

    return expressJwt ({
        secret,
        algorithms: ["HS256"],
        isRevoked: isRevoked

    }).unless({
        path: [
            // {url: '/api/v1/products', method: ['GET', 'OPTIONS']},
            // {url: '/api/v1/categories', method: ['GET', 'OPTIONS']},
            {url: /\/public\/uploads(.*)/, method: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/products(.*)/, method: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/categories(.*)/, method: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/users(.*)/, method: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/orders(.*)/, method: ['GET', 'OPTIONS']},
            `${api}/users/login`,
            `${api}/users/register`
        ]
    })
};


async function isRevoked(req, token) {
    // console.log(payload);
    if(token.payload.isAdmin == false) {
        console.log('Not Admin');
        return true;
    }
    console.log('Admin');
    return false
}


// export the function
module.exports = authJwt;