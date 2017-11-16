

'use strict';
const Alexa = require("alexa-sdk");

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

// Commonly used text strings
const GENERIC_HELP_TEXT = "Anything else I can help you with? You can always said help free me";
const NOT_IMPL_TXT = "I will be able to help you with that shortly, after I have learnt a bit more myself."
const MISSING_INFO = "MISSING INFO"

// factor out the common string out later
// break down into different handler
// use state when is needed (use the dynamoDB etc.) or use Session attribute
// use randomize text 
// remember to use the yes/no built-in intent
// Use SSML
const handlers = {
    'LaunchRequest': function () {
        this.emit('SayGreeting');
    },
    // This is just a place holder for now
    'SystemIntent' : function () {
        const speechOutput = "Here I can give you a brief summary of all the AIDex systems, after I have learnt a bit more myself.";
        const reprompt = GENERIC_HELP_TEXT;
        const skillName = 'SystemIntent';
        const textCard = "Here I can give you a brief summary of all the AIDex systems, after I have learnt a bit more myself.";
        
        this.response.cardRenderer(skillName,textCard);
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    // pretend that I can't find a themostate
    'ClimateStatusIntent' : function () {
        const speechOutput = "hum, I can't sense a themostat here. Sorry. Anything else I can do for you?";
        const reprompt = GENERIC_HELP_TEXT;
        const skillName = 'ClimateStatusIntent';
        const textCard = speechOutput;
        
        this.response.cardRenderer(skillName,textCard);
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    // TODO:
    // - add checking for temperature, and confirmation (stateful)
    'ClimateSetIntent' : function () {
        const intent = this.event.request.intent;
        const reprompt = GENERIC_HELP_TEXT;
        
        let speechOutput = "hum, I can't sense a themostat here. ";
        let skillName = "ClimateSetIntent ";
        let textCard = speechOutput;
        
        let temperature = 0;
        let unit = ""

        if (intent.slots.Temperature.value) {
            temperature = intent.slots.Temperature.value;
            unit = intent.slots.Unit.value;
            skillName += temperature.toString() + " " + unit; // temperature has type AMAZON.NUMBER
        } else {
            skillName += "MISSING INFO";
        }

        this.response.cardRenderer(skillName,textCard);
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    // this might need to be stateful here
    // if no previous temperature set, use the default and adjust from there
    'ClimateSetIncIntent' : function () {
        let speechOutput = "hum, I can't sense a themostat here. ";
        let skillName = "ClimateSetIncIntent ";
        let textCard = speechOutput;
        const reprompt = GENERIC_HELP_TEXT;
        
        this.response.cardRenderer(skillName,textCard);
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    // this might need to be stateful here
    // if no previous temperature set, use the default and adjust from there
    'ClimateSetDecIntent' : function () {
        let speechOutput = "hum, I can't sense a themostat here. ";
        let skillName = "ClimateSetDecIntent ";
        let textCard = speechOutput;
        const reprompt = GENERIC_HELP_TEXT;
        
        this.response.cardRenderer(skillName,textCard);
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },    
    // end Climate Intents here
    // TODO: get the fake status from the database
    'FanStatusIntent' : function () {
        const intent = this.event.request.intent;
        const reprompt = GENERIC_HELP_TEXT;
        
        let speechOutput = "hum, I can't sense any fan here."
        let textCard = speechOutput;
        let skillName = "FanStatusIntent ";
        
        let status = "";
        if (intent && intent.slots && intent.slots.Status && intent.slots.Status.value ) {
            status = intent.slots.Status.value;
            skillName += status;
        } else {
            skillName += "MISSING INFO";
        }

        this.response.cardRenderer(skillName,textCard);
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
        //this.emit(':speakWithCard');
    },
    // TODO: Update the database with the input
    'FanControlIntent' : function () {
        const intent = this.event.request.intent;
        const reprompt = GENERIC_HELP_TEXT;
        
        let speechOutput = "hum, I can't sense any fan here."
        let textCard = speechOutput;
        let skillName = "FanControlIntent ";
        
        let status = "";
        if (intent && intent.slots && intent.slots.Status && intent.slots.Status.value ) {
            status = intent.slots.Status.value;
            skillName += status;
        } else {
            skillName += "MISSING INFO";
        }

        this.response.cardRenderer(skillName,textCard);
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'FanSetIntent' : function () {
        const intent = this.event.request.intent;
        const reprompt = GENERIC_HELP_TEXT;
        
        let speechOutput = "hum, I can't sense any fan here."
        let textCard = speechOutput;
        let skillName = "FanSetIntent ";
        
        let fan = 0;
        if (intent && intent.slots && intent.slots.FanLevel && intent.slots.FanLevel.value ) {
            fan = intent.slots.FanLevel.value;
            skillName += fan.toString();
        } else {
            skillName += "MISSING INFO";
        }

        this.response.cardRenderer(skillName,textCard);
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },    
    // this one retrieve database for data
    'PowerStatusIntent' : function () {
        const intent = this.event.request.intent;
        const powerSelMax = 4; // factor these two out!!!
        const powerSelMin = 1;
        
        let speechOutput = "I can help you with that.";
        let textCard = speechOutput;
        let skillName = "PowerStatusIntent ";
        let reprompt = "";
        
        let status = "";
        let selector = 0;
        if (intent && intent.slots && 
                intent.slots.PowerSelector &&
                intent.slots.Status) {
            if (intent.slots.Status.value == undefined) {
                // this should be from DB anyway
                status = "off";
            } else {
                status = intent.slots.Status.value;
            }
            selector = intent.slots.PowerSelector.value;
            if (selector >= powerSelMin && selector <= powerSelMax) {
                skillName += selector.toString() + " " + status;
                reprompt = "Power plug " + selector.toString() + " is " + status + ".";
                reprompt += " " + GENERIC_HELP_TEXT;                
            } else {
                reprompt = "I don't know where Power plug " + selector.toString() + " is. Sorry";
                skillName += "MISSING INFO";
            }

        } else {
            skillName += "MISSING INFO";
            // need to add pause somewhere
            reprompt = "Sorry I missed that, would you mind to repeat that?";
        }

        textCard = reprompt;
        this.response.cardRenderer(skillName,textCard);
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    // this one write to the db or session data
    'PowerControlIntent' : function () {
        const intent = this.event.request.intent;
        const powerSelMax = 4; // factor these two out!!!
        const powerSelMin = 1;
        
        let speechOutput = "I can help you with that.";
        let textCard = speechOutput;
        let skillName = "PowerControlIntent ";
        let reprompt = "";
        
        let status = "";
        let selector = 0;
        if (intent && intent.slots && 
                intent.slots.PowerSelector &&
                intent.slots.Status) {
            if (intent.slots.Status.value == undefined) {
                // this should be from DB anyway
                status = "off";
            } else {
                status = intent.slots.Status.value;
            }
            selector = intent.slots.PowerSelector.value;
            if (selector >= powerSelMin && selector <= powerSelMax) {
                skillName += selector.toString() + " " + status;
                reprompt = "Power plug " + selector.toString() + " is " + status + ".";
                reprompt += " " + GENERIC_HELP_TEXT;                
            } else {
                reprompt = "I don't know where Power plug " + selector.toString() + " is. Sorry";
                skillName += "MISSING INFO";
            }

        } else {
            skillName += "MISSING INFO";
            // need to add pause somewhere
            reprompt = "Sorry I missed that, would you mind to repeat that?";
        }

        textCard = reprompt;
        this.response.cardRenderer(skillName,textCard);
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
     'LightControlIntent' : function () {
        const intent = this.event.request.intent;
        
        let skillName = "LightControlIntent ";
        let textCard = "";
        let speechOutput = "I can help you with that.";
        let reprompt = GENERIC_HELP_TEXT;
        
        let status = "";
        if (intent && intent.slots && intent.slots.Status && intent.slots.Status.value ) {
            status = intent.slots.Status.value;
            skillName += status;
            textCard = "Light is " + status;
        } else {
            reprompt = "Sorry I missed that, would you mind to repeat that? You can say turn the light on."
            skillName += MISSING_INFO;
        }

        this.response.cardRenderer(skillName,textCard);
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'LightSetIntent' : function () {
        const intent = this.event.request.intent;
        const lightLevelMin = 1;
        const lightLevelMax = 10
        
        let skillName = "LightSetIntent ";
        let textCard = "";
        let speechOutput = "I can help you with that.";
        let reprompt = GENERIC_HELP_TEXT;
        
        let light = "";
        if (intent && intent.slots && intent.slots.LightLevel && intent.slots.LightLevel.value ) {
            light = intent.slots.LightLevel.value;
            if (light >= lightLevelMin && light <= lightLevelMax) {
                skillName += light.toString();
                textCard = "Light level is now " + light;                
            } else {
                skillName += MISSING_INFO;
                textCard = "Light level is now " + MISSING_INFO;
                reprompt = "Sorry I missed that, would you mind to repeat that? You can say set light to level 5 etc."
            }

        } else {
            reprompt = "Sorry I missed that, would you mind to repeat that? You can say set light to level 5 etc."
            skillName += MISSING_INFO;
        }

        this.response.cardRenderer(skillName,textCard);
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');

    },
    'DriveSetIntent' : function () {
        const intent = this.event.request.intent;
        
        let skillName = "DriveSetIntent ";
        let textCard = "";
        let speechOutput = "I can help you with that.";
        let reprompt = GENERIC_HELP_TEXT;
        
        let speed = 0;
        if (intent && intent.slots && intent.slots.DriveSpeed && intent.slots.DriveSpeed.value ) {
            speed = intent.slots.DriveSpeed.value;
            skillName += speed.toString();
            textCard = "Drive speed is set to " + speed.toString();
            
            let str = "<p>the speed is set to " + speed.toString() + ".</p>";
            speechOutput += str
        } else {
            reprompt = "Sorry I missed that, would you mind to repeat that? You can say set drive speed 1."
            skillName += MISSING_INFO;
        }

        this.response.cardRenderer(skillName,textCard);
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');

    },
    'DriveSetIncIntent' : function () {
        const speechOutput = 'Here I can help you to get the status of your wheels, after I have learnt a bit more myself.';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'DriveSetDecIntent' : function () {
        const speechOutput = 'Here I can help you to get the status of your wheels, after I have learnt a bit more myself.';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },    
    'DriveTurnIntent' : function () {
        const intent = this.event.request.intent;
        const degMin = 10;
        const degMax = 90;
        
        let skillName = "DriveTurnIntent ";
        let speechOutput = "I can help you with that. ";
        let textCard = speechOutput;
        let reprompt = GENERIC_HELP_TEXT;

        let dir = "";
        let deg = 20; // some default value for now
        if (intent && intent.slots && 
            intent.slots.DriveDirection && intent.slots.DriveDirection.value &&
            intent.slots.DriveDegree && intent.slots.DriveDegree.value
            ) {
                // here is a good chance to use :ellicit
                // likely degree is missing from the dialog
                deg = intent.slots.DriveDegree.value;    
                if (deg >= degMin && deg <= degMax) {
                    dir = intent.slots.DriveDirection.value;
                    skillName += dir + " " + deg.toString();
                    
                    let str = "<p>turning " + dir + " by " + deg.toString() + " degrees.</p>";
                    speechOutput += str
                    reprompt = "Sorry I missied that. " + str;
                } else {
                    skillName += MISSING_INFO;            
                    reprompt = "Sorry I missed that, would you mind to repeat that? You can said turn left."
                }


        } else {
            reprompt = "Sorry I missed that, would you mind to repeat that? You can say turn left."
            skillName += MISSING_INFO;            
        }
        

        this.response.cardRenderer(skillName,textCard);
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');

    },
    // this just grab the speed
    'DriveStatusIntent' : function () {
        const intent = this.event.request.intent;
        
        let skillName = "DriveStatusIntent ";
        let speechOutput = "I can help you with that. ";
        let textCard = speechOutput;
        let reprompt = GENERIC_HELP_TEXT;

        // need to simulate with a database
        let speed = 1;
        skillName += speed.toString();
        speechOutput += "The drive speed is set to " + speed.toString();
        
        this.response.cardRenderer(skillName,textCard);
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');

    },    
    'DriveControlIntent' : function () {
        const intent = this.event.request.intent;
        
        let skillName = "DriveControlIntent ";
        let textCard = "";
        let speechOutput = "I can help you with that.";
        let reprompt = GENERIC_HELP_TEXT;
        
        let status = "";
        if (intent && intent.slots && intent.slots.DriveStatus && intent.slots.DriveStatus.value ) {
            status = intent.slots.DriveStatus.value;
            skillName += status;
            textCard = "Drive has " + status;
        } else {
            reprompt = "Sorry I missed that, would you mind to repeat that? You can say drive start etc."
            skillName += MISSING_INFO;
        }

        this.response.cardRenderer(skillName,textCard);
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    // replace this with yes/no , no intent
    'nullIntent' : function () {
        const speechOutput = 'Great!';
        const reprompt = GENERIC_HELP_TEXT;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },    
    'SayGreeting' : function () {
        const speechOutput = "Hi Deborah, Welcome AIDex Free Me! How may I make your day better? Just say help free me and we will start from there."
        const reprompt = "In case you missed it, just say help free me and we will start from there."
        const textCard = speechOutput;
        
        this.response.cardRenderer('SayGreeting',textCard);
        this.response.speak(speechOutput).listen(reprompt);
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
    },
    'AMAZON.PauseIntent': function () {
        this.response.speak('This will be implememnt later')  ;
        this.emit(':responseReady');
    },
    'AMAZON.ResumeIntent' : function () {
        this.response.speak('This will be implememnt later')  ;
        this.emit(':responseReady');        
    },
    'AMAZON.PreviousIntent' : function () {
        this.response.speak('This will be implememnt later')  ;
        this.emit(':responseReady');                
    },
    'AMAZON.NextIntent' : function () {
        this.response.speak('This will be implememnt later')  ;
        this.emit(':responseReady');                
    },
    'AMAZON.HelpIntent' : function () {
        this.response.speak('This will be implememnt later')  ;
        this.emit(':responseReady');                
    },    
    'AMAZON.ScrollUpIntent' : function () {
        this.response.speak('This will be implememnt later')  ;
        this.emit(':responseReady');                
    },
    'AMAZON.ScrollLeftIntent' : function () {
        this.response.speak('This will be implememnt later')  ;
        this.emit(':responseReady');                
    },
    'AMAZON.ScrollDownIntent' : function () {
        this.response.speak('This will be implememnt later')  ;
        this.emit(':responseReady');                
    },
    'AMAZON.ScrollRightIntent' : function () {
        this.response.speak('This will be implememnt later')  ;
        this.emit(':responseReady');                
    },
    'AMAZON.PageUpIntent' : function () {
        this.response.speak('This will be implememnt later')  ;
        this.emit(':responseReady');                
    },
    'AMAZON.PageDownIntent' : function () {
        this.response.speak('This will be implememnt later')  ;
        this.emit(':responseReady');                
    },
    'AMAZON.MoreIntent' : function () {
        this.response.speak('This will be implememnt later')  ;
        this.emit(':responseReady');                
    },
    'AMAZON.NavigateSettingsIntent' : function () {
        this.response.speak('This will be implememnt later')  ;
        this.emit(':responseReady');                
    },
    'AMAZON.StopIntent' : function () {
        this.response.speak('This will be implememnt later')  ;
        this.emit(':responseReady');                
    },    
}
