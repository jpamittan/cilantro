var TAG = '[_FeedController]';
var req = require('rekuire');
var parser = require('xml2json');
var Utility = req('Utility');

function _FeedController(req, options) {
  if (typeof req === 'undefined') {
    throw new Error('Please pass the request to the constructor.');
  }
  this.req = req;
  this.options = options;
}

_FeedController.prototype.getInteraksyonFeeds = function (cb, result) {
  var ACTION = '[getFeeds]';
  
  var url = sails.config.rss_feeds.interaksyon;

  Feed.request(url, function(err, data) {
    try {
      data = parser.toJson(data,{ object:true });
    } catch(exception){
      return cb(null,null);
    }

    if (err) {
      return cb(err);
    }

    var feeds = [];
    if (data.rss.channel.item) {
      data.rss.channel.item.forEach( function(item, index){
        
        if (!item.title) {
          return cb(null,feeds);
        }

        var description = Utility.decodeFeedsSpecialChars(item.description);
        var title = Utility.decodeFeedsSpecialChars(item.title);
        
        var feed = {
          title: title,
          description: description,
          image: item.photo['$t']?item.photo['$t']:item.photo,
          published_date: item.pubDate?item.pubDate:'',
          published_date_epoch: item.pubDate?Math.floor(new Date(item.pubDate).getTime() / 1000):''
        };

        if (typeof(item.link) == "string") {
          feed.link = item.link;
        } else {
          feed.link = item.link[0];
        }

        feeds.push(feed);
      });
    }

    return cb(null, feeds);
  });

};

_FeedController.prototype.getLifestyleFeeds = function (cb, result) {
  var ACTION = '[getFeeds]';
  
  var url = sails.config.rss_feeds.lifestyle;

  Feed.request(url, function(err, data) {
    try {
      data = parser.toJson(data,{ object:true });
    } catch(exception){
      return cb(null,null);
    }

    if (err) {
      return cb(err);
    }
    var feeds = [];
    if (data.rss.channel.item) {
      data.rss.channel.item.forEach( function(item, index){

        if (!item.title) {
          return cb(null,feeds);
        }

        var description = Utility.decodeFeedsSpecialChars(item.description);
        var title = Utility.decodeFeedsSpecialChars(item.title);
        
        var feed = {
          title: title,
          description: description,
          image: item.custom_fields && item.custom_fields['headline-image']?
            item.custom_fields['headline-image']:item.photo,
          published_date: item.pubDate?item.pubDate:'',
          published_date_epoch: item.pubDate?Math.floor(new Date(item.pubDate).getTime() / 1000):''
        };

        if (typeof(item.link) == "string") {
          feed.link = item.link;
        } else {
          feed.link = item.link[0];
        }

        feeds.push(feed);
      });
    }

    return cb(null, feeds);
  });

};

_FeedController.prototype.getInfotechFeeds = function (cb, result) {
  var ACTION = '[getFeeds]';
  
  var url = sails.config.rss_feeds.infotech;

  Feed.request(url, function(err, data) {
    try {
      data = parser.toJson(data,{ object:true });
    } catch(exception){
      return cb(null,null);
    }
    if (err) {
      return cb(err);
    }
    var feeds = [];
    if (data.rss.channel.item) {
      data.rss.channel.item.forEach( function(item, index){
        
        if (!item.title) {
          return cb(null,feeds);
        }

        var description = Utility.decodeFeedsSpecialChars(item.description);
        var title = Utility.decodeFeedsSpecialChars(item.title);
        
        var feed = {
          title: title,
          description: description,
          image: item.custom_fields && item.custom_fields['headline-image']?
            item.custom_fields['headline-image']:'',
          published_date: item.pubDate?item.pubDate:'',
          published_date_epoch: item.pubDate?Math.floor(new Date(item.pubDate).getTime() / 1000):''
        };

        if (typeof(item.link) == "string") {
          feed.link = item.link;
        } else {
          feed.link = item.link[0];
        }

        feeds.push(feed);
      });
    }

    return cb(null, feeds);
  });

};

