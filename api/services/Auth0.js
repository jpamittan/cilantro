var TAG = '[Auth0]';
var auth0_client;
var ManagementClient = require('auth0').ManagementClient;

module.exports = {

  update: function(options, cb) {
    var ACTION = '[getNumber]';
    var _this = this;
    var response_desc;
    var ref_num = Utility.getRefNum();    
    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('AUTH0', options, ref_num, function(err, result) {
      if (err) {
        cb(err);
      } else {
        cb(null, result);
      }
    });
  },


  initialize: function() {
    auth0_client = new ManagementClient({
      token: sails.config.auth0.token,
      domain: sails.config.auth0.domain
    });
  },

  getClient: function() {
    if (!auth0_client) {
      this.initialize();
    }
    return auth0_client;
  }

}