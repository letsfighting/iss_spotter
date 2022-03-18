const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require("./iss");

/*
fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  } else {
    console.log("It worked! Returned IP:", ip);
  }
});
*/
// index.js

// The code below is temporary and can be commented out.
/*
fetchCoordsByIP("ssssss", (error, coordinates) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log("It worked! Returned coordinates:", coordinates);
});
*/
/*
fetchISSFlyOverTimes(
  { latitude: "49.27670", longitude: "-123.13000" },
  (error, times) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    } else {
      console.log("It worked! Times:", times);
    }
  }
);
*/

const { nextISSTimesForMyLocation } = require("./iss");

const printPassTimes = function (passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});
