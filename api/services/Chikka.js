var TAG = '[Chikka]';

module.exports = {

  sendSMS: function(mobile_number, message) {
    var ACTION = '[sendSMS]';
    var _this = this;
    var ref_num = Utility.getRefNum();

    var options = {
      url: sails.config.chikka.url + '/smsapi/request',
      method: 'POST',
      headers: {},
      form: {
        message_type: 'SEND',
        mobile_number: mobile_number,
        shortcode: sails.config.chikka.shortcode,
        message_id: "00000",
        message: message,
        client_id: sails.config.chikka.client_id,
        secret_key: sails.config.chikka.secret_key
      },
    };

    var requestclient = new RequestClient();
    requestclient.request.bind(requestclient);
    requestclient.request('CHIKKA', options, ref_num, function(err, result){
      console.log(err);
    });
  },
};