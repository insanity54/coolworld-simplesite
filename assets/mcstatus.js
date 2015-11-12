function makeRequests(cb) {
  //console.log('checking server! arg received: ' + template);

  var res = {};

  //
  // GET ONLINE/OFFLINE STATUS
  //
  $.ajax({
      url: "https://mcapi.ca/query/coolworld.servegame.com:25565/status",
      dataType: "json",
      timeout: 10000
    })
    .fail(function (err) {
      console.log('fail on status');
      return cb(err);
    })
    .done(function (data) {
      //console.log(data);
      res.online = data.status;

      if (!res.online) {
        res.playerCount = 0;
        return cb(null, res);
      }


      //
      // GET PLAYER LIST
      //
      $.ajax({
          url: "https://mcapi.ca/query/coolworld.servegame.com:25565/list",
          dataType: "json",
          timeout: 10000
        })
        .fail(function (err) {
          console.log('fail on list');
          return cb(err);
        })
        .done(function (data) {
          res.playerCount = data.Players.online;
          res.players = data.Players.list;

          return cb(null, res);
        });
    });
}




function check() {
  makeRequests(function (err, results) {
    if (err) {
      console.log('error received from makerequests- ' + err);
      console.log(err);
      $("#status-text").html('<span class="red"><i id="emblem" class="glyphicon glyphicon-flag"></i></span> Problem connecting to status server.');
      $("#players-text").html('This can happen if you use a script blocker like privacy badger, script safe, etc. For this status indicator to work, this page must be able to access mc.api.ca');
      return tryLater();
    }
    var playerCount = results.playerCount || 0;
    var players = results.players || [];
    var statusString;

    //console.log('results.online=' + results.online);

    if (results.online) {
      statusString = '<span class="green"><i id="emblem" class="glyphicon glyphicon-ok"></i></span> ONLINE - ' + playerCount + ' players';
    } else {
      statusString = '<span class="red"><i id="emblem" class="glyphicon glyphicon-remove"></i></span> OFFLINE';
    }


    $("#status-text").html(statusString);
    $("#players-text").html(players.join(', '));

    $('#emblem').animo({
      animation: "bounceIn"
    });

    return tryLater();
  });
}


function tryLater() {
  setTimeout(check, 30000);
}




$(document).ready(function () {
  check();
});