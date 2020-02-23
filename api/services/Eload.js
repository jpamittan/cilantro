var TAG = '[Eload]';

module.exports = {

  request: function(url, cb) {
    var ACTION = '[request]';
    var _this = this;
    var ref_num = Utility.getRefNum();

    var options = {
      url: url,
      timeout: 10000,
    };

    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('ELOAD', options, ref_num, function(err, result){
      if (err) {
        cb(err);
      } else {
        cb(null, result);
      }
    });
  },
};