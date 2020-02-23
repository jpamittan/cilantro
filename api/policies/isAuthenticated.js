/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */

var TAG = '[isAuthenticated]';
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  var HOME_PATTERN = new RegExp(/home.*/);
  if (req.session && req.session.user) {
    sails.log.debug(TAG, 'URL accessed: ' + req.url + ': Has session');
    if (req.url.split('?')[0]!='/') {
      return next();      
    } else {
      return res.redirect('/home');
    }
  }
  // User is not allowed
  else {
    sails.log.debug(TAG, 'URL accessed: ' + req.url + ': No session');
    if(req.url.split('?')[0]!='/') {
      if (req.url.match(HOME_PATTERN) !== null) {
        return res.redirect('/');
      } else {
        res.error(Errors.raise('UNAUTHORIZED'));        
      }
    } else {
      return next();
    }
  }
};
