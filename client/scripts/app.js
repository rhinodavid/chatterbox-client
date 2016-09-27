// YOUR CODE HERE:


var app = {
  server: 'https://api.parse.com/1/classes/messages'
};

app.init = function() {
  $('#send .submit').submit(app.handleSubmit);
  app.fetch();
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
    data: {
      limit: 100
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
  let $username = $('<span></span>').addClass('message-username').text(escapeHtml(message.username));
  let $text = $('<span></span>').addClass('message-text').text(escapeHtml(message.text));
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
  console.log('handle submit');
  console.log(event);
};


var escapeHtml = function(string) {
  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
    '/': '&#x2F;'
  };

  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
};



$(function() {
  app.init();
});

