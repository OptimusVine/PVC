// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '1016901788348141', // your App ID
        'clientSecret'  : '58d15ce76ecdc7ef2a4e4190b12101a8', // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback'
    },

    'asanaAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/asana/callback'
    },

    'googleAuth' : {
        'clientID'      : '452848708826-bto0jic6j9ulkeief1bm6sbo2v3p6jeg.apps.googleusercontent.com',
        'clientSecret'  : 'uInE434W6-_tsI46plC2j2Dw',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    }

};