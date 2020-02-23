var TAG = '[hermosa][v1][DeviceController]';
var req = require('rekuire');
var Validation = req('Validation');

module.exports = {
  
  update: function(req, res) {
    var ACTION = '[updateDevice]';
    var validation = new Validation();
    Logger.log('debug', TAG + ACTION + ' request body ', req.body);
    
    var params = validation.containKeys(require('rekuire')('update_device_token'), req.body);
    if (!params.valid) return res.error(params.error);

    Notifier.updateDevice(req.body.old_device_token, req.body.new_device_token, req.body.os, req.account.cilantro_id, function(err, data) {
      if (err) return res.error(err);
      res.ok({success: 'Device Token Updated'});
    });
  }

}