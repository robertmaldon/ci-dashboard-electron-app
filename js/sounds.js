'use strict';

let audioEnabled = true;

const audioSuccessSounds = [
  'bart-eat-my-shorts',
  'burns-excellent',
  'flanders-okily-dokily',
  'homer-whoo-hoo',
  'krusty-laugh'
];
let audioSuccessIndex = 0;

const audioFailureSounds = [
  'homer-doh',
  'krusty-win2000',
  'nelson-ha-ha',
  'simpsons-doh-a-dear'
];
let audioFailureIndex = 0;

function playSuccess() {
  if (audioEnabled) {
    const audio = new Audio(`audio/simpsons/${audioSuccessSounds[audioSuccessIndex]}.mp3`);
    audio.play();
    audioSuccessIndex++;
    if (audioSuccessIndex >= audioSuccessSounds.length) {
      audioSuccessIndex = 0;
    }
  }
}

function playFailure() {
  if (audioEnabled) {
    const audio = new Audio(`audio/simpsons/${audioFailureSounds[audioFailureIndex]}.mp3`);
    audio.play();
    audioFailureIndex++;
    if (audioFailureIndex >= audioFailureSounds.length) {
      audioFailureIndex = 0;
    }
  }
}
