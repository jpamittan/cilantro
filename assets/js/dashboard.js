var subscriber_msisdn = getQueryParam('search');

$(document).ready(function() {

  $(".panel-body .tab-body").hide();
  $(".sidebar-tabs").hide();

  if (subscriber_msisdn) {
    getSubscriberMSISDN(subscriber_msisdn);
  } else {
    $(".loader").hide();
    $("#subscriber-name").html("Search subscriber...");
  }

  $('#search').on('click', function() {
    var msisdn = $('#search-user').val();
    if (msisdn.trim() != '') {
      window.location.href = '/home?search=' + msisdn;
    }
  });

  $('.nav-second-level a').on('click', function() {
    var id = $(this).attr('id');
    $('.nav-second-level a').removeClass('active');
    $(".panel-body .tab-body").hide();
    $(".loader").hide();

    if (id == 'profile-tab') {
      $("." + id + '-body').show();
    }

    if (id == 'balance-tab') {
      getSubscriberUsage(subscriber_id);
      $(".loader").show();
    }

    if (id == 'transactions-tab') {
      table_list.draw();
      $("." + id + '-body').show();
      //$(".loader").show();
    }

    $(this).addClass('active');
  });

});


function populateSubscriberProfile(subscriber) {
  var balance = "";
  var name = subscriber.profile.first_name + ' ' + subscriber.profile.last_name;
  if (subscriber.balance) {
    balance = subscriber.balance.peso.display;
  } 
  $("#subscriber-name").html(name + "<span id='subscriber-balance'>" + balance + "</span>");
  $(".profile-tab-body #first-name").html(subscriber.profile.first_name);
  $(".profile-tab-body #last-name").html(subscriber.profile.last_name);
  $(".profile-tab-body #role").html(subscriber.profile.role);
  $(".profile-tab-body #msisdn").html(subscriber.profile.msisdn);
  $(".profile-tab-body #load-protect").html(subscriber.profile.load_protected);

  subscriber.members.forEach(function(member) {
    var string = member.profile.first_name + " | " + member.profile.msisdn;
    $(".group-members").after("<dd>" + string + "</dd>");
  });
  
}

function populateSubscriberUsage(obj) {
  var boosters = "";
  var balance = obj.shared.open_data.balance;
  $(".open-shared #validity").html(balance.value > 0 ? balance.expiration : "0 days");
  $(".open-shared #balance").html(balance.display);

  balance = obj.shared.smart_life_data.balance;
  $(".smart-shared #validity").html(balance.value > 0 ? balance.expiration : "0 days");
  $(".smart-shared #balance").html(balance.display);

  balance = obj.personal.open_data;
  $(".open-personal #validity").html(balance.balance.value > 0 ? balance.expiration : "0 days");
  $(".open-personal #balance").html(balance.balance.display);

  balance = obj.personal.smart_life_data;
  $(".smart-personal #validity").html(balance.balance.value > 0 ? balance.expiration : "0 days");
  $(".smart-personal #balance").html(balance.balance.display);

  var open_data_total = obj.shared.open_data.total.value;
  var smart_data_total = obj.shared.smart_life_data.total.value;
  populateProgressBar('.open-shared', obj.shared.open_data.subscribers, open_data_total);
  populateProgressBar('.smart-shared', obj.shared.smart_life_data.subscribers, smart_data_total)


  obj.personal.boosters.forEach(function(booster) {
    var expiration = booster.expiration;
    if (booster.balance.value != 9999999999) {
      expiration = booster.balance.display;
    }
    boosters += "<hr><div class='row'>"
      + "<div class='col-xs-6 col-sm-4'>"
        + "<h5>" + booster.name + "</h5>"
      + "</div>"
      + "<div class='.col-xs-6 col-sm-8'>"
        + "<h5><span id='balance'>" + expiration + "</span></h5>"
      + "</div>"
    + "</div>";
  });

  $('.boosters .panel-body .title').after(boosters);
}

function populateProgressBar(div, subscribers, total) {
  var supp_ctr = 1;
  subscribers.forEach(function(subscriber) {
    var width =  total > 0 ? subscriber.usage.value / total * 100 : 0;
    var element = div + ' .progress-bar-' + subscriber.role.toLowerCase();
    if (subscriber.role != 'Primary') {
      element += '-' + supp_ctr;
      supp_ctr++;
    }
    if (subscriber.msisdn == subscriber_msisdn) {
      $(element).addClass('progress-bar-striped');
      $(element).addClass('active');
    }
    $(element).css('width', width + '%');
  });
}

function getSubscriberMSISDN(msisdn) {
  $.ajax({
    type: 'GET',
    url: '/v1/accounts?msisdn=' + msisdn,
    dataType: 'json',
    contentType: 'application/json'
  })
  .success(function (data) {
    subscriber_id = data.id;
    initializeDataTable();
    $(".sidebar-tabs").show();
    $(".profile-tab-body").show();
    populateSubscriberProfile(data);
    console.log(data);
  })
  .fail(function (error) {
    console.log(error);
    window.location.href = '/home';
  })
  .done(function () {
     $(".loader").hide();
  });
}

function getSubscriberUsage(subscriber_id) {
  $.ajax({
    type: 'GET',
    url: '/v1/accounts/' + subscriber_id + '/usage',
    dataType: 'json',
    contentType: 'application/json'
  })
  .success(function (data) {
    console.log(data);
    if ($("#balance-tab").hasClass("active")) {
      $(".loader").hide();
      $(".balance-tab-body").show();
      populateSubscriberUsage(data);
    }
  })
  .fail(function (error) {
    console.log(error);
  });
}

function getQueryParam(name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results == null){
    return undefined;
  } else {
    return results[1] || 0;
  }
}


