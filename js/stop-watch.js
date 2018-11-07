let mseconds = 0, seconds = 0, minutes = 0, hours = 0;
let msecs = 0, secs = 0, mins = 0, hrs = 0;
let stopFlag;
let startDate, endDate;
let currTime;
let resetFlag = false;
let entryCntr = 0;
let startLongtitude = " ", startLatitude = " ", endLongtitude = " "; endLatitude = " ";
let ongoingTiming = false;
let timingInterval;

/* Entry class that is to be put in the localStorage, represents each entry/row of the table */
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

/* config class that is to be inserted in to localStorage[0], represents the start date and location of
   the current activity */
class Config {
  constructor(startDate, startLongtitude, startLatitude) {
    this.startDate = startDate;
    this.startLongtitude = startLongtitude;
    this.startLatitude = startLatitude;
  }
}

/* timing() increments the time every 1 milliseconds, updates the config in localStorage[0] and
  display the current time */
function timing() {

  // if the stop button is hit - clear the timing activity and return.
  if (stopFlag) {
    clearInterval(timingInterval);
    return;
  }

  // increment the timing counter every msec()
  currTime = Date.now() - new Date(startDate);
  endDate = new Date(Date.now());
  mseconds = currTime % 1000;
  currTime = Math.floor(currTime / 1000);
  seconds = currTime % 60;
  currTime = Math.floor(currTime / 60);
  minutes = currTime % 60;
  currTime = Math.floor(currTime / 60);
  hours = currTime;

  // add extra zeros to fill in the significant bits for display
  msecs = mseconds < 10 ? '0' + mseconds : mseconds;
  msecs = mseconds < 100 ? '0' + msecs : msecs;
  secs = seconds < 10 ? '0' + seconds : seconds;
  mins = minutes < 10 ? '0' + minutes : minutes;
  hrs = hours < 10 ? '0' + hours : hours;
  $(".timer-main").html(hrs + ":" + mins + ":" + secs);
  $(".timer-sub").html("." + msecs);

  // store the current configuration into localStorage[0]. This allows the following:
  // when the browser is closed while the timer is still executing, the timer continues
  // to time while the browser is closed andrestore the last ongoing timing activity.
  localStorage.setItem(0, JSON.stringify(new Config(startDate, startLongtitude, startLatitude)));
}
function startTiming() {

  // the stopFlag is false as the timer starts
  stopFlag = false;

  // hide the start button, show the stop button
  $('.start-button').hide(); // the code is in jQuery, but in standard JavaScript, it can simply be: document.getElementsByClass('start-button').style.display = "none";
  $('.stop-button').show();  // JavaScript: document.getElementsByClass('start-button').style.display = "block";

  // only if there isn't an ongoingTiming from last time, otherwise we keep the original startTime as we are picking up from there
  if (!ongoingTiming) {
    //record the start time
    let startTime = Date.now();

    // record startDate
    startDate = new Date(startTime);

    // store the entry into the localStorage
    localStorage.setItem(entryCntr + 1, JSON.stringify(new Entry(startDate, startLongtitude, startLatitude, " ", " ", " ", " ")));
  }

  // insert the start entry into the table
  // leave the endDate, endLatitude, endLongtitude and time Elapsed blank until stop button is hit
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

  // trigger timing() every millisecond
  timingInterval = setInterval("timing()", 1);

  // if there is an ongoingTiming activity from the last time the browser is open, set it false
  if (ongoingTiming) {
    ongoingTiming = false;
  }
}
function stopTime() {
  // set the stopFlag to be true so that timing() can exist
  stopFlag = true;

  // hide the stop-button, show the start-button
  $(".stop-button").hide();
  $(".start-button").show();

  // insert the time elapsed into the previously inserted entry
  $("#" + entryCntr + "-endDate").html(endDate);
  $("#" + entryCntr + "-lon").html(endLongtitude);
  $("#" + entryCntr + "-lat").html(endLatitude);
  $("#" + entryCntr + "-timeElapsed").html(hrs + ":" + mins + ":" + secs + "." + msecs);

  // store the new entry into localStorage[entryCntr] so that we can recover the history
  localStorage.setItem(entryCntr, JSON.stringify(new Entry(startDate, startLongtitude, startLatitude, endDate, endLongtitude, endLatitude, hrs + ":" + mins + ":" + secs + "." + msecs)));
}

/* resetTime() clears the current display, the localStorage, and the table */
function resetTime() {
  // set the current time to be 00:00:00.000
  msecondes = 0;
  seconds = 0;
  minutes = 0;
  hours = 0;
  days = 0;
  entryCntr = 0;

  // reset stops the timer, so keep stopFlag true
  stopFlag = true;

  //  clear the localStorage
  localStorage.clear();

  // hide the stop-button, show the start-button
  $(".stop-button").hide();
  $(".start-button").show();

  // clear the table
  $('.table-body').html("");

  // reset the display into 00:00:00.000
  $('.timer-main').html("00:00:00");
  $('.timer-sub').html(".00");
}

/* record_position is a callback function that is called when the location is changed */
function record_position(latitude, longtitude) {
  startLatitude = latitude.toPrecision(6);
  startLongtitude = longtitude.toPrecision(6);
  endLatitude = latitude.toPrecision(6);
  endLongtitude = longtitude.toPrecision(6);
}

window.addEventListener("load", function () {
  // the entryCntr starts from 1
  entryCntr = 1;

  // restore the history
  while (entryCntr < localStorage.length) {
    let currItem = JSON.parse(localStorage[entryCntr]);

    // if the currItem is the last ongoingTiming event with no endDate, we load the config at localStorage[0]
    if (currItem.endDate === " ") {
      let config = JSON.parse(localStorage[0]);
      startDate = new Date(config.startDate);
      startLatitude = config.startLatitude;
      startLongtitude = config.startLongtitude;
      ongoingTiming = true;
    }
    else {
      // display the entry on the table
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

  // decrement the entryCntr so that it remains as the index number of the last entered entry
  entryCntr--;

  // each button triggers their corresponding function
  $(".start-button").bind("click", startTiming);
  $(".stop-button").bind("click", stopTime);
  $(".reset-button").bind("click", resetTime);

  // setup a geolocation watcher so that it will record the change of the locations
  watchID = navigator.geolocation.watchPosition(function (position) {
    record_position(position.coords.latitude, position.coords.longitude);
  });

  // if there is ongoingTiming last time, we need to further decrease the entryCntr and startTiming to continue
  if (ongoingTiming) {
    entryCntr--;
    startTiming();
  }

});



