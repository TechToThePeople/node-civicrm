var request = require('request');
var qs = require('qs');
var _ = require("underscore");
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
  this.options= {
    path:'/sites/all/modules/civicrm/extern/rest.php',
    sequential:1,
    json:1,
  };
  _.extend(this.options,options);
};

p = crmAPI.prototype;

p.urlize = function (entity,action) {
  return this.options.server +this.options.path+ '?' + qs.stringify ({ 
    entity: entity,
    action: action,
  });
}

p.call = function (entity,action,params,callback) {
  var post = _.clone(this.options);
  delete post['action'];
  delete post['entity'];
  delete post['server'];
  delete post['path'];

  if (typeof(params) === "object") {
    if (Object.keys(params).some ( function(key) { //if chained api calls, transform in json
        return (typeof params[key] == "object");
      })) {
        _.extend(post,params);
        post.json =JSON.stringify(post);
    } else {
      _.extend(post,params);
    }
  } else {
    post.id=params;
  }
  var uri =  this.urlize(entity,action);
  request({
    uri:this.urlize(entity,action),method:'POST',
    form: post}
    ,function(error, response, body){
       if (!error && response.statusCode == 200) {
         try {
           callback (JSON.parse(body));
         } catch (e) {
           console.log("couldn't parse "+ body);
           callback ({is_error:1,error_message:"couldn't parse "+body})
         }
       } else {
         console.log(uri);
         callback ({is_error:1, error_message: 'invalid url '+uri, error_code:'invalid_url',uri:uri,values:[]});
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

var crmFactory = function (options){
  return new crmAPI(options);
}

module.exports = crmFactory;
