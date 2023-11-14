const axios = require("axios");
var request = require("request");
var qs = require("qs");
var _ = require("underscore");
var async = require("async");
/*
ex:
var config = {
  server:'http://example.org',
  path:'/sites/all/modules/civicrm/extern/rest.php',
  key:'your key from settings.civicrm.php',
  api_key:'the user key'
};
*/
class crmAPI {
  constructor(options) {
    this.options = {
      path: "/civicrm/rest/api4",
      sequential: 1,
      json: 1,
      debug: false,
      ...options,
    };

    this.headers = {
      "Content-Type": "application/json;charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Civi-Auth": "Bearer " + this.options.api_key,
      Authorization: "Bearer " + this.options.api_key,
    };
    if (options.key) this.headers["X-Civi-Key"] = options.key;
  }

  urlize = function (entity, action) {
    return (
      this.options.server + this.options.path + "/" + entity + "/" + action
    );
    const separator = this.options.server.includes("?") ? "&" : "?";
    return (
      this.options.server +
      this.options.path +
      separator +
      qs.stringify({
        entity: entity,
        action: action,
      })
    );
  };

  debug = function (enable) {
    this.options.debug = enable || true;
  };

  call = async (entity, action, params) => {
    let axiosConfig = {
      headers: this.headers,
    };

    const uri = this.urlize(entity, action);
    if (this.options.debug)
      console.log(
        "->api." + entity + "." + action, params
      );
    const r = await axios.post(uri, { params: JSON.stringify(params) }, axiosConfig);

    if (!r.data) {
      throw new Error(r);
    }
    return r.data;
  };

  get = async (entity, params) => {
    //  this.queue.push({entity:entity, action:"get",params:params,callback:callback});
console.log(params);
    return this.call(entity, "get", params);
  };

  getSingle = async (entity, params) => {
    return this.call(entity, "getsingle", params, callback);
  };

  getQuick = function (entity, params, callback) {
    this.call(entity, "getquick", params, callback);
  };

  create = function (entity, params, callback) {
    this.call(entity, "create", params, callback);
  };

  update = function (entity, params, callback) {
    // todo, test if params.id is set
    this.call(entity, "create", params, callback);
  };

  delete = function (entity, params, callback) {
    this.call(entity, "delete", params, callback);
  };
}

var crmFactory = function (options) {
  return new crmAPI(options);
};

module.exports = crmFactory;
