$(document).ready(function() {
    var path_name = window.location.pathname;
    user_token = localStorage.getItem('user_token');

    // if (user_token && path_name == '/') {
    //   window.location.href = '/home';
    // } else if (user_token && path_name == '/') {
    //   window.location.href = '/home';
    // }

    var lock = new Auth0Lock(
      auth0_client_id,
      auth0_domain
    );

    $('#facebook-login').click(function(e) {
      e.preventDefault();
      lock.showSignin(function(err, profile, token) {
        if (err) {
          console.log(err);
        } else {
          var obj = {
            user_id: profile.user_id,
            first_name: profile.given_name, 
            last_name: profile.family_name, 
            image_url: profile.picture,
            token: token
          }; 
          login(obj);
        }
      });
    });

    $.ajaxSetup({
      'beforeSend': function(xhr) {
        if (localStorage.getItem('user_token')) {
          xhr.setRequestHeader('Authorization',
            'Bearer ' + localStorage.getItem('user_token'));
        }
      }
    });

});

function login(obj) {
  $.ajax({
    type: 'POST',
    url: '/v1/sessions',
    processData: false,
    contentType: 'application/json',
    data: JSON.stringify(obj)
  })
  .success(function (data) {
    console.log(data);
    window.location.href = '/home';
  })
  .fail(function (error) {
    console.log(error);
  });
}
