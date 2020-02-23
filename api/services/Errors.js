module.exports = {
  get: function (tag) {
    var errors = {
      MISSING_INVALID_PARAMS: { status: 400, error: { code: -1, msg: 'Missing/invalid parameters.', 'params': [] }},
      UNAUTHORIZED: { status: 401, error: { code: -2, msg: 'Unauthorized.', spiel: this.getSpiel('UNAUTHORIZED') }},
      ACCOUNT_NOT_FOUND: { status: 404, error: { code: -3, msg: 'Account Not found.', spiel: this.getSpiel('ACCOUNT_NOT_FOUND') }},
      INTERNAL_SERVER_ERROR: { status: 500, error: { code: -4, msg: 'Internal server error.', spiel: this.getSpiel('SERVICE_ERROR') }},
      DB_ERROR: { 
        status: 503, 
        error: { 
          code: -5, 
          msg: 'Database error/unavailable.', 
          spiel: this.getSpiel('SERVICE_UNAVAILABLE') 
        }
      },
      PERMISSION_DENIED: { 
        status: 401, 
        error: { code: -2, msg: 'Permission denied.', spiel: this.getSpiel('PERMISSION_DENIED') }
      },
      MATRIXX_SERVER_ERROR: {
        status: 503,
        error: {
          code: -9, 
          msg: 'Matrixx server unreachable.', 
          spiel: this.getSpiel('SERVICE_UNAVAILABLE')
        }
      },
      MATRIXX_SERVICE_ERROR: {
        status: 503,
        error: {
          code: -10,
          msg: 'Matrixx service error or unavailable.',
          spiel: this.getSpiel('SERVICE_ERROR'),
          details: {'response_code': '', 'response_desc': ''}
        }
      },
      ACCOUNT_ALREADY_ACTIVATED: { 
        status: 401, 
        error: { 
          code: -11, 
          msg: 'Account already activated.', 
          spiel: 'Your account is already activated.'
        }
      },
      ACCOUNT_CANNOT_ACTIVATE: { 
        status: 401, 
        error: { 
          code: -12, 
          msg: 'Account cannot activate.', 
          spiel: 'Account cannot be activated. Primary account must be activated first.'
        }
      },
      PACKAGE_NOT_FOUND: { 
        status: 404, 
        error: { 
          code: -13, 
          msg: 'Not found.', 
          spiel: 'Package name does not exists.'
        }
      },
      ACCOUNT_MUST_BE_PRIMARY: { 
        status: 504, 
        error: { 
          code: -14, 
          msg: 'Must be a primary account.', 
          spiel: 'Account must be primary to continue transaction.'
        }
      },
      INCORRECT_ACTIVATION_CODE: { 
        status: 503, 
        error: { 
          code: -15, 
          msg: 'Incorrect activation code.', 
          spiel: 'Incorrect activation code. Please try again.'
        }
      },
      SNS_ERROR: { 
        status: 503, 
        error: { 
          code: -16, 
          msg: 'SNS error.', 
          spiel: 'Internal Server Error. Please try again.'
        }
      },
      DEVICE_NOT_FOUND: {
        status: 404,
        error: {
          code: -17, 
          msg: 'Not Found.', 
          spiel: 'Device token not found from your account.'
        }
      },
      NOMORE_IFLIX_VOUCHERS: {
        status: 404,
        error: {
          code: -18, 
          msg: 'No more iflix vouchers.', 
          spiel: 'No more iflix vouchers. Please try again later.'
        }
      },
      MSISDN_ALREADY_ACTIVATED: { 
        status: 401, 
        error: { 
          code: -19, 
          msg: 'Mobile number already used.', 
          spiel: 'Mobile number is already used.'
        }
      },
      MALFORMED_TOKEN: {
        status: 401,
        error: {
          code: -20, 
          msg: 'Not authorized. Malformed token.', 
          spiel: this.getSpiel('UNAUTHORIZED')
        }
      },
      EXPIRED_TOKEN: {
        status: 401,
        error: {
          code: -21, 
          msg: 'Not authorized. Token already expired.', 
          spiel: this.getSpiel('UNAUTHORIZED')
        }
      },
      INSUFFICIENT_FUNDS: {
        status: 400,
        error: {
          code: -22, 
          msg: 'Insufficient funds.', 
          spiel: "You don't have enough credits to do that. Want to top up?"
        }
      },
      CHECKOUT_ID_EXISTING: {
        status: 503, //check appropriate
        error: {
          code: -23, 
          msg: 'Checkout ID Existing.', 
          spiel: 'Transaction denied due to invalid credit card.'
        }
      },
      PAYMAYA_SERVER_ERROR: {
        status: 503,
        error: {
          code: -24,
          msg: 'Paymaya server unreachable.',
          spiel: this.getSpiel('SERVICE_UNAVAILABLE')
        }
      },
      PAYMAYA_SERVICE_ERROR: {
        status: 503,
        error: {
          code: -25,
          msg: 'Paymaya service error/unavailable.',
          spiel: 'Payment service error/unavailable, please try again in a few minutes.'
        }
      },
      AUTH0_SERVER_ERROR: {
        status: 503,
        error: {
          code: -26,
          msg: 'Auth0 server unreachable.',
          spiel: this.getSpiel('SERVICE_UNAVAILABLE')
        }
      },
      AUTH0_SERVICE_ERROR: {
        status: 503,
        error: {
          code: -27,
          msg: 'Auth0 service error/unavailable.',
          spiel: 'Auth0 service error/unavailable, please try again in a few minutes.'
        }
      },
      BARLEY_SERVER_ERROR: {
        status: 503,
        error: {
          code: -28,
          msg: 'Virtual number dispenser server unreachable.',
          spiel: this.getSpiel('SERVICE_UNAVAILABLE')
        }
      },
      BARLEY_SERVICE_ERROR: {
        status: 503,
        error: {
          code: -29,
          msg: 'Virtual number dispenser service error/unavailable.',
          spiel: 'Virtual number dispenser service error/unavailable, please try again in a few minutes.'
        }
      },
      BASIL_SERVER_ERROR: {
        status: 503,
        error: {
          code: -30,
          msg: 'Account management server unreachable.',
          spiel: this.getSpiel('SERVICE_UNAVAILABLE')
        }
      },
      BASIL_SERVICE_ERROR: {
        status: 503,
        error: {
          code: -31,
          msg: 'Account management service error/unavailable.',
          spiel: 'Account management service error/unavailable, please try again in a few minutes.'
        }
      },
      PERKS_UNAVAILABLE_ERROR: { 
        status: 400, 
        error: { 
          code: -32, 
          msg: 'Perk unavailable.', 
          spiel: 'Perk unavailable.'
        }
      },
      PERKS_INVALID_ERROR: { 
        status: 400, 
        error: { 
          code: -33, 
          msg: 'Invalid Perk ID.', 
          spiel: 'Invalid Perk ID.'
        }
      },
      PERKS_AVAILED_ERROR: { 
        status: 400, 
        error: { 
          code: -34, 
          msg: 'Perk already availed.', 
          spiel: 'Perk already availed.'
        }
      },
      PERK_INVALID_NUMBER: { 
        status: 400, 
        error: { 
          code: -35, 
          msg: 'Sorry, this perk is exclusive to Smart subscribers only.', 
          spiel: 'Sorry, this perk is exclusive to Smart subscribers only.'
        }
      },
      HOPSCOTCH_ERROR: { 
        status: 400, 
        error: { 
          code: -35, 
          msg: 'Hopscotch API error.', 
          spiel: 'Cannot fetch data from Hopscotch.'
        }
      },
      INCORRECT_CODE: {
        status: 400,
        error: {
          code: -36, 
          msg: 'Incorrect code.', 
          spiel: 'Incorrect code to avail the perk.'
        }
      },
      NO_PENDING_CODE: {
        status: 404,
        error: {
          code: -37,
          msg: 'No pending transaction.',
          spiel: 'We had a problem processing your request, please try again later.'
        }
      },
      MAX_INCORRECT_VCODE: {
        status: 401,
        error: {
          code: -38,
          msg: 'Maximum number of incorrect verification code.',
          spiel: 'Maximum number of incorrect verification attempt has been reached.'
        }
      },
      ORGANIZATION_TOKEN_EXISTS: {
        status: 401,
        error: {
          code: -39,
          msg: 'Token already exists.',
          spiel: 'Organization is already registered.'
        }
      },
      INSUFFICIENT_BALANCE: {
        status: 400,
        error: {
          code: -1, 
          msg: 'Insufficient balance.', 
          spiel: "Your dealer does not have enough credits to do that."
        }
      },
      INVALID_TARGETNUMBER: {
        status: 400,
        error: {
          code: -1, 
          msg: 'Invalid target number.', 
          spiel: "Please check if your mobile number is valid."
        }
      },
      ELOAD_SERVICE_ERROR: {
        status: 503,
        error: {
          code: -4,
          msg: 'E-load service error/unavailable.',
          spiel: 'E-load service error/unavailable, please try again in a few minutes.'
        }
      },
      BILLS_SERVER_ERROR: {
        status: 500,
        error: {
          code: -4, 
          msg: 'Bills Payment server unreachable.', 
          spiel: this.getSpiel('SERVICE_UNAVAILABLE')
        }
      },
      BILLS_INVALID_REQUEST: {
        status: 400,
        error: {
          code: -1, 
          msg: 'Bills Payment Request Error', 
          spiel: 'Invalid Request'
        }
      },
      CURRENCY_CONVERTER_ERROR: {
        status: 500,
        error: {
          code: -4, 
          msg: 'Currency converter Service unreachable.', 
          spiel: this.getSpiel('SERVICE_UNAVAILABLE')
        }
      },
      FEED_SERVER_ERROR: {
        status: 500,
        error: {
          code: -4, 
          msg: 'Feeds server unreachable.', 
          spiel: this.getSpiel('SERVICE_UNAVAILABLE')
        },
      },
      STRIPE_SERVER_ERROR: {
        status: 500,
        error: {
          code: -4, 
          msg: 'Stripe server unreachable.', 
          spiel: this.getSpiel('SERVICE_UNAVAILABLE')
        },
      },
      STRIPE_INVALID_REQUEST: {
        status: 400,
        error: {
          code: -1, 
          msg: 'Stripe Invalid Request', 
          spiel: this.getSpiel('SERVICE_UNAVAILABLE')
        },
      },
      PAYPAL_INVALID_REQUEST: {
        status: 400,
        error: {
          code: -1, 
          msg: 'PayPal Invalid Request', 
          spiel: this.getSpiel('SERVICE_UNAVAILABLE')
        },
      },
      PAYPAL_INVALID_PAYMENT: {
        status: 400,
        error: {
          code: -1, 
          msg: 'PayPal Invalid Payment', 
          spiel: this.getSpiel('INVALID_PAYMENT')
        },
      },
      PAYPAL_SERVER_ERROR: {
        status: 500,
        error: {
          code: -4, 
          msg: 'PayPal server unreachable.', 
          spiel: this.getSpiel('SERVICE_UNAVAILABLE')
        },
      },
      CUSTOMER_ID_NOT_FOUND: {
        status: 400,
        error: {
          code: -1, 
          msg: 'Stripe Request Error', 
          spiel: 'Customer does not have stripe customer id yet.'
        }
      },
      NO_EXISTING_SUBSCRIPTION: {
        status: 400,
        error: {
          code: -1, 
          msg: 'Subscription Request Error', 
          spiel: 'Customer has no existing subscription.'
        }
      },
      EXISTING_SUBSCRIPTION: {
        status: 400,
        error: {
          code: -1, 
          msg: 'Subscription Request Error', 
          spiel: 'Customer has an existing subscription.'
        }
      },
      FREE_TRIAL_SUBSCRIPTION: {
        status: 400,
        error: {
          code: -1, 
          msg: 'Subscription Request Error', 
          spiel: 'You cannot subscribe to free trial again.'
        }
      },
      NO_EMAG_SUBSCRIPTION: {
        status: 400,
        error: {
          code: -1, 
          msg: 'Subscription Request Error', 
          spiel: 'Unable to add E-mag subscription without payment. No existing subscription.'
        }
      },
      EPIN_SERVER_ERROR: {
        status: 503,
        error: {
          code: -40,
          msg: 'Smart EPin server unreachable.',
          spiel: this.getSpiel('SERVICE_UNAVAILABLE')
        }
      },
      EPIN_SERVICE_ERROR: {
        status: 503,
        error: {
          code: -41,
          msg: 'Smart EPin service error/unavailable.',
          spiel: 'Smart EPin service error/unavailable, please try again in a few minutes.'
        }
      },   
      UNABLE_TO_TRANSFER_DATA: {
        status: 400,
        error: {
          code: -42, 
          msg: 'Unable to transfer data. Account has no Transferred Data wallet.', 
          spiel: 'Unable to transfer data. Please try again later.'
        }
      },
      SMARTPAY_SERVER_ERROR: {
        status: 503,
        error: {
          code: -43,
          msg: 'Smartpay server unreachable.',
          spiel: this.getSpiel('SERVICE_UNAVAILABLE')
        }
      },
      SMARTPAY_SERVICE_ERROR: {
        status: 503,
        error: {
          code: -44,
          msg: 'Smartpay service error/unavailable.',
          spiel: 'Smartpay service error/unavailable, please try again in a few minutes.'
        }
      },
      INVALID_DENOM_ID: {
        status: 503,
        error: {
          code: -45,
          msg: 'Denom ID does not exist.',
          spiel: 'Denomination you selected is not available. Please try again later.'
        }
      },
      RECORD_NOT_FOUND: {
        status: 404,
        error: {
          code: -46,
          msg: 'Record not found.',
          spiel: this.getSpiel('SERVICE_ERROR')
        }
      },
      SMART_PINOY_INVALID_SUBS: {
        status: 400,
        error: {
          code: -1, 
          msg: 'SmartPinoy Activation Error', 
          spiel: 'Your number is not a valid Smart Pinoy number.'
        }
      },
      SMART_PINOY_ACTIVATED: {
        status: 400,
        error: {
          code: -1, 
          msg: 'SmartPinoy Activation Error', 
          spiel: 'Your Smart Pinoy number is already activated.'
        }
      },
      VOUCHER_USED:{
        status: 400,
        error: {
          code: -1, 
          msg: 'Voucher Redeem Error', 
          spiel: 'Your voucher has been used already.'
        }
      },
      MSISDN_NOT_ALLOWED: {
        status: 503,
        error: {
          code: -47,
          msg: 'Mobile number not allowed.',
          spiel: 'Sorry, only Smart numbers are allowed to purchase epins.'
        }
      },
      BCODE_SERVER_ERROR: { 
        status: 503, 
        error: { 
          code: -48, 
          msg: 'BCode API error.', 
          spiel: 'Cannot generate BCode. Please try again.'
        }
      },
      PERKS_CLAIMED: { 
        status: 400, 
        error: { 
          code: -49, 
          msg: 'Perks claim error.', 
          spiel: 'Perk already claimed.'
        }
      },
      PERKS_NOSUBS: { 
        status: 400, 
        error: { 
          code: -50, 
          msg: 'Perks claim error.', 
          spiel: 'Claiming error has occured.'
        }
      },
      MSISDN_NOT_VALID: {
        status: 503,
        error: {
          code: -51,
          msg: 'Mobile number not allowed.',
          spiel: 'Sorry, only Smart numbers are allowed.'
        }
      },
      MCP_SERVER_ERROR: {
        status: 503,
        error: {
          code: -52,
          msg: 'MCP API error.',
          spiel: 'Cannot generate voucher code. Please try again.'
        }
      },
    };
    return errors[tag];
  },
  raise: function (e) {
    var error = JSON.parse(JSON.stringify(this.get(e)));
    return error;
  },
  getParam: function (tag) {
    var params = {
      id: {
        field: 'id',
        desc: 'Please enter a valid user id.'
      },
      auth_id: {
        field: 'auth_id',
        desc: 'Please enter your auth0 id.'
      },
      msisdn: {
        field: 'msisdn',
        desc: 'Please re-enter your mobile number. Remember to use a valid mobile number.'
      },
      first_name: {
        field: 'first_name',
        desc: 'Please re-enter your first name. Remember to use valid letters with a maximum length of 30.'
      },
      middle_name: {
        field: 'middle_name',
        desc: 'Please re-enter your middle name. Remember to use valid letters with a maximum length of 30.'
      },
      last_name: {
        field: 'last_name',
        desc: 'Please re-enter your last name. Remember to use valid letters with a maximum length of 30.'
      },
      birth_date: {
        field: 'birth_date',
        desc: 'Please re-enter your birthday. You should be 18 years old and above. Future dates are invalid and will not be accepted.'
      },
      code: {
        field: 'code',
        desc: 'Please re-enter the 6 digit activation code.'
      },
      topup_type: {
        field: 'type',
        desc: 'Value must be either own or gift.'
      },
      recipient: {
        field: 'recipient',
        desc: 'Recipient account.'
      },
      description: {
        field: 'description',
        desc: 'Description of transaction.'
      },
      purchase_type: {
        field: 'type',
        desc: 'Value must be either own or gift.'
      },
      purchase_name: {
        field: 'purchase_name',
        desc: 'Must be a valid purchase name.'
      },
      amount: {
        field: 'amount', 
        desc: 'Amount must be an object containing unit and value.'
      },
      amount_value: {
        field: 'value', 
        desc: 'Amount must be greater than 0.'
      },
      amount_unit: {
        field: 'unit', 
        desc: 'Amount unit must be a valid currency.'
      },
      validity: {
        field: 'validity', 
        desc: 'Validity must be an object containing unit and value.'
      },
      validity_value: {
        field: 'value', 
        desc: 'Validity value must be greater than 0.'
      },
      validity_unit: {
        field: 'unit', 
        desc: 'Validity unit must be a valid currency.'
      },
      data_id: {
        field: 'id', 
        desc: 'Must be a valid matrixx external id.'
      },
      grant_value: {
        field: 'grant_value', 
        desc: 'Grant value must be greater than 0.'
      },
      grant_unit: {
        field: 'grant_unit', 
        desc: 'Grant unit must be a valid unit.'
      },
      data_validity_value: {
        field: 'validity_value', 
        desc: 'Validity value must be greater than 0.'
      },
      data_validity_unit: {
        field: 'validity_unit', 
        desc: 'Validity unit must be a valid unit.'
      },
      limit: { 
        field: 'limit', 
        desc: 'Must be a positive number.'
      },
      page: { 
        field: 'page', 
        desc: 'Must be a valid page number.'
      },
      sort: { 
        field: 'sort', 
        desc: 'Must be a string with a valid sort value.'
      },
      order: { 
        field: 'order', 
        desc: 'Value either 1 (asc) or -1 (desc).'
      },
      email: {
        field: 'email', 
        desc: 'Enter a valid email address.'
      },
      load_protect: {
        field: 'load_protect', 
        desc: 'Value either yes or no.'
      },
      device_token: { 
        field: 'device_token', 
        desc: 'Enter a valid device token.'
      },
      old_device_token: { 
        field: 'old_device_token', 
        desc: 'Enter a valid device token.'
      },
      new_device_token: {
        field: 'new_device_token', 
        desc: 'Enter a valid new device token.'
      },
      os: {
        field: 'os', 
        desc: 'Must be a valid device os.'
      },
      checkout_id: {
        field: 'checkout_id', 
        desc: 'Must be a valid checkout id.'
      },
      credit_card_number: {
        field: 'credit_card_number', 
        desc: 'Please enter a valid credit card number.'
      },
      card_declined: {
        field: 'credit_card_number', 
        desc: 'Your card was declined. Please use other credit card.'
      },
      exp_month: {
        field: 'exp_month', 
        desc: 'Must be a month in the future'
      },
      exp_year: {
        field: 'exp_year', 
        desc: 'Must be a year in the future'
      },
      cvc: {
        field: 'cvc', 
        desc: 'Please enter a valid credit card security code.'
      },
      cvv: {
        field: 'cvv', 
        desc: 'Please enter a valid credit card security code.'
      },
      cc_token: {
        field: 'cc_token', 
        desc: 'Invalid Credit Card Token. Credit Card Token can only be used once.'
      },
      card_type: {
        field: 'card_type', 
        desc: 'Invalid Card Type'
      },
      cc_amount: {
        field: 'amount', 
        desc: 'Invalid amount.'
      },
      currency: {
        field: 'currency', 
        desc: 'Your currency is not supported. Please use valid currency.'
      },
      eload_type: {
        field: 'eload_type', 
        desc: 'Invalid E-load type. Only sun, smart and pldt are supported.'
      },
      details: {
        field: 'details', 
        desc: 'Invalid JSON format. Please check your JSON object.'
      },
      payment_amount: {
        field: 'amount', 
        desc: 'Amount must be a number'
      },
      to:{
        field: 'to', 
        desc: 'Invalid To Currency'
      },
      from:{
        field: 'from', 
        desc: 'Invalid From Currency'
      },
      months:{
        field: 'months', 
        desc: 'Please enter months'
      },
      customer_id:{
        field: 'customer_id', 
        desc: 'Customer ID is required'
      },
      epin_denom_id: {
        field: 'denom_id', 
        desc: 'Must be a valid ePIN denomination ID.'
      },
      epin_game_id: {
        field: 'game_id', 
        desc: 'Must be a valid ePIN game ID.'
      },
      vcode: {
        field: 'vcode', 
        desc: 'Must be a valid verification code.'
      },
      request_reference_num: {
        field: 'request_reference_num', 
        desc: 'Must be a valid request reference number.'
      }
    };
    return params[tag];
  },
  getSpiel: function (tag) {
    var spiels = {
      SERVICE_UNAVAILABLE: 'We could not connect you to the service at the moment, please try again in a few minutes.',
      SERVICE_ERROR: 'We had a problem processing your request, please try again in a few minutes.',
      UNAUTHORIZED: 'Your session has expired, please login again.',
      INVALID_LOGIN: 'Username and password does not match. Please try again.',
      PERMISSION_DENIED: 'You are not authorized to access the site.',
      UNAUTHORIZED_INFO: 'You are unauthorized to access this information.',
      ACCOUNT_NOT_FOUND: 'Please register to sign in.',
      INVALID_PAYMENT: 'Payment Details does not match our records.',
    };
    return spiels[tag];
  }
};
