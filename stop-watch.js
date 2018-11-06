let count = 0, mseconds = 0, seconds = 0, minutes = 0, hours = 0;
let clearState;
let clearTime;
let msecs, secs, mins, hrs;

function timing() {
  // increment the timing counter every msec
  mseconds++;
  if (mseconds === 100) {
    mseconds = 0;
    seconds++;
  }
  if (seconds === 60) {
    seconds = 0;
    minutes++;
  }
  if (minutes === 60) {
    minutes = 0;
    hours++;
  }
  // add extra zeros to fill in the significant bits
  msecs = mseconds < 10 ? '0' + mseconds : mseconds;
  // msecs = mseconds < 100 ? '0' + msecs : msecs;
  secs = seconds < 10 ? '0' + seconds : seconds;
  mins = minutes < 10 ? '0' + minutes : minutes;
  hrs = hours < 10 ? '0' + hours : hours;
  $(".timer-main").html(hrs + ":" + mins + ":" + seconds + ".");
  $(".timer-sub").html(msecs);
  setTimeout("timing()", 1);
}
function startTime() {
  this.style.display = "none";
  $('.stop-button').show();
  timing();
}
window.addEventListener("load", function () {
  $(".start-button").bind("click", startTime);
});



