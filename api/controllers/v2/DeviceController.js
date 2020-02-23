var TAG = '[v2][DeviceController]';
var req = require('rekuire');
var matrixx = req('Matrixx');

module.exports = {

  create: function(req, res) {
    var ACTION = '[create]';
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    
    var obj = {
      external_id: req.body.external_id,
      device_type: req.body.device_type,
      imsi: req.body.imsi,
      msisdn: req.body.msisdn,
      request_reference_no: Utility.getRefNum()
    };
    matrixx.createDevice(obj, function(err, result) {
      if (err) return res.error(err);
      var obj = result;
      obj = JSON.parse(JSON.stringify(obj));
      res.ok(obj);
    });
  },

  update: function(req, res) {
    var ACTION = '[updateDevice]';
    var validation = new Validation();
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    
    var params = validation.containKeys(require('rekuire')('update_device_token'), req.body);
    if (!params.valid) return res.error(params.error);

    Notifier.updateDevice(req.body.old_device_token, req.body.new_device_token, req.body.os, req.params.id, function(err, data) {
      if (err) return res.error(err);
      res.ok({success: 'Device Token Updated'});
    });
  },

};
