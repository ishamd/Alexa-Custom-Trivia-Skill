/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

const Alexa = require('alexa-sdk');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const welcomeOutput = "Let's focus. How long would you like to focus?";

const handlers = {
  'LaunchRequest': function () {
    this.emit(':ask', welcomeOutput);
  },
  'startTimerIntent': function () {
    const filledSlots = delegateSlotCollection.call(this);
    let speechOutput = 'Thank you. Your timer is set';
    const timerLength = this.event.request.intent.slots.timerLength.value;
    const shortBreak = this.event.request.intent.slots.shortBreak.value;
    const longBreak = this.event.request.intent.slots.longBreak.value;
    speechOutput += ` for ${timerLength} with a ${shortBreak} short break and a ${longBreak} long break  `;
    this.emit(':tellWithCard', speechOutput);
  },
  'AMAZON.HelpIntent': function () {
    const speechOutput = '';
    const reprompt = '';
    this.emit(':ask', speechOutput, reprompt);
  },
  'AMAZON.CancelIntent': function () {
    const speechOutput = '';
    this.emit(':tell', speechOutput);
  },
  'AMAZON.StopIntent': function () {
    const speechOutput = '';
    this.emit(':tell', speechOutput);
  }
};

exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
  // alexa.resources = languageStrings;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

// helper functions

function delegateSlotCollection() {
  console.log('in delegateSlotCollection');
  console.log(`current dialogState: ${this.event.request.dialogState}`);
  if (this.event.request.dialogState === 'STARTED') {
    console.log('in Beginning');
    const updatedIntent = this.event.request.intent;
      // optionally pre-fill slots: update the intent object with slot values for which
      // you have defaults, then return Dialog.Delegate with this updated intent
      // in the updatedIntent property
    this.emit(':delegate', updatedIntent);
  } else if (this.event.request.dialogState !== 'COMPLETED') {
    console.log('in not completed');
      // return a Dialog.Delegate directive with no updatedIntent property.
    this.emit(':delegate');
  } else {
    console.log('in completed');
    console.log(`returning: ${JSON.stringify(this.event.request.intent)}`);
      // Dialog is now complete and all required slots should be filled,
      // so call your normal intent handler.
    return this.event.request.intent;
  }
}
