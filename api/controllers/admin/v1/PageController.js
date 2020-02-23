var TAG = 'PageController';

module.exports = {

  login: function(req, res) {
    res.view('login', {});
  },

  home: function(req, res) {
    var obj = {
      user: req.session.user
    };
    res.view('dashboard', obj);
  },

}