'use strict';
var Alexa = require("alexa-sdk");

// For detailed tutorial on how to making a Alexa skill,
// please visit us at http://alexa.design/build


// use bind, apply or call ...
// e.g. emitResponse.call(this,'SayGreeting', textCard, speechOutput, reprompt);
function emitResponse(intentName, textCard, speak, reprompt) {
    this.response.cardRenderer(intentName,textCard);
    if (reprompt == undefined) {
        this.response.speak(speak);
    } else {
        this.response.speak(speak).listen(reprompt);
    }
    // added return just in case
    // seems like for :elicitSlot and :confirmSlot return is explicitly required
    return this.emit(':responseReady'); // added return just in case
}


exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        // set session variables
        if(Object.keys(this.attributes).length === 0) {
            this.attributes['driveState'] = [{speed:0,turn:'straight',deg:'0'}];
            this.attributes['batteryState'] = [90];
            this.attributes['location'] = ["Don't be silly, you are at the Blind Duck Pub!"];
        }

        const intentName = 'LaunchRequest';
        const textCard = 'Hi Deborah';
        const speak = 'Hi Deborah';
        const reprompt = 'How may I help you?';
        emitResponse.call(this,intentName,textCard,speak,reprompt);
    },
    'DriveControlIntent': function () {
        // ref: https://gist.github.com/stormbytes/7ee3a05aa03c0ada0621dde746f2a6f9
        const intent = this.event.request.intent;
        const intentName = 'DriveControlIntent';

        let status = undefined;
        if (intent.slots.Status.value) {
            // all slots are in place
            status = intent.slots.Status.value;
            console.log("DriveControlIntent: " + status);
        } else {
            // ask for the missing slot
            //const slotToElicit = 'Type' // doesn't work yet without the dialog model
			const speechOutput = "Seems like I missed something. Do you mean 'Drive start' or 'Drive stop'?";
            const reprompt = speechOutput;
            const textCard = speechOutput;
            //const updatedIntent = 'DriveControlIntent';
            console.log("DriveControlIntent missing info. ");
            //return this.emit(':elicitSlot', slotToElicit, speechOutput, reprompt);
            emitResponse.call(this,intentName,textCard,speechOutput,reprompt);
        }

        // if the status is stop - don't brother with confirmation.
        
        const textCard = "Drive " + status;
        const speak = textCard;
        const reprompt = 'what else may I help you with?';
        if (status == 'stop') {
            this.attributes['driveState'][0].speed = 0;
            emitResponse.call(this,intentName,textCard,speak,reprompt);
            return; // earily exit
        } else
        {
            // temporary, until I figured out the how to turn on the dialog model.
            this.attributes['driveState'][0].speed = 1;
            emitResponse.call(this,intentName,textCard,speak,reprompt);
        }

        // This requires the Dialog model that I can turn on for some reason
        // confirm the slot vale
        // if (intent.slots.Status.confirmationStatus !== 'CONFIRMED') {
        //     if (intent.slots.Status.confirmationStatus !== 'DENIED') {
        //         // slot unconfirmed
        //         const slotToConfirm = 'Status';
		// 		const speechOutput = "You want to start the drive, am I correct?";
        //         const reprompt = speechOutput;
        //         console.log("DriveControlIntent prompt for confirmation.");
        //         return this.emit(':confirmSlot', slotToConfirm, speechOutput, reprompt);
        //     } else {
        //         // slot denied -> reprompt for slot data
        //         const slotToElicit = 'Status';
		// 		const speechOutput = "Would you like to to durn the start or stop the drive?";
        //         const reprompt = speechOutput;
        //         console.log("DriveControlIntent confirmation denied.");
        //         return this.emit(':elicitSlot', slotToElicit, speechOutput, reprompt);
        //     }
        // } else {
        //     // nothing yet
        // }
    },
    'ForwardIntent': function () {
        console.log("ForwardIntent");

        let speed = this.attributes['driveState'][0].speed;
        if (speed == 0) {
            this.attributes['driveState'][0].speed = 1;
            speed = 1;
        }
        const intentName = 'ForwardIntent';
        const textCard = "Go forward at speed " + speed.toString();
        const speak = textCard;
        const reprompt = 'what else may I help you with?';

        emitResponse.call(this,intentName,textCard,speak,reprompt);
    },
    'ReverseIntent': function () {
        console.log("ReverseIntent");
        
        // set the speed to -1 for reverse
        this.attributes['driveState'][0].speed = -1;
        const intentName = 'ReverseIntent';
        const textCard = "Going reverse";
        const speak = textCard;
        const reprompt = 'what else may I help you with?';

        emitResponse.call(this,intentName,textCard,speak,reprompt);
    },
    'TurnIntent': function () {
        console.log("TurnIntent");
        const intent = this.event.request.intent;
        const intentName = 'TurnIntent';
        
        // if the current speed is set to zero or drive is off/stop, don't do anything
        let speed = this.attributes['driveState'][0].speed;
        if (speed == 0) {
            const speechOutput = "Seems like the drive is not enabled. Try 'Drive start' if you planning to go somewhere.";
            const textCard = speechOutput;
			const reprompt = speechOutput;
            console.log("TurnIntent: Drive not started. ");
            //return this.emit(':elicitSlot', slotToElicit, speechOutput, reprompt);
            emitResponse.call(this,intentName,textCard,speechOutput,reprompt); 
            return;
        }

        let turn = undefined;
        if (intent.slots.Direction.value) {
            // all slots are in place
            turn = intent.slots.Direction.value;
        } else {
            // ask for the missing slot
            //const slotToElicit = 'Type'
            const speechOutput = "Seems like I missed something. Do you mean 'Turn left' or 'Turn right'?";
            const textCard = speechOutput;
			const reprompt = speechOutput;
            //const updatedIntent = 'DriveControlIntent';
            console.log("TurnIntent missing info. ");
            //return this.emit(':elicitSlot', slotToElicit, speechOutput, reprompt);
            emitResponse.call(this,intentName,textCard,speechOutput,reprompt);
        }
        if (turn == 'right') {
            this.attributes['driveState'][0].deg += 10;
        } else {
            this.attributes['driveState'][0].deg -= 10;
        }
        let deg = this.attributes['driveState'][0].deg;
        console.log("TurnIntent: " + turn + " deg: " + deg.toString());
 
        const speak = "Turning " + turn;        
        const textCard = "TurnIntent: " + turn + " deg: " + deg.toString();
        const reprompt = 'what else may I help you with?';

        emitResponse.call(this,intentName,textCard,speak,reprompt);

    },    
    'SpeedSetIntent': function () {
        console.log("SpeedSetIntent");
        const intent = this.event.request.intent;
        const intentName = 'SpeedSetIntent';
        
        let speed = undefined;
        if (intent.slots.Speed.value) {
            // all slots are in place
            speed = intent.slots.Speed.value;
        } else {
            // ask for the missing slot
            //const slotToElicit = 'Type'
            const speechOutput = "Seems like I missed something. Would you mind to repeat what speed you want?";
            const textCard = speechOutput;
			const reprompt = speechOutput;
            //const updatedIntent = 'DriveControlIntent';
            console.log("SpeedSetIntent missing info. ");
            //return this.emit(':elicitSlot', slotToElicit, speechOutput, reprompt);
            emitResponse.call(this,intentName,textCard,speechOutput,reprompt);
        }
        if ( (speed > 3) || (speed < 0) ) {
            const speechOutput = "Seems like the speed setting you want is not correct." + 
                "The correct speed input is 1, 2 or 3. Would you mind to repeat what speed you want?";
            const textCard = speechOutput;
            const reprompt = speechOutput;
            emitResponse.call(this,intentName,textCard,speechOutput,reprompt);
        } else {
            this.attributes['driveState'][0].speed = speed;
            const speak = "Setting speed to " + speed.toString();        
            const textCard = speak;
            const reprompt = 'what else may I help you with?';
            console.log(speak);
            emitResponse.call(this,intentName,textCard,speak,reprompt);
        }
    },
    'SpeedGetIntent': function () {
        console.log("SpeedGetIntent");
        const intentName = 'SpeedGetIntent';
        let speed = this.attributes['driveState'][0].speed;

        const speak = "Current speed is set to " + speed.toString();        
        const textCard = speak;
        const reprompt = 'what else may I help you with?';
        console.log(speak);
        emitResponse.call(this,intentName,textCard,speak,reprompt);
    },
    'RangeGetIntent': function () {
        console.log("RangeGetIntent");
        const intentName = 'RangeGetIntent';

        const speak = "<p>Current battery capacity is " + 
            this.attributes['batteryState'][0].toString() + " percent.</p>" + 
            "<p> there is a long way to go</p>"
        const textCard = speak;
        const reprompt = 'what else may I help you with?';
        console.log(speak);
        emitResponse.call(this,intentName,textCard,speak,reprompt);
    },
    'SystemStatusIntent': function () {
        const msg = [
            "Everything is okay.",
            "Don't worry, everything is okay",
            "System normal"
        ]
        let r = Math.floor(Math.random() * msg.length) // random returns [0,1)

        console.log("SystemStatusIntent");        
        const intentName = 'SystemStatusIntent';
        //const speak = "Everything is okay."
        const speak = msg[r]
        const textCard = speak;
        const reprompt = 'what else may I help you with?';
        console.log(speak);
        emitResponse.call(this,intentName,textCard,speak,reprompt);
    },
    'LocationGetIntent': function () {
        console.log("LocationGetIntent");
        const intentName = 'LocationIntent';
        //const speak = "I believe your current location is around " + this.attributes['location'][0];
        const speak = "<p>I believe your current location is around,</p> <p>wait</p> " + this.attributes['location'][0];
        const textCard = speak;
        const reprompt = 'what else may I help you with?';
        console.log(speak);
        emitResponse.call(this,intentName,textCard,speak,reprompt);
    },    
    'ExitIntent' : function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
        const intentName = 'SessionEndedRequest';
        const speak = 'Bye Deborah';
        const textCard = speak;
        const reprompt = undefined;
        emitResponse.call(this,intentName,textCard,speak,reprompt);
    },
    'AMAZON.StopIntent' : function() {
        const intentName = 'StopIntent';
        const speak = 'okay';
        const textCard = speak;
        const reprompt = 'what else I can help you with?';
        emitResponse.call(this,intentName,textCard,speak,reprompt);
    },
    'AMAZON.HelpIntent' : function() {
        // check for uninit session data
        // this is for edge case when someone said:
        // " ask Adrian for help"
        if(Object.keys(this.attributes).length === 0) {
            this.attributes['driveState'] = [{speed:0,turn:'straight',deg:'0'}];
            this.attributes['batteryState'] = [90];
            this.attributes['location'] = ['Montreal'];
        }

        const intentName = 'HelpIntent';
        const speak = "<p>for controlling your wheel chair, you can try 'go forward', 'reverse', 'drive stop' 'turn left' or 'turn right' </p>" + 
            "<p>To adjust the speed, just said 'set speed to 1' or something similar.</p>";
        const textCard = speak;
        const reprompt = 'anything else I can help you with?';
        emitResponse.call(this,intentName,textCard,speak,reprompt);
    },
    'AMAZON.CancelIntent' : function() {
        const intentName = 'CancelIntent';
        const speak = 'got it';
        const textCard = speak;
        const reprompt = 'what else I can help you with?';
        emitResponse.call(this,intentName,textCard,speak,reprompt);
    },
    'Unhandled' : function() {
        const intentName = 'Unhandled';
        const speak = "Sorry, I didn't get that. You can try: 'help Adrian'";
        const textCard = speak;
        const reprompt = 'what else I can help you with?';
        emitResponse.call(this,intentName,textCard,speak,reprompt);
        //this.response.speak("Sorry, I didn't get that. You can try: 'help Adrian'");
    }
};
