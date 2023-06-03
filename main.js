const myShow = document.querySelectorAll('.content');
let currentIndex = 0;
let intervalId = null;

var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("MySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

// Set interval for automatic sliding
function setSlideInterval(intervalTime) {
  intervalId = setInterval(() => {
    slideIndex++;
    if (slideIndex > document.getElementsByClassName("MySlides").length) {
      slideIndex = 1;
    }
    showSlides(slideIndex);
  }, intervalTime);
}

// clear interval for automatic sliding
function clearSlideInterval() {
  clearInterval(intervalId);
}

// get interval value from input and start automatic sliding
const startBtn = document.getElementById('start');
startBtn.addEventListener('click', () => {
  const intervalInput = document.getElementById('interval');
  const intervalValue = parseInt(intervalInput.value);
  setSlideInterval(intervalValue);
});

// stop automatic sliding
const stopBtn = document.getElementById('stop');
stopBtn.addEventListener('click', () => {
  clearSlideInterval();
});

window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

var start = function() {
  var audio = document.getElementById('audio');
  audio.crossOrigin = "anonymous";
  var ctx = new AudioContext();
  var analyser = ctx.createAnalyser();
  var audioSrc = ctx.createMediaElementSource(audio);
  audioSrc.connect(analyser);
  analyser.connect(ctx.destination);
   var frequencyData = new Uint8Array(analyser.frequencyBinCount);

  var canvas = document.getElementById('canvas'),
      cwidth = canvas.width,
      cheight = canvas.height - 2,
      meterWidth = 10,
      capHeight = 2,
      capStyle = '#fff',
      meterNum = 800 / (10 + 2),
      capYPositionArray = [];
  ctx = canvas.getContext('2d'),
  gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(1, 'rgba(33,50,159,0.91)');
  gradient.addColorStop(0.5, '#c50a0a');
  gradient.addColorStop(0, '#fdfbfb');

  function renderFrame() {
    var array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    var step = Math.round(array.length / meterNum);
    ctx.clearRect(0, 0, cwidth, cheight);
    for (var i = 0; i < meterNum; i++) {
      var value = array[i * step];
      if (capYPositionArray.length < Math.round(meterNum)) {
        capYPositionArray.push(value);
      };
      ctx.fillStyle = capStyle;
      if (value < capYPositionArray[i]) {
        ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
      } else {
        ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
        capYPositionArray[i] = value;
      };
      ctx.fillStyle = gradient;
      ctx.fillRect(i * 12, cheight - value + capHeight, meterWidth, cheight);
    }
    requestAnimationFrame(renderFrame);
  }
  renderFrame();
  // audio.play();
};
audio.onplay = function(){
  start();
  audio.crossOrigin = "anonymous";
}

let time = document.querySelector(".time");
let btnPlay = document.querySelector(".play");
let btnPause = document.querySelector(".pause");
let btnPrev = document.querySelector(".prev1");
let btnNext = document.querySelector(".next1");

let playlist = [
  'music1.mp3',
  'music2.mp3',
  'music3.mp3',
];

let treck;
// Event before page loading
window. onload = function() {
  treck = 0;
}

function switchTreck (numTreck) {
  audio.src = './music/' + playlist[numTreck];
  audio. currentTime = 0;
  audio.play();
}

btnPlay.addEventListener("click", function() {
  audio.play();
  audioPlay = setInterval(function() {
    let audioTime = Math.round(audio.currentTime);
    let audioLength = Math.round(audio.duration)
    time.style.width = (audioTime * 100) / audioLength + '%';
    if (audioTime == audioLength && treck < 3) {
      treck++;
      switchTreck(treck);
    } else if (audioTime == audioLength && treck >= 3) {
      treck = 0;
      switchTreck(treck);
    }
  }, 10)
});

btnPause.addEventListener("click", function() {
  audio.pause();
  clearInterval(audioPlay)
});

btnPrev.addEventListener("click", function() {
  if (treck > 0) {
    treck--;
    switchTreck(treck);
  } else {
    treck = 3;
    switchTreck(treck);
  }
});

btnNext.addEventListener("click", function() {
  if (treck < 3) {
    treck++;
    switchTreck(treck);
  } else {
    treck = 0;
    switchTreck(treck);
  }
});






