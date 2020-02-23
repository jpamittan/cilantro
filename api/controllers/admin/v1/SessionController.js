var TAG = '[admin][v1][SessionController]';
var crypto = require('crypto');

module.exports = {

  create: function(req, res) {
    var ACTION = '[create]';
    // TODO: Validate token before setting req.session.user
    req.session.user = {
      id: req.body.user_id,
      first_name: req.body.first_name, 
      last_name: req.body.last_name, 
      image_url: req.body.image_url
    }; 
    res.ok({success: 'Login successful.'});
  },

  delete: function(req, res) {
    console.log('signout');
    req.session.destroy();
    res.redirect('/');
  }

}