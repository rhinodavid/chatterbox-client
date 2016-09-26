// YOUR CODE HERE:


var app = {
  server: 'https://api.parse.com/1/classes/messages'
};

app.init = function() {

};

app.send = function(message) {
  $.ajax({
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message), 
    success: (data, textStatus, jqXHR) => {
      console.log(data);
      console.log(textStatus);
      console.log(jqXHR);
    }
  });
};

app.fetch = function() {
  $.ajax({
    url: this.server, 
    success: (data, textStatus, jqXHR) => {
      console.log(data);
      console.log(textStatus);
      console.log(jqXHR);
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderMessage = function(message) {
  let $message = $('<div></div>').append('<span class="username">' + message.username + '</span>');
  $message.text(message.text);
  $('#chats').append($message);
};

app.renderRoom = function(roomName) {
  let $newRoom = $('<li></li>').text(roomName);
  $('#roomSelect').append($newRoom);
};

app.handleUsernameClick = function(username) {
  // add friend?
};



