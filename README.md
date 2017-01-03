## civicrm
Allow to fetch data from a civicrm server.
It covers all the entities civicrm api exposes (more than 80) and the basic crud methods. Yes, it can create, update or delete too.

It's assumed you are familiar with the civicrm api, checkout the [documentation](http://wiki.civicrm.org/confluence/display/CRMDOC/API+Reference) if you aren't sure.

To avoid running too many queries at the same time and flood the civicrm server, it has a build in queue that doesn't send more than 8 requests in parallel.

you can adjust that by setting config.concurrency = 8;

## Installation
$npm install civicrm

## Examples


### get the first 25 individuals 

    var config = {
      server:'http://example.org',
      path:'/sites/all/modules/civicrm/extern/rest.php',
      key:'your key from settings.civicrm.php',
      api_key:'the user key'
    };
    var crmAPI = require('civicrm')(config);

    crmAPI.get ('contact',{contact_type:'Individual',return:'display_name,email,phone'},
      function (result) {
        for (var i in result.values) {
          val = result.values[i];
         console.log(val.id +": "+val.display_name+ " "+val.email+ " "+ val.phone);
        }
      }
    );

### create a new contact

    crmAPI.create ('contact',{contact_type:'Individual','first_name':'John','last_name':'Doe'},
      function (result) {
        if (result.is_error) {
           console.log('ERROR '+ result.error_message);
        } else {
           console.log('CREATED CONTACT '+ result.id);
        }
      }
    );

### delete contact id 42

    crmAPI.delete ('contact',{id:42},
      function (result) {
        if (result.is_error) {
           console.log('ERROR '+ result.error_message);
        } else {
           console.log('DELETED CONTACT '+ result.id);
        }
      }
    );


### lower access 
All the above actions relies on the lower level call method. You can call it directly if there is another action you need.
For instance the get above can also be called:

    crmAPI.call ('contact','get',{contact_type:'Individual',return:'display_name,email,phone'},
      function (result) {
        for (var i in result.values) {
          val = result.values[i];
         console.log(val.id +": "+val.display_name+ " "+val.email+ " "+ val.phone);
        }
      }
    );
## Synchronous calls
Sometimes, it's just easier to wait until the data is fetched from the server.

   crmAPI.getSync 
   
#Other node libraries

If you want to interract with a local crm, Tim Otten's civicrm-cv https://github.com/civicrm/cv-nodejs is a wrapper for interacting with a local CiviCRM instance (in the current folder). You may call cv sub-commands such as api, url, vars:show, or php:eval.

It aims to be a shim enabling grunt, gulp, protractor or other node-based CLI tools to manipulate the local Civi site (without any extra configuration or hard-coded paths).

