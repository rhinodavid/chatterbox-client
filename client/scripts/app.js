// YOUR CODE HERE:

// friends
  // usernames are clickable > save 'friends'
  // all messages from friends are in bold
// delete empty rooms
// setInterval for fetch
// restyling



var app = {
  server: 'https://api.parse.com/1/classes/messages'
};

app.init = function() {
  app.friends = {};

  $('#send').submit(app.handleSubmit);
  $('#roomSelect').on('change', app.handleRoomChange);
  $('#chats').on('click', '.username', app.handleUsernameClick);

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
      limit: 100,
      order: '-createdAt'
    },
    success: (data) => {
      app.clearMessages();
      data.results.forEach((message) => {
        message.roomname = message.roomname || 'lobby';
        if (message.roomname.toLowerCase() === app.currentRoom.toLowerCase()) {
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
          if (app.rooms.indexOf(message.roomname.toLowerCase()) === -1) {
            app.renderRoom(message.roomname);
            app.rooms.push(message.roomname.toLowerCase());
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
  message.username = message.username || 'anonymous';

  const $message = $('<div></div>').addClass('message');
  const $username = $('<a href="#"></a>').addClass('username').text(message.username);
  const userName = $username.text();

  $username.data('username', userName);

  if (app.friends[userName]) {
    $message.addClass('friend');
  }

  const $text = $('<span></span>').addClass('text').text(message.text);
  $message.append($username).append($text);
  $('#chats').append($message);
};

app.renderRoom = function(roomName) {
  const $newRoom = $('<option />').val(roomName.toLowerCase()).text(roomName);
  $('#roomSelect').append($newRoom);
};

app.handleUsernameClick = function(event) {
  event.stopPropagation();
  let username = $(event.target).data('username');
  if (app.getUsername() === username || username === 'anonymous') {
    return;
  }
 
  app.friends[username] = !app.friends[username];
  app.fetch();
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

  // use send to submit to server
  app.send({
    text: messageText,
    username: messageUsername,
    roomname: messageRoomname
  });
};

app.createNewRoom = function() {
  const name = prompt('Enter new room name.') || 'lobby';
  const lowercaseName = name.toLowerCase();  
  if (app.rooms.indexOf(lowercaseName) > -1) {
    // if it is, just change the room to the input room
    app.currentRoom = name;
  } else {
    // if it is not, then add the room, change current room, and change the
    // displayed room
    app.rooms.push(lowercaseName);
    app.currentRoom = name;
    app.renderRoom(name);
  }
  // fetch and update the displayed room
  app.fetch();
  document.querySelector('#roomSelect [value="' + lowercaseName + '"]').selected = true;
};

app.getUsername = function() {
  return window.location.search.replace(/(&|\?)username=/, '');
};

$(function() {
  app.init();
});

