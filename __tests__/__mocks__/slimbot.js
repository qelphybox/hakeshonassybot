class MockSlimbot {
  constructor(testCallback) {
    this.testCallback = testCallback;
  }

  sendMessage(chatId, text, params) {
    this.text = text;
    this.chatId = chatId;
    this.params = params;
    this.testCallback(this.text);
  }
}

module.exports = MockSlimbot;
