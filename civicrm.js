var request = require('request');
var qs = require('qs');
var _ = require("underscore");
var async = require('async');
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
    concurrency:8, // max number of queries to run in parallel
  };
  _.extend(this.options,options);

  this.queue = async.queue(function(query,callback) {
    p.directcall.call (query.this,query.entity,query.action,query.params,function(r){
      callback();
      query.callback(r);
    });
//function (data) {callback(data)});
  //process.nextTick();
 /* 
    if (r.is_error) {
      if (r.sql && r.sql.indexOf("nativecode=1213") !== -1) {
        console.log("deadlock, retry");
       this.call (query.entity,query.action,query.params,function(r){callback();query.callback(r)});
       });
      } else {
        callback();
      }
    } else {
      callback();
    }
  });
*/
  }, this.options.concurrency);



};

p = crmAPI.prototype;

p.urlize = function (entity,action) {
  return this.options.server +this.options.path+ '?' + qs.stringify ({ 
    entity: entity,
    action: action,
  });
}

p.directcall = function (entity,action,params,callback) {
  var post = _.clone(this.options);
  delete post['action'];
  delete post['entity'];
  delete post['server'];
  delete post['path'];

  if (typeof(params) === "object") {
    if (Object.keys(params).some ( function(key) { //if chained api calls, transform in json
        return (typeof params[key] == "object");
      })) {
        post.json =JSON.stringify(params);
    } else {
      _.extend(post,params);
    }
  } else {
    post.id=params;
  }
  var uri =  this.urlize(entity,action);
  request.post({uri:uri,
    form: post}
    ,function(error, response, body){
       if (!error && response.statusCode == 200) {
         try {
           callback (JSON.parse(body));
         } catch (e) {
           callback ({is_error:1,error_message:"couldn't parse "+body})
         }
       } else {
        if (response.statusCode >= 500 && response.statusCode < 600) { // 50x error, let's retry once
          request.post({uri:uri,form: post}
            ,function(error, response, body){
               if (!error && response.statusCode == 200) {
                 try {
                   callback (JSON.parse(body));
                 } catch (e) {
                   callback ({is_error:1,error_message:"couldn't parse "+body})
                 }
               } else {
                callback ({is_error:1, http_code:response.statusCode ,error_message: 'http error '+uri, error_code:'http_'+response.statusCode,uri:uri,values:[]});
               }
            });
        } else {
          callback ({is_error:1, http_code:response.statusCode ,error_message: 'http error '+uri, error_code:'http_'+response.statusCode,uri:uri,values:[]});
        }
      }
  });
};

p.call = function (entity,action,params,callback) {
  this.queue.push({this:this,entity:entity, action:action,params:params,callback:callback});
}
p.get = function (entity, params,callback) {
//  this.queue.push({entity:entity, action:"get",params:params,callback:callback});
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
