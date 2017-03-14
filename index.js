// Copyright (c) 2017 Marshall Roch <marshall@mroch.com>
// All rights reserved.

"use strict";

const Alexa = require('alexa-sdk');
const babyconnect = require('baby-connect');
const moment = require('moment-timezone');

const bc = new babyconnect.BabyConnect(
  process.env.BABY_CONNECT_EMAIL,
  process.env.BABY_CONNECT_PASSWORD,
  process.env.BABY_CONNECT_DEVICE_ID
);

class UnknownDiaperKind {
  constructor(kind) {
    this.kind = kind;
  }
}

function getChildName(event) {
  return event.request.intent.slots.child.value ||
    process.env.BABY_CONNECT_DEFAULT_CHILD;
}

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers({
    'LaunchRequest': function () {
      this.emit(':ask',
        'Welcome to Baby Connect. You can say things like, Jack is asleep, or Jill woke up. What can I help you with?',
        'For instructions on what you can say, please say help me.'
      );
    },
    'SleepStartIntent': function () {
      const childName = getChildName(this.event);
      const time = moment().tz(process.env.BABY_CONNECT_TIMEZONE);
      bc.getUser()
        .then(user => user.kidByName(childName))
        .then(kid => kid.startSleeping(time))
        .then(() => this.emit(':tell', 'OK'))
        .catch(e => {
          console.error('Error: ', e);
          if (e instanceof babyconnect.UnknownChildError) {
            this.emit(':ask', 'I didn\'t catch which child. How can I help?', 'Sorry, how can I help?');
          } else {
            callback(e);
          }
        });
    },
    'SleepStopIntent': function () {
      const childName = getChildName(this.event);
      const time = moment().tz(process.env.BABY_CONNECT_TIMEZONE);
      bc.getUser()
        .then(user => user.kidByName(childName))
        .then(kid => kid.stopSleeping(time))
        .then(() => this.emit(':tell', 'OK'))
        .catch(e => {
          console.error('Error: ', e);
          if (e instanceof babyconnect.UnknownChildError) {
            this.emit(':ask', 'I didn\'t catch which child. How can I help?', 'Sorry, how can I help?');
          } else {
            callback(e);
          }
        });
    },
    'DiaperIntent': function () {
      const kind = this.event.request.intent.slots.diaper.value;
      const childName = getChildName(this.event);
      const time = moment().tz(process.env.BABY_CONNECT_TIMEZONE);
      bc.getUser()
        .then(user => user.kidByName(childName))
        .then(kid => {
          switch (kind) {
            case 'dirty and wet':
            case 'wet and dirty':
            case 'dirty wet':
            case 'wet dirty':
            case 'poopy and wet':
            case 'wet and poopy':
            case 'poopy wet':
            case 'wet poopy':
              return kid.dirtyAndWetDiaper(time);

            case 'dirty':
            case 'poopy':
              return kid.dirtyDiaper(time);

            case 'wet':
              return kid.wetDiaper(time);

            case 'dry':
            case 'empty':
              return kid.dryDiaper(time);

            default:
              throw new UnknownDiaperKind(kind);
          }
        })
        .then(() => this.emit(':tell', `OK, a ${kind} diaper`))
        .catch(e => {
          console.error('Error: ', e);
          if (e instanceof babyconnect.UnknownChildError) {
            this.emit(':ask', 'I didn\'t catch which child. How can I help?', 'Sorry, how can I help?');
          } else if (e instanceof UnknownDiaperKind) {
            this.emit(':ask', 'Poopy or wet? Please try again.', 'Sorry, how can I help?');
          } else {
            callback(e);
          }
        });
    },
    'AMAZON.StopIntent': function () {
      this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
      this.emit(':responseReady');
    },
    'Unhandled': function () {
      const help = 'You can say things like, Jack is asleep, or Jill woke up. What can I help you with?';
      this.emit(':ask', help, help);
    }
  });
  alexa.execute();
};
