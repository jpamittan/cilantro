var TAG = '[TransactionController]';

module.exports = {
  list: function(req, res) {

    req.query.search = (req.query.search && req.query.search.value) ? req.query.search.value : undefined;

    req.query.order = req.query.order ? req.query.order[0].dir : undefined;
    
    req.query.page = (req.query.start / 10) + 1;
    req.query.limit = req.query.length || 10;

    req.query = Utility.getDefaultValues(req.query, 'transaction');
    var query_str = Utility.formQueryStr(req.query, 'transaction');
    
    var paginate = {page: req.query.page, limit: req.query.limit};

    var obj = {
      draw: req.query.draw,
      recordsTotal: 0,
      recordsFiltered: 0,
      data: []
    };

    Transaction.count(query_str, function(err, count) {
      if (err) {
        Logger.log('error', TAG + ACTION, err);
        obj.data = [];
        return res.ok(obj);
      }
      Transaction.find(query_str).paginate(paginate).exec(function(err, transactions) {
        if (err) {
          Logger.log('error', TAG + ACTION, err);
          obj.data = [];
          res.ok(obj);
        } else {
          obj.data = transactions;
          obj.recordsTotal = count;
          obj.recordsFiltered = count;
          res.ok(obj);
        }
      });
    });
    
  }
}