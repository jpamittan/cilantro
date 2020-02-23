var TAG = '[_BillsController]';
var req = require('rekuire');

function _BillsController(req, options) {
  if (typeof req === 'undefined') {
    throw new Error('Please pass the request to the constructor.');
  }
  this.req = req;
  this.options = options;

}

_BillsController.prototype.getBillers = function (cb, result) {
  var ACTION = '[getBillers]';

  Bills.getRequest('get_billers', function(err, data) {
    if (err) {
      return cb(err);
    }

    data = JSON.parse(data);
    var response = {
      electricity: [],
      water: [],
      communication: [],
      government: [],
      entertainment: []
    };

    var result_size = data.result.length;
    for (var i=0;i<result_size;i++) {
      var biller = data.result[i];
      var category = biller.biller_category.toLowerCase();
      if (category.indexOf('water') != -1) {
        response.water.push(biller);
      } else if(category.indexOf('electricity') != -1) {
        response.electricity.push(biller);
      } else if(category.indexOf('government') != -1){
        response.government.push(biller);
      } else if(category.indexOf('telephone') != -1 ||
        category.indexOf('other') != -1 ||
        category.indexOf('pldt') != -1 ||
        category.indexOf('smart') != -1 ||
        category.indexOf('cellphones') != -1) {
        response.communication.push(biller);
      } else if(category.indexOf('cable') != -1) {
        response.entertainment.push(biller);
      }
    }

    response.response_date = Math.floor(new Date().getTime() / 1000);

    return cb(err, response);
  });
};

_BillsController.prototype.getBillerForm = function (cb, result) {
  var ACTION = '[getBillers]';

  var endpoint = 'get_biller_form/serviceCode/'+this.req.params.svc_code;

  Bills.getRequest(endpoint, function(err, data) {
    if (err) {
      return cb(err);
    }

    data = JSON.parse(data);
    data.result = JSON.parse(data.result);
    data.result.fields.forEach(function(item,index){
      if (item.options && !Array.isArray(item.options)) {
        item.options = [item.options];
      }
    });

    return cb(null, data);
  });
};


_BillsController.prototype.generateSequenceNo = function (cb, result) {
  var ACTION = '[generateSequenceNo]';

    var requestId = new Array(7);
    var _sym = '1234567890';
    var generated_code = '';

    for (var i = 0; i < requestId.length; i++) {
        generated_code +=  _sym[parseInt(Math.random() * (_sym.length))];
    }

    return cb(null, generated_code);
};


_BillsController.prototype.generateSoapRequest = function (cb, result) {
  var ACTION = '[generateSoapRequest]';

  var soap_request = '';
  var tpaid = sails.config.bills_payment.tpa_id;
  //get Julian Day
  var now = new Date();
  var day_count = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  var mn = now.getMonth();
  var dn = now.getDate();
  var year = now.getFullYear();
  var day = day_count[mn] + dn;
  if(mn > 1 && (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0))) day++;
  var julian_day = (day / Math.pow(10, 3)).toFixed(3).substr(2);
  var sequence_no = result.sequence_no;
  var partner_ref_no = tpaid+julian_day+sequence_no;
  var err_obj;
  var details;

  //validation for details if existing
  if (!this.req.body.details) {
    err_obj = Errors.raise("MISSING_INVALID_PARAMS");
    err_obj.error.params.push(Errors.getParam('details'));
        
    return cb(err_obj);
  }

  try {
    details = JSON.parse(this.req.body.details);
  } catch(ex) {
    err_obj = Errors.raise("MISSING_INVALID_PARAMS");
    err_obj.error.params.push(Errors.getParam('details'));
      
    return cb(err_obj);
  }
  
  if (Object.keys(details).length === 0) {
    err_obj = Errors.raise("MISSING_INVALID_PARAMS");
    err_obj.error.params.push(Errors.getParam('details'));
      
    return cb(err_obj);
  }

  soap_request += "<Transaction tokenId='"+sails.config.bills_payment.token_id+"'>";
  soap_request += "<Bill billerCode='"+this.req.body.biller_code+"'>";
  soap_request += "<ServiceCode>"+this.req.body.service_code+"</ServiceCode>";
  soap_request += "<AccountNo>"+details.AccountNo+"</AccountNo>";
  delete details.AccountNo;
  soap_request += "<AmountDue>"+details.AmountDue+"</AmountDue>";
  delete details.AmountDue;
  soap_request += "<AmountPaid>"+details.AmountPaid+"</AmountPaid>";
  var amountPaid = details.AmountPaid;
  delete details.AmountPaid;
  soap_request += "<OtherCharges>0</OtherCharges>";
  soap_request += "<OtherInfo>";
  soap_request += "<PartnerRefNo>"+partner_ref_no+"</PartnerRefNo>";
  if (Object.keys(details).length !== 0) {
    for (var key in details) {
      soap_request += "<"+key+">";
      soap_request += details[key];
      soap_request += "</"+key+">";
    }
  }
  if (this.req.body.service_code == "MWSIN") {
    soap_request += "<RAP>True</RAP>";
  }
  soap_request += "</OtherInfo>";
  soap_request += "<ModeOfPayment>";
  soap_request += "<Cash>";
  soap_request += "<Amount>"+amountPaid+"</Amount>";
  soap_request += "<PaymentType>debit</PaymentType>";
  soap_request += "<BankType>bancnet</BankType>";
  soap_request += "</Cash>";
  soap_request += "</ModeOfPayment>";
  soap_request += "</Bill>";
  soap_request += "</Transaction>";

  return cb(null, soap_request);
};


