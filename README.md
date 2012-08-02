## civicrm
Allow to fetch data from a civicrm server.
It covers all the entities civicrm api exposes (more than 80) and the basic crud methods. Yes, it can create, update or delete too.

It's assumed you are familiar with the civicrm api, checkout the [documentation](http://wiki.civicrm.org/confluence/display/CRMDOC/CiviCRM+Public+APIs) if you aren't sure.

## Installation
$npm install civicrm

## Examples


example: display the first 25 contacts

    crmAPI = require('civicrm');
    var config = {
      server:'http://example.org',
      path:'/sites/all/modules/civicrm/extern/rest.php',
      key:'your key from settings.civicrm.php',
      api_key:'the user key'
    };
    crmAPI.init (config);

    crmAPI.call ('contact','get',{contact_type:'Individual',return:'display_name,email,phone'},
      function (result) {
        for (var i in result.values) {
          val = result.values[i];
         console.log(val.id +": "+val.display_name+ " "+val.email+ " "+ val.phone);
        }
      }
    );

