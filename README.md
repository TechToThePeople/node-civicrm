## civicrm
Allow to fetch data from a civicrm server.
It covers all the entities civicrm api4 exposes and the basic crud methods. Yes, it can create, update or delete too. Yes, it can chain api calls, the whole magic.

It's assumed you are familiar with the civicrm api, checkout the [documentation](https://docs.civicrm.org/dev/en/latest/api/) if you aren't sure.


## Installation

$npm install civicrm

## Examples


### get the first 25 contacts

    const config = {
      server:'http://example.org',
      //path: if not under /civicrm/ajax/rest/api4
      //key:'your key from settings.civicrm.php', mostly not needed
      api_key:'the user key'
    };
    const crmAPI = require('civicrm')(config);

    const results = await this.crmAPI.get("Contact", {
      select: [
        "first_name",
        "last_name",
        "display_name",
        "phone_primary.phone",
        "email_primary.email",
        "address_primary.country_id:abbr",
        "address_primary.postal_code",
        "address_primary.city",
        "address_primary.street_address",
      ],
      limit: 25,
    });
    results.values.forEach ( (val: any) =>
      console.log(val.id +": "+val.display_name+ " "+val['email_primary.email']+ " "+ val["phone.primary.phone"])
    );


### create a new contact

    const r = await crmAPI.create ('Contact',{
      values: {
        first_name: contact.firstName,
        last_name: contact.lastName || null,
        //external_identifier: contact.contactRef, // creates problems if the contact exists in trash
        source: source,
      }});
    console.log(r);

### delete contact id 42

    const result = await crmAPI.delete ('contact',{where: [["id", "=", 42]]}),
    if (result.is_error) {
      console.log('ERROR '+ result.error_message);
    } else {
      console.log('DELETED CONTACT '+ result.id);
    }
    );


## underlying api

All the above actions relies on the lower level API4 method. You can call it directly if there is another action you need.
For instance the get above can also be called:

    const result = await crmAPI.api4 ('Contact','get',{...});

all the features of API4 are available, including the 4th parameter "index", for instance to format the list of countris as a map with the iso code being the key and the id the value:

    const countries = await this.crmAPI.get(
      "Country",
      {
        select: ["id", "iso_code", "row_count"],
        limit: 9999,
      },
      { iso_code: "id" }
    );


## access legacy api3

PR welcome!
