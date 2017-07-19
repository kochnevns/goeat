'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const TelegramBot = require('telegram-bot-oop-way');
const token = '' + process.argv[2]
const pollTimeout = 1000 * 60;
class GoEatBot extends TelegramBot {

    constructor(token) {
        super(token);
        let self = this;
        this.whoStartedPoll = {};
        this.people = {};
        this.registerOnTextCallback(/\/go/gim, self.go.bind(self));
        this.registerOnTextCallback(/\/plus/gim, self.plus.bind(self));

    }

    go(msg) {
      let [name, chatID] = [this.getUserName(msg), msg.chat.id];
      if (this.people[chatID]) {
         this.sendMessage(chatID, `${this.whoStartedPoll[chatID]} Уже предлагал пожрать! Присоединяйся ;)`);
         return;
      }
      this.whoStartedPoll[chatID] = name;
      this.sendMessage(chatID, `${name} предлагает пожрать 🍔🍔🍔🍔. Ставь /plus если тоже хочешь!`);
      this.people[chatID] = [];
      this.people[chatID].push(name);
      this.startTimer(chatID);

    }
    plus(msg) {
      let [name, chatID] = [this.getUserName(msg), msg.chat.id];
        this.people.push(name);

      //this.answerCallbackQuery(msg.id, 'ты в деле');

    }
    startTimer(chatID) {
      setTimeout(() => {
        let uniquePeople = new Set(this.people[chatID])
        this.sendMessage(chatID, `Го жрать! Состав: ${Array.from(uniquePeople).join(', ')}. Собирал ${this.whoStartedPoll[chatID]}`);
        delete this.people[chatID];
        delete this.whoStartedPoll[chatID];
      }, pollTimeout);
    }
}


new GoEatBot(token);
