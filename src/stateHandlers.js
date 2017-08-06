'Use strict';

let Alexa = require('alexa-sdk');
let audioData = require('./audioAssets');
const STATES = {
        START_MODE : '',
        PLAY_MODE : '_PLAY_MODE'
      };

let stateHandlers = {
    startModeIntentHandlers : Alexa.CreateStateHandler(STATES.START_MODE, {
      /*
       *  All Intent Handlers for state : START_MODE
       */
      'LaunchRequest' : function () {
          // Initialize Attributes
          this.attributes['playOrder'] = Array.apply(null, {length: audioData.length}).map(Number.call, Number);
          this.attributes.index = 0;
          this.attributes.offsetInMilliseconds = 0;
          this.attributes.loop = false;
          this.attributes.shuffle = true;
          this.attributes.playbackIndexChanged = true;
          //  Change state to START_MODE
          this.handler.state = STATES.START_MODE;

          let message = 'Helpful message';
          let reprompt = 'Helpful message';

          this.response.speak(message).listen(reprompt);
          this.emit(':responseReady');
      },
      'PlayAudio' : function () {
          if (!this.attributes.playOrder) {
              // Initialize Attributes if undefined.
              this.attributes.playOrder = Array.apply(null, {length: audioData.length}).map(Number.call, Number);
              this.attributes.index = 0;
              this.attributes.offsetInMilliseconds = 0;
              this.attributes.loop = true;
              this.attributes.shuffle = false;
              this.attributes.playbackIndexChanged = true;
              //  Change state to START_MODE
              this.handler.state = STATES.START_MODE;
          }
          controller.play.call(this);
      },
      'AMAZON.HelpIntent' : function () {
          let message = 'Helpful message';
          this.response.speak(message).listen(message);
          this.emit(':responseReady');
      },
      'AMAZON.StopIntent' : function () {
          let message = 'Good bye.';
          this.response.speak(message);
          this.emit(':responseReady');
      },
      'AMAZON.CancelIntent' : function () {
          let message = 'Good bye.';
          this.response.speak(message);
          this.emit(':responseReady');
      },
      'SessionEndedRequest' : function () {
          // No session ended logic
      },
      'Unhandled' : function () {
          let message = 'Sorry, I could not understand.';
          this.response.speak(message).listen(message);
          this.emit(':responseReady');
      }
  })
  /*
   *  All Intent Handlers for state : PLAY_MODE
   */
//   playModeIntentHandlers : Alexa.CreateStateHandler(STATES.PLAY_MODE, {
//     //TODO PLAY_MODE Logic
//     'AnswerIntent': function(){
//
//     },
//     'DontKnowIntent' : function() {
//
//     },
//     'RestartIntent' : function() {
//
//     },
//     'QuitIntent' : function(){
//
//     },
//     'RepeatIntent' : function(){
//
//     },
//     'Unhandled': function(){
//
//     }
//   })
};


let controller = function () {
    return {
        play: function () {
            /*
             *  Using the function to begin playing audio when:
             *      Play Audio intent invoked.
             *      Resuming audio when stopped/paused.
             *      Next/Previous commands issued.
             */

            // this.handler.state = STATES.PLAY_MODE;

            if (this.attributes.playbackFinished) {
                // Reset to top of the playlist when reached end.
                this.attributes.index = 0;
                this.attributes.offsetInMilliseconds = 0;
                this.attributes.playbackIndexChanged = true;
                this.attributes.playbackFinished = false;
            }

            let token = String(this.attributes.playOrder[this.attributes.index]);
            let playBehavior = 'REPLACE_ALL';
            let song = audioData[this.attributes.playOrder[this.attributes.index]];
            let offsetInMilliseconds = this.attributes.offsetInMilliseconds;
            // Since play behavior is REPLACE_ALL, enqueuedToken attribute need to be set to null.
            this.attributes.enqueuedToken = null;

            this.response.audioPlayerPlay(playBehavior, song.url, token, null, offsetInMilliseconds);
            this.emit(':responseReady');
        },
        stop: function () {
            /*
             *  Issuing AudioPlayer.Stop directive to stop the audio.
             *  Attributes already stored when AudioPlayer.Stopped request received.
             */
            this.response.audioPlayerStop();
            this.emit(':responseReady');
        },
        playNext: function () {
            /*
             *  Called when AMAZON.NextIntent or PlaybackController.NextCommandIssued is invoked.
             *  Index is computed using token stored when AudioPlayer.PlaybackStopped command is received.
             *  If reached at the end of the playlist, choose behavior based on "loop" flag.
             */
            let index = this.attributes.index;
            index += 1;
            // Check for last audio file.
            if (index === audioData.length) {
                if (this.attributes.loop) {
                    index = 0;
                } else {
                  //determine score
                  // get new batch of songs?
                    // Reached at the end. Thus reset state to start mode and stop playing.
                    this.handler.state = STATES.START_MODE;

                    let message = 'Helpful message';
                    this.response.speak(message).audioPlayerStop();
                    return this.emit(':responseReady');
                }
            }
            // Set values to attributes.
            this.attributes.index = index;
            this.attributes.offsetInMilliseconds = 0;
            this.attributes.playbackIndexChanged = true;

            controller.play.call(this);
        }
      };
    };
