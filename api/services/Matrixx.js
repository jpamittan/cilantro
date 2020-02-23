var TAG = "[Matrixx]";
var req = require('rekuire');
var Subscriber = req('_subscriberParser');
var Group = req('_groupParser');
var ProductOffer = req('_productOfferParser');
var Device = req('_deviceParser');

module.exports = {

  registerSubscriber: function(body, callback) {
    Subscriber.register(body, function(err, result){
      callback(err, result);
    });
  },

  createSubscriber: function(body, callback) {
    Subscriber.create(body, function(err, result){
      callback(err, result);
    });
  },

  getSubscriber: function(body, callback) {
    Subscriber.get(body, function(err, result){
      callback(err, result);
    });
  },

  getDevice: function(body, callback) {
    Device.get(body, function(err, result){
      callback(err, result);
    });
  },

  getSubscriberPurchaseBalance: function(body, callback) {
    Subscriber.getPurchaseBalance(body, function(err, result){
      callback(err, result);
    });
  },

  modifySubscriber: function(body, callback) {
    Subscriber.modify(body, function(err, result){
      callback(err, result);
    });
  },

  modifyDevice: function(body, callback) {
    Device.modify(body, function(err, result){
      callback(err, result);
    });
  },

  addGroup: function(body, callback) {
    Group.add(body, function(err, result){
      callback(err, result);
    });
  },

  getGroup: function(body, callback) {
    Group.get(body, function(err, result){
      callback(err, result);
    });
  },

  createDevice: function(body, callback) {
    Device.create(body, function(err, result){
      callback(err, result);
    });
  },

  changeIMSI: function(body, callback) {
    Device.changeIMSI(body, function(err, result){
      callback(err, result);
    });
  },
  
  purchase: function(body, callback) {
    ProductOffer.purchase(body, function(err, result){
      callback(err, result);
    });
  },

  setupPurchase: function(body, callback) {
    ProductOffer.setupPurchase(body, function(err, result){
      callback(err, result);
    });
  },
  
  create: function(body, callback) {
    ProductOffer.create(body, function(err, result){
      callback(err, result);
    });
  },  
}
