# A Stopwatch Web App with Geolocation

## Table of Contents
- [Introduction](#introduction)
- [Getting Started](#getting-started)


## Introduction

This website implements a stopwatch that records the start time, end time and the geolocation of the users when they hit the button.

It meets the Stretch Goal1 by adding a reset button and a corresponding reset function.

It meets the Stretch Goal2 by 1) recording the time as the current time and its difference to UTC timezone. When displaying, the time will be converted to the local timezone from the original offset. 2) storing the history of the table into a localStorage. Each time we start the application, we display everything from the history. If a browser is closed when the stopwatch is timing, the stopwatch will continue counting when the browser is closed and resume the timing the next timt the browser is opened. This is implemented by the localStorage as well.

## Getting Started

1. Open `stop-watch.html` in the browser (preferrably a Chrome or Firefox). The web app will appear.



