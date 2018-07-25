const memCache = require('../controllers/cache.controller');
const memCacheKeyName = 'access_token';

const credentials = {
  client: {
    id: process.env.NVM_CLIENT_ID,
    secret: process.env.NVM_API_TOKEN
  },
  auth: {
    tokenHost: process.env.NVM_HOST ,
    tokenPath: process.env.NVM_PATH
  },
  http: {
    headers: { 'Content-Type' : 'application/x-www-form-urlencoded'}
  },
  options: {
    useBasicAuthorizationHeader: true,
  }
};

const oauth2 = require('../simple-oauth2/index').create(credentials);

const postNvmToken = async function () {
  try {
      const result = await oauth2.authorizationCode.getToken()
      const accessToken = oauth2.accessToken.create(result);
      memCache.addTokenToMemCache(accessToken['token']);
  } catch (error) {
      console.log('Access Token Error', error.message);
  }
}

const getNvmToken = function(req, res) {
  if (!memCache.getTokenFromMemCache(memCacheKeyName)) {
      postNvmToken();
      setTimeout(function(){
        let data = memCache.getTokenFromMemCache(memCacheKeyName);
        res.send(data);;
      }, 400);
  } else {
      let data = memCache.getTokenFromMemCache(memCacheKeyName);
      res.send(data);
  }
}

module.exports = {
  getNvmToken
}