_FeedController.prototype.getMotoringFeeds = function (cb, result) {
  var ACTION = '[getFeeds]';
  
  var url = sails.config.rss_feeds.motoring;

  Feed.request(url, function(err, data) {
    try {
      data = parser.toJson(data,{ object:true });
    } catch(exception){
      return cb(null,null);
    }

    if (err) {
      return cb(err);
    }
    var feeds = [];
    if (data.rss.channel.item) {
      data.rss.channel.item.forEach( function(item, index){

        if (!item.title) {
          return cb(null,feeds);
        }

        var description = Utility.decodeFeedsSpecialChars(item.description);
        var title = Utility.decodeFeedsSpecialChars(item.title);
        
        var feed = {
          title: title,
          description: description,
          image: item['media:content']?item['media:content'].url:'',
          published_date: item.pubDate?item.pubDate:'',
          published_date_epoch: item.pubDate?Math.floor(new Date(item.pubDate).getTime() / 1000):''
        };

        if (typeof(item.link) == "string") {
          feed.link = item.link;
        } else {
          feed.link = item.link[0];
        }

        feeds.push(feed);
      });
    }

    return cb(null, feeds);
  });

};

_FeedController.prototype.getSportsFeeds = function (cb, result) {
  var ACTION = '[getFeeds]';
  
  var url = sails.config.rss_feeds.sports;

  Feed.request(url, function(err, data) {
    try {
      data = parser.toJson(data,{ object:true });
    } catch(exception){
      return cb(null,null);
    }

    if (err) {
      return cb(err);
    }
    var feeds = [];
    if (data.rss.channel.item) {
      data.rss.channel.item.forEach( function(item, index){
          
        if (!item.title) {
          return cb(null,feeds);
        }

        var description = Utility.decodeFeedsSpecialChars(item.description);
        var title = Utility.decodeFeedsSpecialChars(item.title);
        

        var feed = {
          title: title,
          description: description,
          image: item.custom_fields && item.custom_fields['social-media-image']?
            item.custom_fields['social-media-image']:'',
          published_date: item.pubDate?item.pubDate:'',
          published_date_epoch: item.pubDate?Math.floor(new Date(item.pubDate).getTime() / 1000):''
        };

        if (typeof(item.link) == "string") {
          feed.link = item.link;
        } else {
          feed.link = item.link[0];
        }

        feeds.push(feed);
      });
    }

    return cb(null, feeds);
  });

};

_FeedController.prototype.getEntertainmentFeeds = function (cb, result) {
  var ACTION = '[getFeeds]';
  
  var url = sails.config.rss_feeds.entertainment;

  Feed.request(url, function(err, data) {
    try {
      data = parser.toJson(data,{ object:true });
    } catch(exception){
      return cb(null,null);
    }

    if (err) {
      return cb(err);
    }
    var feeds = [];
    if (data.rss.channel.item) {
      data.rss.channel.item.forEach( function(item, index){

        if(!item.title){
          return cb(null,feeds);
        }

        var description = Utility.decodeFeedsSpecialChars(item.description);
        var title = Utility.decodeFeedsSpecialChars(item.title);
        
        var feed = {
          title: title,
          description: description,
          image: item.custom_fields && item.custom_fields['headline-image']?
            item.custom_fields['headline-image']:'',
          published_date: item.pubDate?item.pubDate:'',
          published_date_epoch: item.pubDate?Math.floor(new Date(item.pubDate).getTime() / 1000):''
        };

        if (typeof(item.link) == "string") {
          feed.link = item.link;
        } else {
          feed.link = item.link[0];
        }

        feeds.push(feed);
      });
    }

    return cb(null, feeds);
  });

};

module.exports = _FeedController;
