var TAG = '[getAppName]';


module.exports = function(req, res, next) {
  
  req.options.app_name = req.url.split('/')[1];
  if (req.query.app) {
    req.options.app_name = req.query.app;
  }
  return next();
  
};
