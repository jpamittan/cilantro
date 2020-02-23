/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  Account.findOne({id: req.params.id}, function(err, data) {
    if (err) {
      Logger.log('error', TAG + ACTION, err);
      return res.error(Errors.raise('DB_ERROR'));
    } else {
      if (data == undefined) return res.error(Errors.raise('NOT_FOUND'));
      req.query = !req.query ? {} : req.query;
      req.query.msisdn = data.msisdn;
      req.query.matrixx_id = data.matrixx_id;
      req.account = JSON.parse(JSON.stringify(data));
      return next();
    }
  });

};
