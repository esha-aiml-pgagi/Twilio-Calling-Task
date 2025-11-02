/**
 * Checks if the given value is valid as phone number
 * @param {Number|String} number
 * @return {Boolean}
 */
function isAValidPhoneNumber(number) {
  return /^[\d\+\-\(\) ]+$/.test(number);
}

exports.handler = function (context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();

  if (event.To) {
    /*
     * Determine if the destination is a phone number or a client name.
     * If it's a number, use the <Number> noun; otherwise use <Client>.
     */
    const attr = isAValidPhoneNumber(event.To) ? 'number' : 'client';

    // --- TwiML <Dial> verb configuration ---
    const dial = twiml.dial({
      answerOnBridge: true,
      callerId: process.env.CALLER_ID,

      // --- Recording Settings ---
      record: 'record-from-answer-dual', // start recording once answered
      recordingTrack: 'both', // record both caller + callee
      recordingStatusCallback: 'https://asa-dilatate-typically.ngrok-free.dev/recordings/callback', // change to your FastAPI endpoint
      recordingStatusCallbackMethod: 'POST',
      recordingStatusCallbackEvent: ['completed', 'failed'],
    });

    // Add the destination (number or client)
    dial[attr]({}, event.To);

  } else {
    // Default fallback if no destination is provided
    twiml.say('Thanks for calling! No destination number or client specified.');
  }

  // Return the TwiML to Twilio
  callback(null, twiml);
};
