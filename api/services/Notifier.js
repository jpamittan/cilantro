var TAG = '[Notifier]';
var SNS = require('sns-mobile');
var req = require('rekuire');
var android, ios;

module.exports = {

  initialize: function(req, res) {
    var ACTION = '[initialize]';
    Logger.log('debug', TAG + ACTION, 'Initialize Notifier.');
    android = new SNS({
      platform: SNS.SUPPORTED_PLATFORMS.ANDROID,
      region: sails.config.sns.region,
      apiVersion: sails.config.sns.api_version,
      accessKeyId: sails.config.sns.key_id,
      secretAccessKey: sails.config.sns.access_key,
      platformApplicationArn: sails.config.sns.android_arn,
    });
    ios = new SNS({
      platform: SNS.SUPPORTED_PLATFORMS.IOS,
      region: sails.config.sns.region,
      apiVersion: sails.config.sns.api_version,
      accessKeyId: sails.config.sns.key_id,
      secretAccessKey: sails.config.sns.access_key,
      platformApplicationArn: sails.config.sns.ios_arn,
      sandbox: true // comment out in prod
    });
  },

  notify: function(device, message) {
    var ACTION = '[notify]';
    if (device != undefined) {
      switch(device.device_os) {
        case 'android':
          android.sendMessage(device.device_arn, message, 
            function(err, messageId) {
              if(err) {
                // TODO handle disabled endpoints
                Logger.log('error', TAG + ACTION, err);
              }
          });
          break;
        case 'ios':
          ios.sendMessage(device.device_arn, message,
            function(err, messageId){
              if(err) {
                // TODO handle disabled endpoints
                Logger.log('error', TAG + ACTION, err);
              }
          });
          break;
      }
    }
  },

}