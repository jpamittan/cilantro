module.exports.policies = {


  // -----------------------
  // Hermosa
  // -----------------------
  
  'hermosa/v1/Account': {
    '*'           : 'getAppName',
    'activate'    : ['getAppName', 'findAccount'],
    'get'         : ['getAppName', 'findAccount'],
    'loadProtect' : ['getAppName','findAccount']
  },

  'hermosa/v1/Balance': {
    //'get' : ['validateAuthToken','getAppName','findAccount'],
    'get' : ['getAppName','findAccount'],
  },

  'hermosa/v1/Usage': {
    'get' : ['getAppName','findAccount'],
  },

  'hermosa/v1/Purchase': {
    '*' : ['getAppName','findAccount'],
  },

  'hermosa/v1/Message': {
    '*' : ['getAppName','findAccount'],
  },

  'hermosa/v1/Device': {
    '*' : ['getAppName','findAccount'],
  },

  'hermosa/v1/Catalog': {
    '*' : 'getAppName'
  },

  'hermosa/v1/Category': {
    '*' : 'getAppName'
  },

  'hermosa/v1/Purchase': {
    '*' : ['getAppName','findAccount'],
  },

  // -----------------------
  // Odyssey
  // -----------------------

  'odyssey/v1/Account': {
    '*'           : 'getAppName',
    'get'         : ['getAppName','findAccount'],
  },

  'odyssey/v1/Message': {
    '*'           : ['getAppName','findAccount'],
  },

  'odyssey/v1/Prefix': {
    '*'           : 'getAppName',
  },

  'odyssey/v1/Perks': {
    '*'           : 'getAppName',
    'register'    : ['getAppName','findAccount'],
    'list'        : ['getAppName','findAccount'],
    'registerv2'  : ['getAppName','findAccount'],
    'verify'      : ['getAppName','findAccount'],
    'accountList' : ['getAppName','findAccount'],
  },


  'odyssey/v1/Epin': {
    'register'     : ['validateAuthToken','getAppName','findAccount'],
    'verify'       : ['validateAuthToken','getAppName','findAccount'],
  },

  // -----------------------
  // Admin
  // -----------------------
  
  'admin/v1/Account': {
    '*'           : 'validateOrgToken',
    'get'         : ['validateOrgToken','getAppName','findAccount'],
  },

  'admin/v1/Message': {
    '*'           : 'validateOrgToken',
    'list'         : ['validateOrgToken','getAppName','findAccount'],
  },

  // -----------------------
  // Global
  // -----------------------

  'global/v1/Account': {
    '*'           : 'getAppName',
    'get'         : ['getAppName','findAccount'],
  },

  'global/v1/Message': {
    '*'           : ['getAppName','findAccount'],
  },

  'global/v1/Payment': {
    'charge' : ['getAppName','findAccount'],
    'changeCreditCard' : ['getAppName','findAccount'],
    'getPaymentTransactions' : ['getAppName','findAccount'],
    'getCreditCardToken' : ['getAppName','findAccount'],
    'getCustomerId' : ['getAppName','findAccount'],
  },

  'global/v1/Eload': {
    'load' : ['getAppName','findAccount'],
    'getEloadTransactions' : ['getAppName','findAccount'],
  },

  'global/v1/Bills': {
    'postPayment' : ['getAppName','findAccount'],
    'getBillsTransactions' : ['getAppName','findAccount'],
  },

  'global/v1/Subscription': {
    '*' : ['getAppName','findAccount'],
    'cancelSubscriptionFromStripe' : 'getAppName',
  },

  'global/v1/SmartPinoy': {
    'addMapping' : ['getAppName','findAccount'],
    'getStatus' : ['getAppName','findAccount'],
  },

  'global/v1/Voucher': {
    'redeemVoucher' : ['getAppName','findAccount'],
  }


};
