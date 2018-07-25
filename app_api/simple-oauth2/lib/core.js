'use strict';

const Promise = require('bluebird');
const utils = require('./utils');
const HTTPError = require('./error');

const request = Promise.promisify(require('request'), {
  multiArgs: true,
});

/**
 * Parse the oauth server response
 * Decides wether or not the response is accepted
 * @param  {response} response raw response object
 * @param  {Object} body
 * @param  {Function} callback
 * @return {Promise}
 */
function parseReponse(response, body) {
  try {
    body = JSON.parse(body);
  } catch (e) {
    /* The OAuth2 server does not return a valid JSON */
  }

  if (response.statusCode >= 400) {
    return Promise.reject(new HTTPError(response.statusCode, body));
  }

  return Promise.resolve(body);
}

module.exports = (config) => {
  // makes an http request
  function call(method, uri, params) {
    const options = Object.assign({}, { method, uri }, config.http);

    // api authenticated call sent using headers
    if (params.access_token && !params[config.client.idParamName]) {
      options.headers.Authorization = `Bearer ${params.access_token}`;

      delete params.access_token;

    // oauth2 server call used to retrieve a valid token
    } else if (config.options.useBasicAuthorizationHeader &&
      config.client.id &&
      !params[config.client.idParamName]) {
      const basicHeader = utils.getAuthorizationHeaderToken(config.client.id, config.client.secret);
      options.headers.Authorization = `Basic ${basicHeader}`;
    }

    if (Object.keys(params).length === 0) params = null;

       options.body = 'grant_type=client_credentials';
       // console.log(params)

    return request(options);
  }

  // High level method to call API
  function api(method, url, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = {};
    }

    return call(method, url, params)
      .spread(parseReponse)
      .nodeify(callback);
  }

  return {
    call,
    api,
  };
};
