var TAG = '[hermosa][v1][UsageController]';
var req = require('rekuire');
var matrixx = req('Matrixx');
var _UsageController = req('_UsageController');
var _AccountController = req('_AccountControllerHermosa');
var _GroupController = req('_GroupController');

module.exports = {
  
  get: function(req, res) {
    var ACTION = '[get]';
    var _usageController = new _UsageController(req);
    var _accountController = new _AccountController(req);
    var _groupController = new _GroupController(req);
    Logger.log('debug', TAG + ACTION + ' request params ', req.params);

    var obj = {
      data: [
        {
          date: '2016-6-27T02:48:12.000Z',
          unit: 'megabytes',
          value: '200',
          display: '200MB'
        },
        {
          date: '2016-6-28T02:48:12.000Z',
          unit: 'megabytes',
          value: '10',
          display: '10MB'
        },
        {
          date: '2016-6-29T02:48:12.000Z',
          unit: 'megabytes',
          value: '100',
          display: '100MB'
        },
        {
          date: '2016-6-30T02:48:12.000Z',
          unit: 'megabytes',
          value: '50',
          display: '50MB'
        }
      ],
      voice: [
        {
          date: '2016-6-27T02:48:12.000Z',
          unit: 'minutes',
          value: '25',
          display: '25 minutes'
        },
        {
          date: '2016-6-28T02:48:12.000Z',
          unit: 'text',
          value: '7',
          display: '7 minutes'
        },
        {
          date: '2016-6-29T02:48:12.000Z',
          unit: 'text',
          value: '40',
          display: '40 minutes'
        },
        {
          date: '2016-6-30T02:48:12.000Z',
          unit: 'text',
          value: '5',
          display: '5 minutes'
        }
      ],
      sms: [
        {
          date: '2016-6-27T02:48:12.000Z',
          unit: 'texts',
          value: '25',
          display: '25 texts'
        },
        {
          date: '2016-6-28T02:48:12.000Z',
          unit: 'texts',
          value: '99',
          display: '99 texts'
        },
        {
          date: '2016-6-29T02:48:12.000Z',
          unit: 'texts',
          value: '10',
          display: '10 texts'
        },
        {
          date: '2016-6-30T02:48:12.000Z',
          unit: 'texts',
          value: '20',
          display: '20 texts'
        }
      ]
    }
    res.ok(obj);

    // async.auto({
    //   getSubscriber: _accountController.getSubscriber.bind(_accountController),
    //   getGroup: ['getSubscriber', _groupController.getGroup.bind(_groupController)],
    //   getPreviousUsage: ['getGroup', _usageController.getPreviousUsage.bind(_usageController)],
    //   getGroupUsage: [ 'getPreviousUsage', _usageController.getGroupUsage.bind(_usageController)]
    // }, function(err, results) {
    //   if (err) return res.error(err);
    //   var obj = _usageController.format(results);
    //   res.ok(obj);
    // });
  },

} 