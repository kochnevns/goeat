'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const TelegramBot = require('telegram-bot-oop-way');
const token = '' + process.argv[2]
const pollTimeout = 1000 * 60 * 3;
class GoEatBot extends TelegramBot {

    constructor(token) {
        super(token);
        let self = this;
        this.whoStartedPoll = null;
        this.people = [];
        this.registerOnTextCallback(/\/go/gim, self.go.bind(self));
        this.registerOnTextCallback(/\/plus/gim, self.plus.bind(self));

    }

    go(msg) {
      let [name, chatID] = [this.getUserName(msg), msg.chat.id];
      if (this.whoStartedPoll) {
         this.sendMessage(chatID, `${this.whoStartedPoll} Уже предлагал пожрать! Присоединяйся ;)`);
         return;
      }
      this.whoStartedPoll = name;
      this.sendMessage(chatID, `${name} предлагает пожрать 🍔🍔🍔🍔. Ставь /plus если тоже хочешь!`);
      this.people.push(name);
      this.startTimer(chatID);

    }
    plus(msg) {
      let [name, chatID] = [this.getUserName(msg), msg.chat.id];
      if (!~this.people.indexOf(name)) {
        this.people.push(name);
      }
      //this.answerCallbackQuery(msg.id, 'ты в деле');

    }
    startTimer(chatID) {
      setTimeout(() => {
        this.sendMessage(chatID, `Го жрать! Состав: ${this.people.join(', ')}. Собирал ${this.whoStartedPoll}`);
        this.people = [];
        this.whoStartedPoll = null;
      }, pollTimeout);
    }
}


new GoEatBot(token);
