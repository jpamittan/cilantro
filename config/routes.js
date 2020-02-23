module.exports.routes = {

  //-- Healthcheck
  'GET /jarrak/rualiv3'   : 'HealthCheck.check',

  // ----------------------------------------------
  // HERMOSA
  // ----------------------------------------------

  //-- Account
  'POST   /hermosa/v1/accounts'                   : 'hermosa/v1/Account.create',
  'POST   /hermosa/v1/accounts/:id'               : 'hermosa/v1/Account.link',
  'DELETE /hermosa/v1/accounts/:id'               : 'hermosa/v1/Account.unlink',
  'POST   /hermosa/v1/accounts/:id/activate'      : 'hermosa/v1/Account.sendCode',
  'PUT    /hermosa/v1/accounts/:id/activate'      : 'hermosa/v1/Account.activate',
  'GET    /hermosa/v1/accounts/:id'               : 'hermosa/v1/Account.get',
  'PUT    /hermosa/v1/accounts/:id/loadprotect'   : 'hermosa/v1/Account.loadProtect',
  'PUT    /hermosa/v1/accounts/:id/update'        : 'hermosa/v1/Account.updateMSISDN',

  'GET    /hermosa/v1/accounts/:id/balance'       : 'hermosa/v1/Balance.get',
  'GET    /hermosa/v1/accounts/:id/usage'         : 'hermosa/v1/Usage.get',
  'GET    /hermosa/v1/accounts/:id/messages'      : 'hermosa/v1/Message.list',
  'GET    /hermosa/v1/accounts/:id/messages/:mid' : 'hermosa/v1/Message.get',

  'PUT    /hermosa/v1/accounts/:id/device'        : 'hermosa/v1/Device.update',
  
  //-- ActivationCode
  'POST /hermosa/v1/activationcodes' : 'hermosa/v1/ActivationCode.create',

  //-- Category
  'POST /hermosa/v1/categories'     : 'hermosa/v1/Category.create',
  'PUT  /hermosa/v1/categories/:id' : 'hermosa/v1/Category.update',
  'GET  /hermosa/v1/categories/:id' : 'hermosa/v1/Category.get',
  'GET  /hermosa/v1/categories'     : 'hermosa/v1/Category.list',

  //-- Catalog
  'POST /hermosa/v1/catalog/products'     : 'hermosa/v1/Catalog.create',
  'PUT  /hermosa/v1/catalog/products/:id' : 'hermosa/v1/Catalog.update',
  'GET  /hermosa/v1/catalog/products/:id' : 'hermosa/v1/Catalog.get',
  'GET  /hermosa/v1/catalog/products'     : 'hermosa/v1/Catalog.list',

  //-- Advertisement  
  'POST /hermosa/v1/advertisements'     : 'hermosa/v1/Advertisement.create',
  'PUT  /hermosa/v1/advertisements/:id' : 'hermosa/v1/Advertisement.update',
  'GET  /hermosa/v1/advertisements/:id' : 'hermosa/v1/Advertisement.get',
  'GET  /hermosa/v1/advertisements'     : 'hermosa/v1/Advertisement.list',

  //-- Denomination  
  'POST /hermosa/v1/denominations'     : 'hermosa/v1/Denomination.create',
  'PUT  /hermosa/v1/denominations/:id' : 'hermosa/v1/Denomination.update',
  'GET  /hermosa/v1/denominations/:id' : 'hermosa/v1/Denomination.get',
  'GET  /hermosa/v1/denominations'     : 'hermosa/v1/Denomination.list',

  //-- Purchase
  'POST /hermosa/v1/accounts/:id/purchase'      : 'hermosa/v1/Purchase.purchase',
  'POST /hermosa/v1/accounts/:id/topup'         : 'hermosa/v1/Purchase.topup',

  //-- Checkout Paymaya
  'POST /hermosa/v1/checkout/result'    : 'hermosa/v1/Checkout.result',
  'GET  /hermosa/v1/checkout/result'    : 'hermosa/v1/Checkout.redirect',

  //-- Customer Care Web
  'GET    /'              : 'admin/v1/Page.login',
  'GET    /home'          : 'admin/v1/Page.home',

  'GET    /transactions'  : 'admin/v1/Transaction.list',

  'POST   /v1/sessions' : 'v1/Session.create',
  'DELETE /v1/sessions' : 'v1/Session.delete',
  'GET    /signout'     : 'v1/Session.delete',

  // ----------------------------------------------
  // ODYSSEY
  // ----------------------------------------------

  //-- Account
  'POST   /odyssey/v1/accounts'                    : 'odyssey/v1/Account.create',
  'GET    /odyssey/v1/accounts'                    : 'odyssey/v1/Account.list',
  'GET    /odyssey/v1/accounts/:id'                : 'odyssey/v1/Account.get',
  'GET    /odyssey/v1/accounts/:id/link'           : 'odyssey/v1/Account.linkList',
  'POST   /odyssey/v1/accounts/:id/link'           : 'odyssey/v1/Account.link',
  'POST   /odyssey/v1/accounts/:id/unlink'         : 'odyssey/v1/Account.unlink',
  'GET    /odyssey/v1/accounts/:id/messages'       : 'odyssey/v1/Message.list',
  'PUT    /odyssey/v1/accounts/:id/messages/:mid'  : 'odyssey/v1/Message.delete',

  //-- Prefix
  'POST  /odyssey/v1/prefix/add'        : 'odyssey/v1/Prefix.create',
  'POST  /odyssey/v1/prefix/check'      : 'odyssey/v1/Prefix.check',
  'GET   /odyssey/v1/prefix/list'       : 'odyssey/v1/Prefix.list',

  //-- Perks
  'POST /odyssey/v1/perks/add'         : 'odyssey/v1/Perks.create',
  'POST /odyssey/v1/perks/addbulk'     : 'odyssey/v1/Perks.createBulk',
  'POST /odyssey/v1/perks/generate'    : 'odyssey/v1/Perks.generate',
  'POST /odyssey/v1/perks/register'    : 'odyssey/v1/Perks.register',
  'GET  /odyssey/v1/perks/list/:id'    : 'odyssey/v1/Perks.list',
  'GET  /odyssey/v1/perks/list'        : 'odyssey/v1/Perks.listAll',
  'GET  /odyssey/v1/perks/expired'     : 'odyssey/v1/Perks.listAllExpired',

  //-- OLE
  'GET    /odyssey/v1/accounts/ole/:id'            : 'odyssey/v1/Account.OLEget',

  //-- ePIN
  'GET  /odyssey/v1/epins/list/:title'       : 'odyssey/v1/Epin.denomList',

  'POST /odyssey/v1/epins'                   : 'odyssey/v1/Epin.create',
  'GET  /odyssey/v1/epins'                   : 'odyssey/v1/Epin.list',

  'POST  /odyssey/v1/accounts/:id/epins'        : 'odyssey/v1/Epin.register',
  'POST  /odyssey/v1/accounts/:id/epins/verify' : 'odyssey/v1/Epin.verify',
  
  // ----------------------------------------------
  // GLOBAL
  // ----------------------------------------------

  //-- Account
  'POST   /global/v1/accounts'                    : 'global/v1/Account.create',
  'GET    /global/v1/accounts'                    : 'global/v1/Account.list',
  'GET    /global/v1/accounts/:id'                : 'global/v1/Account.get',
  'GET    /global/v1/accounts/:id/link'           : 'global/v1/Account.linkList',
  'POST   /global/v1/accounts/:id/link'           : 'global/v1/Account.link',
  'DELETE /global/v1/accounts/:id/link'           : 'global/v1/Account.unlink',
  'GET    /global/v1/accounts/:id/messages'       : 'global/v1/Message.list',

  //-- OLE
  'GET    /global/v1/accounts/ole/:id'            : 'global/v1/Account.OLEget',

  //-- E-load
  'POST    /global/v1/eload'                       : 'global/v1/Eload.load',
  'POST    /global/v1/eload/validate'              : 'global/v1/Eload.validate',
  'GET     /global/v1/eload/products'              : 'global/v1/Eload.getProducts',
  'GET     /global/v1/eload/balance'               : 'global/v1/Eload.balance',
  'GET     /global/v1/eload/transactions/:id'      : 'global/v1/Eload.getEloadTransactions',
  

  //Bills
  'GET     /global/v1/bills/billers'              : 'global/v1/Bills.getBillers',
  'GET     /global/v1/bills/form/:svc_code'       : 'global/v1/Bills.getBillerForm',
  'POST    /global/v1/bills/validate'             : 'global/v1/Bills.validate',
  'POST    /global/v1/bills/post'                 : 'global/v1/Bills.postPayment',
  'GET     /global/v1/bills/transactions/:id'     : 'global/v1/Bills.getBillsTransactions',


  //Payment
  'GET     /global/v1/payment/servicecharge'       : 'global/v1/Payment.getServiceCharge',
  'GET     /global/v1/payment/transactions/:id'    : 'global/v1/Payment.getPaymentTransactions',

  'GET     /global/v1/currency/convert/:from/:to'  : 'global/v1/Payment.convertCurrency',
  'GET     /global/v1/currency/convert/:from/:to/:amount'  : 'global/v1/Payment.convertCurrency',

  //Feeds
  'GET     /global/v1/feeds'                       : 'global/v1/Feed.getFeeds',

  //Subscriptions
  'GET     /global/v1/subscriptions/emags/:id'     : 'global/v1/Subscription.getEmagSubscriptions',
  'GET     /global/v1/subscriptions/movie/:id'     : 'global/v1/Subscription.getMovieSubscriptions',
  'GET     /global/v1/subscriptions/music/:id'     : 'global/v1/Subscription.getMusicSubscriptions',
  'POST    /global/v1/subscriptions/emags'         : 'global/v1/Subscription.saveEmagSubscriptions',
  'POST    /global/v1/subscriptions/music'         : 'global/v1/Subscription.saveMusicSubscriptions',
  'POST    /global/v1/subscriptions/movie'         : 'global/v1/Subscription.saveMovieSubscriptions',
  'POST    /global/v1/subscriptions/inapp'         : 'global/v1/Subscription.saveSubscriptionFromInAppPurchase',
  'POST    /global/v1/subscriptions/cancel/inapp'  : 'global/v1/Subscription.cancelSubscriptionFromInAppPurchase',
  'POST    /global/v1/subscriptions/delete'        : 'global/v1/Subscription.deleteSubscription',
  'POST    /global/v1/subscriptions/deactivate'    : 'global/v1/Subscription.deactivateSubscription',

  //SmartPinoy
  'POST    /global/v1/smartpinoy/activate'  : 'global/v1/SmartPinoy.addMapping',
  'GET    /global/v1/smartpinoy/status/:id'  : 'global/v1/SmartPinoy.getStatus',
  'POST    /global/v1/smartpinoy/number'  : 'global/v1/SmartPinoy.addNumber',

  //Vouchers
  'POST    /global/v1/vouchers/generate'  : 'global/v1/Voucher.generateVouchers',
  'POST    /global/v1/vouchers/redeem'  : 'global/v1/Voucher.redeemVoucher',

  //-- SMS
  'POST /sms/send'         : 'SMS.send',

  // ----------------------------------------------
  // ADMIN
  // ----------------------------------------------

  'POST   /v1/thirdparty'                  : 'admin/v1/Token.generateToken',
  'POST   /v1/organizations'               : 'admin/v1/Token.generateToken',

  'POST  /v1/purchase'                     : 'admin/v1/Purchase.purchase',
  'POST  /v1/topup'                        : 'admin/v1/Purchase.topup',
  'POST  /v1/transfer'                     : 'admin/v1/Purchase.transfer',


  'POST   /v1/subscribers'                 : 'admin/v1/Account.create', 
  'POST   /v1/subscribers/preload'         : 'admin/v1/Account.preload', 
  'PUT    /v1/subscribers/preactive'       : 'admin/v1/Account.preactive', 
  'PUT    /v1/subscribers'                 : 'admin/v1/Account.modify', 
  'DELETE /v1/subscribers'                 : 'admin/v1/Account.delete', 

  'GET    /v1/accounts'                    : 'admin/v1/Account.list',
  'GET    /v1/accounts/:id'                : 'admin/v1/Account.get',
  'GET    /v1/accounts/:id/messages'       : 'admin/v1/Message.list',
};
