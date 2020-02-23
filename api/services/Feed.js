var TAG = '[Feed]';

module.exports = {

  request: function(url, cb) {
    var ACTION = '[get]';
    var _this = this;
    var ref_num = Utility.getRefNum();

    var options = {
      url: url,
      timeout: 20000,
    };

    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('FEED', options, ref_num, function(err, result){
      if (err) {
        cb(err);
      } else {
        cb(null, result);
      }
    });
  },
};