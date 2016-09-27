// YOUR CODE HERE:


var app = {
  server: 'https://api.parse.com/1/classes/messages'
};

app.init = function() {
  $('#send').off('submit').submit(app.handleSubmit);
  app.currentRoom = 'lobby';
  app.rooms = [].concat(app.currentRoom);
  app.renderRoom(app.currentRoom);
  app.fetch();
};

app.send = function(message) {
  $.ajax({
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message), 
    success: (data, textStatus, jqXHR) => {
      app.fetch();
    }
  });
};

app.fetch = function() {
  $.ajax({
    url: this.server,
    data: {
      limit: 25
    },
    success: (data) => {
      app.clearMessages();
      data.results.forEach((message) => {
        message.roomname = message.roomname || 'lobby';
        if (message.roomname === app.currentRoom) {
          // render message
          app.renderMessage(
            {
              text: message.text,
              username: message.username,
              roomname: message.roomname
            }
          );
        } else {
          // add the room to our list if it isn't there already
          if (app.rooms.indexOf(message.roomname) === -1) {
            app.renderRoom(message.roomname);
            app.rooms.push(message.roomname);
          } 
        }
      });
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderMessage = function(message) {
  let messageText = $('<div>').text(message.text).html();
  let userName = $('<div>').text(message.username).html();


  let $message = $('<div></div>').addClass('message');
  let $username = $('<span></span>').addClass('message-username').text(userName);
  let $text = $('<span></span>').addClass('message-text').text(messageText);
  $message.append($username).append($text);
  $('#chats').append($message);
};

app.renderRoom = function(roomName) {
  let roomNameEscaped = $('<div>').text(roomName).html();
  let $newRoom = $('<li></li>').text(roomNameEscaped);
  $('#roomSelect').append($newRoom);
};

app.handleUsernameClick = function(username) {
  // add friend?
};

app.handleSubmit = function(event) {
  event.preventDefault();
  // grab message from form
  let messageText = $('#message').val();
  $('#message').val('');
  let messageUsername = app.getUsername();
  let messageRoomname = app.room;

  // message has 'text', 'username', and 'roomname'


  // use send to submit to server
  app.send({
    text: messageText,
    username: messageUsername,
    roomname: messageRoomname
  });
};

app.getUsername = function() {
  return window.location.search.replace(/(&|\?)username=/, '');
};

$(function() {
  app.init();
});

