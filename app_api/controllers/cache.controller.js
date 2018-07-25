var cache = require('memory-cache');

const timeToKeep = 3600000; // time to keep token in cache in milliseconds => 60 minutes
const keyName = 'access_token'; // memory cache key name

const addTokenToMemCache = function(keydata){
    if (!cache.get(keyName)){
        if (keydata !== null) {
            cache.put(keyName, keydata, timeToKeep);
            console.log('token added to memory cache');
        } else {
            console.log('no data to add to cache');
        }
    } else {
        console.log('access token already exists');
    }
}

const getTokenFromMemCache = function(keyname){
    if (keyname === keyName) {
        let data = cache.get(keyname);
        if (data === null) {
            console.log('no data returned');
        } else {
            console.log('token retrieved from cache: ' + data);
            console.log(cache.keys())
            return data;
        }
    }
}

const deleteAllCacheEntries = function() {
    cache.clear();
}

module.exports = {
    addTokenToMemCache,
    getTokenFromMemCache,
    deleteAllCacheEntries
  }