_BillsController.prototype.validateForm = function (cb, result) {
  var ACTION = '[getBillers]';

  var params = {
    soap_request: result.soap_request
  };

  Bills.postRequest(params,'validate', function(err, data) {
    if (err) {
      return cb(err);
    }

    var err_obj;
    data = JSON.parse(data);

    if (data.result == "null") {
      err_obj = Errors.raise('BILLS_INVALID_REQUEST');
      return cb(err_obj);
    } else if(data.status_code != 1000) {
      err_obj = Errors.raise('BILLS_INVALID_REQUEST');
      err_obj.error.spiel = data.result;
      return cb(err_obj);
    }

    data = JSON.parse(data.result);

    if (data['a:ResultCode'] != "000") {
      err_obj = Errors.raise('BILLS_INVALID_REQUEST');
      var message = data['a:ResultMessage'].replace('OtherInfo.','').replace(/([a-z])([A-Z])/g, '$1 $2');
      err_obj.error.spiel = message;
      
      return cb(err_obj);
    }

    return cb(null, data);
  });
};

_BillsController.prototype.postPayment = function (cb, result) {
  var ACTION = '[postPayment]';

  if (result.payment && result.payment.error) {
    return cb(result.payment);
  }

  var params = {
    soap_request: result.soap_request
  };

  var _this = this;

  Bills.postRequest(params, 'post', function(err, data) {
    if (err) {
      return cb(err);
    }

    data = JSON.parse(data);
    if (data.result == "null") {
      err_obj = Errors.raise('BILLS_INVALID_REQUEST');
      return cb(err_obj);
    } else if(data.status_code != 1000) {
      err_obj = Errors.raise('BILLS_INVALID_REQUEST');
      err_obj.error.spiel = data.result;
      return cb(err_obj);
    }

    data = JSON.parse(data.result);

    if (data['a:ResultCode'] != "000") {
      var err_obj;
      err_obj = Errors.raise('BILLS_INVALID_REQUEST');
      err_obj.error.spiel = data['a:ResultMessage'];
      
      return cb(err_obj);
    }

    //Save transaction

    try {
      var details = JSON.parse(_this.req.body.details);
    } catch(ex) {
      var err_obj;
      err_obj = Errors.raise("MISSING_INVALID_PARAMS");
      err_obj.error.params.push(Errors.getParam('details'));
        
      return cb(err_obj);
    }

    var transaction_info = {
      cilantro_id           : _this.req.account.cilantro_id,
      transaction_no        : data['a:TransactionNo'],
      receipt_validation_no : data['a:ReceiptValidationNo'],
      account_no            : details.AccountNo,
      amount_paid           : details.AmountPaid,
      service_code          : _this.req.body.service_code,
      transaction_date      : new Date()//data['a:TransactionDateTime']
    };

    BillsTransactions.create(transaction_info, function(err, data) {
      if (err) {
        return cb(err);
      }
      //return cb(null, data);
    });

    return cb(null, data);
  });
};

_BillsController.prototype.listTransactions = function (cb, result) {
  var ACTION = '[listTransactions]';

  BillsTransactions.find({where:{cilantro_id: this.req.account.cilantro_id}, sort:'created_at DESC'}, function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return res.error(Errors.raise('DB_ERROR'));
    }
    return cb(null, data);
  });
};

module.exports = _BillsController;