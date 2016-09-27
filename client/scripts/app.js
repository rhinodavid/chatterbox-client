// YOUR CODE HERE:


var app = {
  server: 'https://api.parse.com/1/classes/messages'
};

app.init = function() {
  $('#send').submit(app.handleSubmit);
  $('#roomSelect').on('change', app.handleRoomChange);

  // add New Room option to rooms
  let $newRoom = $('<option value="add_new_room"></option>').text('Add new room...');
  $('#roomSelect').append($newRoom);

  app.currentRoom = 'lobby';
  app.rooms = [].concat(app.currentRoom);
  app.renderRoom(app.currentRoom);
  document.querySelector('#roomSelect [value="lobby"]').selected = true;
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
  const messageText = $('<div>').text(message.text).html();
  const userName = $('<div>').text(message.username).html();


  const $message = $('<div></div>').addClass('message');
  const $username = $('<span></span>').addClass('username').text(userName);
  const $text = $('<span></span>').addClass('text').text(messageText);
  $message.append($username).append($text);
  $('#chats').append($message);
};

app.renderRoom = function(roomName) {
  const roomNameEscaped = $('<div>').text(roomName).html();
  const $newRoom = $('<option value="' + roomNameEscaped + '"></option>').text(roomNameEscaped);
  $('#roomSelect').append($newRoom);
};

app.handleUsernameClick = function(username) {
  // add friend?
};

app.handleRoomChange = function(event) {
  // see if it's the add new room value
  if (event.target.value === 'add_new_room') {
    app.createNewRoom();
  } else {
    // reset the current room
    app.currentRoom = event.target.value;
    app.fetch();
  }
};

app.handleSubmit = function(event) {
  event.preventDefault();
  // grab message from form
  const messageText = $('#message').val();
  $('#message').val('');
  const messageUsername = app.getUsername();
  const messageRoomname = app.currentRoom;

  // message has 'text', 'username', and 'roomname'


  // use send to submit to server
  app.send({
    text: messageText,
    username: messageUsername,
    roomname: messageRoomname
  });
};

app.createNewRoom = function() {
  const name = prompt('Enter new room name.') || 'lobby';
  // see if it's in out list at all
  if (app.rooms.indexOf(name) > -1) {
    // if it is, just change the room to the input room
    app.currentRoom = name;
  } else {
    // if it is not, then add the room, change current room, and change the
    // displayed room
    app.rooms.push(name);
    app.currentRoom = name;
    // add it to screen
    app.renderRoom(name);
  }
  // fetch and update the displayed room
  app.fetch();
  document.querySelector('#roomSelect [value="' + name + '"]').selected = true;
};

app.getUsername = function() {
  return window.location.search.replace(/(&|\?)username=/, '');
};

$(function() {
  app.init();
});

