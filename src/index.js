
'use strict';
const Alexa = require("alexa-sdk");

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

// factor out the common string out later
const handlers = {
    'LaunchRequest': function () {
        this.emit('SayGreeting');
    },
    'SystemIntent' : function () {
        const speechOutput = 'Here I can give you a brief summary of all the AIDex systems, after I have learnt a bit more myself.';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'ClimateIntent' : function () {
        const speechOutput = 'Here I can help you to make the climate here more comfortable, after I have learnt a bit more myself.';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'FanIntent' : function () {
        const speechOutput = 'Here I can help you to trun on or off the fan, after I have learnt a bit more myself.';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'PowerIntent' : function () {
        const speechOutput = 'Here I can help you to turn on or off some equipment in the room, after I have learnt a bit more myself.';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'LightIntent' : function () {
        const speechOutput = 'Here I can help you to adjust the light, after I have learnt a bit more myself.';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'DriveIntent' : function () {
        const speechOutput = 'Here I can help you to move around, after I have learnt a bit more myself.';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'SayGreeting' : function () {
        this.response.speak('Hi Deborah, Welcome AIDex Free Me! How may I make your day better? Just say help free me and we will start from there.');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = 'Just give me sometime to prepare myself, and I will be helping you very soon! ';
        const reprompt = 'Say free me again in a bit, and I should be ready.';

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('Goodbye!');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak('See you later');
        this.emit(':responseReady');
    }
}