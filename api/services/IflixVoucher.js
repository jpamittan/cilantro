var TAG = '[IflixVoucher]';
var req = require('rekuire');
var spiels = req('spiels');
var constants = req('constants');
var _NotificationController = req('_NotificationController');

module.exports = {
  purchase: function(cilantro_id, type, callback) {
    var ACTION = '[purchase]';
    var _notificationController = new _NotificationController({params: {id: cilantro_id}}, constants.notif.type.iflix);
    //to do get iflix from platform
    Iflix.findOne({status: 'unclaimed'}, function(err, iflix_voucher) {
      var obj = {
        cilantro_id: cilantro_id,
        status: 'claimed',
        purchased_at: new Date()
      };
      if (iflix_voucher == undefined) { // No more iflix vouchers
        return callback();
      }
      Iflix.update({id: iflix_voucher.id}, obj, function(err, voucher){
        if (err) {
          Logger.log('error', TAG + ACTION, err);
          return callback(Errors.raise('DB_ERROR'));
        }
        var notification = JSON.parse(JSON.stringify(spiels.iflix[type]));
        notification.msg = notification.msg.replace(/%voucher_code%/g, voucher[0].vcode);

        _notificationController.createNotification(function(){}, {notification: notification});
        Notifier.notify(cilantro_id, notification.msg);

        callback(null, voucher);
      });
    });
  },
};