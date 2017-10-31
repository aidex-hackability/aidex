
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
    'WeatherIntent' : function () {
        const speechOutput = 'Here I can help you to get the weather information, after I have learnt a bit more myself.';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'ClimateStatusIntent' : function () {
        const speechOutput = 'Here I can help you to get the climate setting here, after I have learnt a bit more myself.';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },

    'ClimateControlIntent' : function () {
        const speechOutput = 'Here I can help you to make the climate here more comfortable, after I have learnt a bit more myself.';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'FanStatusIntent' : function () {
        const speechOutput = 'Here I can help you to get ihe fan status, after I have learnt a bit more myself.';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'FanControlIntent' : function () {
        const speechOutput = 'Here I can help you to trun on or off the fan, after I have learnt a bit more myself.';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'PowerStatusIntent' : function () {
        const speechOutput = 'Here I can help you to get the power status of some equipment in the room, after I have learnt a bit more myself.';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
     'PowerControlIntent' : function () {
        const speechOutput = 'Here I can help you to turn on or off some equipment in the room, after I have learnt a bit more myself.';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
     'LightStatusIntent' : function () {
        const speechOutput = 'Here I can help you to get the status of the light, after I have learnt a bit more myself.';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'LightControlIntent' : function () {
        const speechOutput = 'Here I can help you to adjust the light, after I have learnt a bit more myself.';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
     'DriveStatusIntent' : function () {
        const speechOutput = 'Here I can help you to get the status of your wheels, after I have learnt a bit more myself.';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'DriveControlIntent' : function () {
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
