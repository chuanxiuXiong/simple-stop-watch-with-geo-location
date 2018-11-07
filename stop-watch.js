let days = 0, mseconds = 0, seconds = 0, minutes = 0, hours = 0;
let msecs = 0, secs = 0, mins = 0, hrs = 0;
let stopFlag;
let startDate, endDate;
let currTime;
let resetFlag = false;
let entryCntr = 0;
let startLongtitude = " ", startLatitude = " ", endLongtitude = " "; endLatitude = " ";
let ongoingTiming = false;
let timingInterval;
class Entry {
  constructor(startDate, startLongtitude, startLatitude, endDate, endLongtitude, endLatitude, timeElapsed) {
    this.startDate = startDate;
    this.startLongtitude = startLongtitude;
    this.startLatitude = startLatitude;
    this.endDate = endDate;
    this.endLongtitude = endLongtitude;
    this.endLatitude = endLatitude;
    this.timeElapsed = timeElapsed;
  }
}
class Config {
  constructor(startDate, startLongtitude, startLatitude) {
    this.startDate = startDate;
    this.startLongtitude = startLongtitude;
    this.startLatitude = startLatitude;
  }
}
function timing() {
  if (stopFlag) {
    clearInterval(timingInterval);
    return;
  }
  // increment the timing counter every msec()
  console.log("actual: " + startDate);
  currTime = Date.now() - new Date(startDate);
  endDate = new Date(Date.now());
  mseconds = currTime % 1000;
  currTime = Math.floor(currTime / 1000);
  seconds = currTime % 60;
  currTime = Math.floor(currTime / 60);
  minutes = currTime % 60;
  currTime = Math.floor(currTime / 60);
  hours = currTime % 24;
  currTime = Math.floor(currTime / 24);
  days = currTime;

  // add extra zeros to fill in the significant bits
  msecs = mseconds < 10 ? '0' + mseconds : mseconds;
  msecs = mseconds < 100 ? '0' + msecs : msecs;
  secs = seconds < 10 ? '0' + seconds : seconds;
  mins = minutes < 10 ? '0' + minutes : minutes;
  hrs = hours < 10 ? '0' + hours : hours;
  $(".timer-main").html(hrs + ":" + mins + ":" + secs);
  $(".timer-sub").html("." + msecs);

  localStorage.setItem(0, JSON.stringify(new Config(startDate, startLongtitude, startLatitude)));

}
function startTiming() {
  stopFlag = false;
  $('.start-button').hide();
  $('.stop-button').show();
  if (!ongoingTiming) {
    let startTime = Date.now();
    // record startDate
    startDate = new Date(startTime);
    localStorage.setItem(entryCntr + 1, JSON.stringify(new Entry(startDate, startLongtitude, startLatitude, " ", " ", " ", " ")));
  }
  // insert the start entry into the table
  let entry = "<tr>";
  entry += "<td>" + ++entryCntr + "</td>";
  entry += "<td>" + startDate + "</td>";
  entry += "<td>" + startLongtitude + "</td>";
  entry += "<td>" + startLatitude + "</td>"
  entry += "<td id='" + entryCntr + "-endDate'></td>";
  entry += "<td id='" + entryCntr + "-lon'></td>";
  entry += "<td id='" + entryCntr + "-lat'></td>";
  entry += "<td id='" + entryCntr + "-timeElapsed'></td>";
  entry += "</tr>";
  $(entry).appendTo('.table-body');
  timingInterval = setInterval("timing()", 1);
  if (ongoingTiming) {
    ongoingTiming = false;
  }
}
function stopTime() {
  stopFlag = true;
  $(".stop-button").hide();
  $(".start-button").show();
  // insert the time elapsed into the previously inserted entry
  $("#" + entryCntr + "-endDate").html(endDate);
  $("#" + entryCntr + "-lon").html(endLongtitude);
  $("#" + entryCntr + "-lat").html(endLatitude);
  $("#" + entryCntr + "-timeElapsed").html(hrs + ":" + mins + ":" + secs + "." + msecs);
  localStorage.setItem(entryCntr, JSON.stringify(new Entry(startDate, startLongtitude, startLatitude, endDate, endLongtitude, endLatitude, hrs + ":" + mins + ":" + secs + "." + msecs)));
}
function resetTime() {
  msecondes = 0;
  seconds = 0;
  minutes = 0;
  hours = 0;
  days = 0;
  entryCntr = 0;
  stopFlag = true;
  localStorage.clear();
  $(".stop-button").hide();
  $(".start-button").show();
  $('.table-body').html("");
  $('.timer-main').html("00:00:00");
  $('.timer-sub').html(".00");
}

function record_position(latitude, longtitude) {
  startLatitude = latitude.toPrecision(6);
  startLongtitude = longtitude.toPrecision(6);
  endLatitude = latitude.toPrecision(6);
  endLongtitude = longtitude.toPrecision(6);
}

window.addEventListener("load", function () {


  entryCntr = 1;
  while (entryCntr < localStorage.length) {
    let currItem = JSON.parse(localStorage[entryCntr]);
    if (currItem.endDate === " ") {
      let config = JSON.parse(localStorage[0]);
      startDate = new Date(config.startDate);
      console.log("startDate: " + startDate);
      startLatitude = config.startLatitude;
      startLongtitude = config.startLongtitude;
      console.log("latLong: " + startLatitude + startLongtitude);
      ongoingTiming = true;
    }
    else {
      let entry = '<tr>';
      entry += "<td>" + entryCntr + "</td>";
      entry += "<td>" + new Date(currItem.startDate) + "</td>";
      entry += "<td>" + currItem.startLongtitude + "</td>";
      entry += "<td>" + currItem.endLatitude + "</td>";
      entry += "<td id='" + entryCntr + "-endDate'>" + new Date(currItem.endDate) + "</td>";
      entry += "<td id='" + entryCntr + "-lon'>" + currItem.endLongtitude + "</td>";
      entry += "<td id='" + entryCntr + "-lat'>" + currItem.endLatitude + "</td>";
      entry += "<td id='" + entryCntr + "-timeElapsed'>" + currItem.timeElapsed + "</td>";
      entry += "</tr>";
      $(entry).appendTo('.table-body');
    }
    ++entryCntr;
  }
  entryCntr--;
  $(".start-button").bind("click", startTiming);
  $(".stop-button").bind("click", stopTime);
  $(".reset-button").bind("click", resetTime);
  watchID = navigator.geolocation.watchPosition(function (position) {
    print("recording position");
    record_position(position.coords.latitude, position.coords.longitude);
  });
  if (ongoingTiming) {
    entryCntr--;
    startTiming();
  }

});



