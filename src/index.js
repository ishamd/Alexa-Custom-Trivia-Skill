'use strict';

var Alexa = require('alexa-sdk');
var stateHandlers = require('./stateHandlers');

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
    // alexa.appId = 'appId';
    alexa.registerHandlers(
        stateHandlers.startModeIntentHandlers
        // stateHandlers.playModeIntentHandlers
      );
    alexa.execute();
};
