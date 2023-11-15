const axios = require("axios");
//const qs = require('querystring');
/*ex:
var config = {
  server:'http://example.org',
  path:'/civicrm/ajax/rest/api4', (optional, default)
  key:'your key from settings.civicrm.php',(optional)
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

    if (!this.options.server) {
      console.error("missing config.server in the initialization of civicrm API (should be the url of your civi install)");
    }
  }

  urlize = function (entity, action) {
    return (
      this.options.server + this.options.path + "/" + entity + "/" + action
    );

/* api v3?
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
*/
  };

  debug = function (enable) {
    this.options.debug = enable || true;
  };

  api4 = async (entity, action, params, index) => {
    let axiosConfig = {
      headers: this.headers,
    };

    const uri = this.urlize(entity, action);
    if (this.options.debug) console.log("->api." + entity + "." + action, uri, index);
    const r = await axios.post(
      uri,
      { params: JSON.stringify(params), index: index },
      axiosConfig
    );

    if (!r.data) {
      throw new Error(r);
    }
    return r.data;
  };

  get = async (entity, params, index) => {
    return this.api4(entity, "get", params, index);
  };

  create = async (entity, params, index) => {
    return this.api4(entity, "create", params, index || 0);
  };

  update = async (entity, params, index) => {
    // todo, test if params.id is set
    return this.api4(entity, "update", params, index || 0);
  };

  delete = async (entity, params, index) => {
    return this.api4(entity, "delete", params, index || 0);
  };
}

var crmFactory = function (options) {
  return new crmAPI(options);
};

module.exports = crmFactory;
