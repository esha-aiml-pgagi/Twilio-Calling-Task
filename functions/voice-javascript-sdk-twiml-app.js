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
    const attr = isAValidPhoneNumber(event.To) ? 'number' : 'client';

    // Encode the number to send to backend
    const destinationNumber = encodeURIComponent(event.To);

    // Pass the number in the callback URL
    const callbackUrl = `https://asa-dilatate-typically.ngrok-free.dev/recordings/callback?DestNumber=${destinationNumber}`;

    const dial = twiml.dial({
      answerOnBridge: true,
      callerId: process.env.CALLER_ID,
      record: 'record-from-answer-dual',
      recordingTrack: 'both',
      recordingStatusCallback: callbackUrl,
      recordingStatusCallbackMethod: 'POST',
      recordingStatusCallbackEvent: ['completed', 'failed'],
    });

    dial[attr]({}, event.To);

  } else {
    twiml.say('Thanks for calling! No destination number or client specified.');
  }

  callback(null, twiml);
};
