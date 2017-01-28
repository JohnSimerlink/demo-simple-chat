
import {SimpleChat} from 'meteor/cesarve:simple-chat/config'
SimpleChat.configure({
    beep: false,
    showViewed: true,
    showReceived: true,
    showJoined: true,
})

//TODO: get points/awards for unlocking / visiting new bubbles and have these points/awards get announced to the rest of the chat, also getting points/awards gives people perks for their usernames or avatars or whatever.
bubbles = [
{
"name": "Cardale's Crib",
"left": -83.048049,
"right": -82.997284,
"top": 40.019415,
"bottom": 39.989883
},
{ 
"name": "Bearcat Babies",
"left": -84.519341,
"right": -84.509236,
"top": 39.135752,
"bottom": 39.124469
}
];


function getBubble(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("geolocation not supported");
  }
}
function showPosition(position){
  console.log(determineBubble(position.coords.latitude, position.coords.longitude));
}
function determineBubble(lat, long){
  var bubble;
  var filtered = bubbles.filter(function(b) {return b.left < lat && b.right > lat && b.top > long && b.bottom < long;})
  console.log(filtered, bubbles);
  return filtered ? filtered[0].name : "Earth";
}

if (Meteor.isClient) {


    Template.home.events({
        'click button': function (e) {

            e.preventDefault()
            getBubble();
            var roomId = $(e.target).val()
            var username = $("#username").val()
            if (!username) {
                if ($('.form-group').hasClass('has-error'))
                    return
                $('.form-group').addClass('has-error').append('<span class="help-block">Is required</span>')
                $('input').keyup(function () {
                    if ($(this).val() != '') {
                        $('.form-group').removeClass('has-error')
                        $('span').remove()
                    }
                })
                return
            }
            console.log(username, roomId)
            FlowRouter.go('room', {roomId}, {username})
        }
    });
    Template.home.helpers({
        'random': function () {
            return Random.id(5)
        },
        'bubbles': function () {
          return bubbles;
        }
    });

    Template.room.onRendered(function () {
        var self = this

        return Session.set('avatar', "/avatar" + (Math.floor(Math.random() * 5) + 1) + ".png")
/*
        HTTP.get('https://randomuser.me/api/', function (err, res) {
            console.log(err, res)
            if (err)
                return Session.set('avatar', "/avatar" + (Math.floor(Math.random() * 5) + 1) + ".png")

            Session.set('avatar', res.data.results[0].picture.thumbnail)
        })
*/


    })

    Template.room.helpers({
        'roomId': function () {
            return FlowRouter.getParam('roomId')
        },
        'username': function () {
            return FlowRouter.getQueryParam('username')
        },
        avatar: function () {
            return Session.get('avatar')
        }

    });


}

FlowRouter.route("/", {
    name: "home",
    action: function () {
        BlazeLayout.render("home");
    }
})
FlowRouter.route("/:roomId", {
    name: "room",
    action: function () {
        BlazeLayout.render('room')
    }
})
