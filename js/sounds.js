'use strict';

const audioDefaultTheme = 'simpsons';
let audioTheme = audioDefaultTheme;
let audioSuccessIndex = 0;
let audioFailureIndex = 0;

const allSounds = {
  'computergames': {
    'failure': [
      'aliens-game-over',
      'plants-vs-zombies-the-zombies-are-coming',
      'pacman-game-over',
      'plants-vs-zombies-evil-zombie-laugh',
      'ghostbusters-c64-intro'
    ],
    'success': [
      'angry-birds-bird-win',
      'pacman-play',
      'pokemon-gotta-catch-em-all',
      'space-invaders-play',
      'supermario-its-a-me',
      'the-last-starfighter-greetings-starfighter',
      'war-games-shall-we-play-a-game',
      'pokemon-yeah'
    ]
  },
  'simpsons': {
    'failure': [
      'homer-doh',
      'krusty-win2000',
      'nelson-ha-ha',
      'simpsons-doh-a-dear'
    ],
    'success': [
      'bart-eat-my-shorts',
      'burns-excellent',
      'flanders-okily-dokily',
      'homer-whoo-hoo',
      'krusty-laugh'
    ]
  },
  'starwars': {
    'failure': [
      'ackbar-Its-a-trap',
      'c3po-I-dont-know-what-this-trouble-is-all-about',
      'jabba-laughing',
      'c3po-Ive-just-about-had-enough-of-you',
      'jar-jar-oh-no',
      'c3po-this-is-madness',
      'vader-i-have-you-now',
      'jar-jar-this-embarrassing',
      'obi-won-use-the-force-luke',
      'jar-jar-woops',
      'obi-won-you-were-our-only-hope',
      'vader-you-have-failed-me-for-the-last-time',
      'yoda-there-is-no-try'
    ],
    'success': [
      'chewy-roar',
      'han-solo-great-kid-dont-get-cocky',
      'vader-impressive',
      'lightsaber-on',
      'obi-won-the-force-will-be-with-you',
      'vader-the-force-is-strong-with-this-one',
      'palpetine-good',
      'r2d2-whistle',
      'vader-good-work'
    ]
  }
};

function playSuccess() {
  if (audioTheme) {
    if (audioSuccessIndex >= allSounds[audioTheme]['success'].length) {
      audioSuccessIndex = 0;
    }
    const audio = new Audio(`audio/${audioTheme}/${allSounds[audioTheme]['success'][audioSuccessIndex]}.mp3`);
    audio.play();
    audioSuccessIndex++;
  }
}

function playFailure() {
  if (audioTheme) {
    if (audioFailureIndex >= allSounds[audioTheme]['failure'].length) {
      audioFailureIndex = 0;
    }
    const audio = new Audio(`audio/${audioTheme}/${allSounds[audioTheme]['failure'][audioFailureIndex]}.mp3`);
    audio.play();
    audioFailureIndex++;
  }
}
