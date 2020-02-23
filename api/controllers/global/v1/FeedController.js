var TAG = '[global][v1][FeedController]';
var req = require('rekuire');
var Validation = req('Validation');
var _FeedController = req('_FeedController');
var constants = req('constants');

module.exports = {
  getFeeds: function(req, res) {
    var ACTION = '[getFeeds]';
    var _feedController = new _FeedController(req);
    var validation = new Validation();

    async.auto({
      interaksyon: _feedController.getInteraksyonFeeds.bind(_feedController),
      lifestyle: _feedController.getLifestyleFeeds.bind(_feedController),
      infotech: _feedController.getInfotechFeeds.bind(_feedController),
      motoring: _feedController.getMotoringFeeds.bind(_feedController),
      sports: _feedController.getSportsFeeds.bind(_feedController),
      entertainment: _feedController.getEntertainmentFeeds.bind(_feedController),
    }, function(err, result) {

      if(!result.interaksyon &&
         !result.lifestyle &&
         !result.infotech &&
         !result.motoring &&
         !result.sports &&
         !result.entertainment
         ){
        return res.error(err);
      }
      var merged_array = [];
      if (result.interaksyon) {
        merged_array = merged_array.concat(result.interaksyon);
      }
      if (result.lifestyle) {
        merged_array = merged_array.concat(result.lifestyle);
      }
      if (result.infotech) {
        merged_array = merged_array.concat(result.infotech);
      }
      if (result.motoring) {
        merged_array = merged_array.concat(result.motoring);
      }
      if (result.sports) {
        merged_array = merged_array.concat(result.sports);
      }
      if (result.entertainment) {
        merged_array = merged_array.concat(result.entertainment);
      }
      
      merged_array.sort(function(a, b) {
          if (a.published_date != '') {
            a = new Date(a.published_date);
          } else {
            return 1;
          }

          if (b.published_date != '') {
            b = new Date(b.published_date);
          } else {
            return -1;
          }
          
          return a>b ? -1 : a<b ? 1 : 0;
      });

      var response = {
        feeds: merged_array.splice(0,20),
        response_date: Math.floor(new Date().getTime() / 1000)
      };

      res.ok(response);
    });

  },

};