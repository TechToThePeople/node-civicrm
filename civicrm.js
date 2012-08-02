var request = require('request');
var qs = require('qs');

/*
ex:
var config = {
  server:'http://example.org',
  path:'/sites/all/modules/civicrm/extern/rest.php',
  key:'your key from settings.civicrm.php',
  api_key:'the user key'
};
*/
var crmAPI = function () {
  this.options ={};
};


crmAPI.init = function (options) {
  this.options = options;
};

crmAPI.urlize = function (entity,action) {
  return this.options.server +this.options.path+ '?' + qs.stringify ({ 
    entity: entity,
    action: action,
  });
}

crmAPI.call = function (entity,action,params,callback) {
  var post = params;
  post.sequential= 1;
  post.json = 1;
  post.key = this.options.key;
  post.api_key = this.options.api_key;
  request({
    uri:this.urlize(entity,action),method:'POST',
    form: post}
    ,function(error, response, body){
       if (!error && response.statusCode == 200) {
        callback (JSON.parse(body));
       } else {
         callback ({is_error:1, error_message: 'invalid url'+uri});
       }
  });
};

crmAPI.get = function (entity, params,callback) {
  this.call (entity,'get',params,callback);
}

module.exports = crmAPI;
