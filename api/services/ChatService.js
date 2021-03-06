var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {
  getChats,
  addUserMessage,
  addMachineMessage,
  addVideoMessage
};

function getChats() {
  return Chat.find({
    createdAt: {
      '>=': new Date(Date.now() - sails.config.globals.videoHistory * 60 * 1000)
    }
  });
}

function addUserMessage(chat) {
  chat.time = new Date(chat.time).toISOString();
  addMessage(chat);
}

function addMachineMessage(message, username, type='machine') {
  var chat = {
    message: message,
    type: type,
    username: username,
    time: new Date().toISOString()
  };
  addMessage(chat);
}

function addVideoMessage(message, type) {
  var chat = {
    message: message,
    type: type,
    time: new Date().toISOString()
  };
  addMessage(chat);
}

function addMessage(chat) {
  Chat.create(chat)
    .then((c) => {
      sails.io.sockets.in('chatting').emit('chat', c);
    })
    .catch((e) => logger.warn(e));
}
