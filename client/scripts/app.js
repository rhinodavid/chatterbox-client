// YOUR CODE HERE:


var app = {
  server: 'https://api.parse.com/1/classes/messages'
};

app.init = function() {
  $('#send').off('submit').submit(app.handleSubmit);
  app.room = 'lobby';
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
      data.results.forEach((message)=>{
        app.renderMessage(
          {
            text: message.text,
            username: message.username,
            roomname: message.roomname
          }
        );
      });
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderMessage = function(message) {
  let $message = $('<div></div>').addClass('message');
  let $username = $('<span></span>').addClass('message-username').text(message.username).html();
  let $text = $('<span></span>').addClass('message-text').text(message.text).html();
  $message.append($username).append($text);
  $('#chats').append($message);
};

app.renderRoom = function(roomName) {
  let $newRoom = $('<li></li>').text(roomName);
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

