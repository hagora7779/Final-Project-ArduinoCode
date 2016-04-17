// Create the wrapper with "tts.js" provider with full options
var Speak = require('tts-speak');
var speak = new Speak({
    tts: {
        engine: 'tts',                  // The engine to use for tts
        lang: 'en-us',                  // The voice to use
        amplitude: 100,                 // Amplitude from 0 to 200
        wordgap: 0,                     // Gap between each word
        pitch: 50,                      // Voice pitch
        speed: 60,                      // Speed in %
        cache: __dirname + '/cache',    // The cache directory were audio files will be stored
        loglevel: 0,                    // TTS log level (0: trace -> 5: fatal)
        delayAfter: 700                 // Mark a delay (ms) after each message
    },
    speak: {
        volume: 80,                     // Audio player volume
        loglevel: 0                     // Audio player log level
    },
    loglevel: 0                         // Wrapper log level
});
speak.once('ready', function() {

    // Chaining
    speak
        .say("Hello and welcome here !")
        .wait(1000)
        .say({
            src: 'Parlez-vous français ?',
            lang: 'fr-fr',
            speed: 30
        });

    // Catch when all queue is complete
    speak.once('idle', function() {
        speak.say("Of course, with my new text to speech wrapper !");
    });

    // Will stop and clean all the queue
    setTimeout(function() {
        speak.stop();
        speak.say('Ok, abort the last queue !')
    }, 1000);

});
