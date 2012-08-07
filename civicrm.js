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
var crmAPI = function civicrm (options) {
  this.options = options;
};

p = crmAPI.prototype;

p.urlize = function (entity,action) {
  return this.options.server +this.options.path+ '?' + qs.stringify ({ 
    entity: entity,
    action: action,
  });
}

p.call = function (entity,action,params,callback) {
  var post = {};
  if (typeof(params) === "object") {
    post = params;
  } else {
    post = { id: params }
  }
  post.sequential= 1;
  post.json = 1;
  post.key = this.options.key;
  post.api_key = this.options.api_key;
  var uri =  this.urlize(entity,action);
  request({
    uri:this.urlize(entity,action),method:'POST',
    form: post}
    ,function(error, response, body){
       if (!error && response.statusCode == 200) {
         try {
           callback (JSON.parse(body));
         } catch (e) {
           callback ({is_error:false,error_message:body})
         }
       } else {
         console.log(uri);
         callback ({is_error:1, error_message: 'invalid url '+uri});
       }
  });
};

//TODO add an error first param ? + option to throw it
//
p.get = function (entity, params,callback) {
  this.call (entity,'get',params,callback);
}

p.getSingle = function (entity, params,callback) {
  this.call (entity,'getsingle',params,callback);
}

p.create = function (entity, params,callback) {
  this.call (entity,'create',params,callback);
}

p.update = function (entity, params,callback) {
  // todo, test if params.id is set
  this.call (entity,'create',params,callback);
}

p.delete = function (entity, params,callback) {
  this.call (entity,'delete',params,callback);
}

module.exports = crmAPI;
