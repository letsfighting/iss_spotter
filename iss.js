const request = require("request");

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function (callback) {
  // use request to fetch IP address from JSON API
  request("https://api.ipify.org?format=json", (error, response, body) => {
    if (error) {
      callback(error, null);
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ip = JSON.parse(body);

    callback(null, ip.ip);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(
    `https://api.freegeoip.app/json/${ip}?apikey=f3c2e7a0-a653-11ec-a0d4-f701b9ff7125`,
    (error, response, body) => {
      if (error) {
        callback(error, null);
      }

      // if non-200 status, assume server error
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
        callback(Error(msg), null);
        return;
      }

      const parsed = JSON.parse(body);
      const coords = {
        latitude: parsed["latitude"],
        longitude: parsed["longitude"],
      };
      callback(null, coords);
    }
  );
};

const fetchISSFlyOverTimes = (coords, callback) => {
  const lat = coords.latitude;
  const long = coords.longitude;

  request(
    `https://iss-pass.herokuapp.com/json/?lat=${lat}&lon=${long}`,
    (error, response, body) => {
      if (error) {
        callback(error, null);
      }

      // if non-200 status, assume server error
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching ISS flyover times. Response: ${body}`;
        callback(Error(msg), null);
        return;
      }

      const parsed = JSON.parse(body);
      callback(null, parsed.response);
    }
  );
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("Could not fetch IP:", error);
      return;
    } else {
      //console.log("It worked! Returned IP:", ip);
      fetchCoordsByIP(ip, (error, coordinates) => {
        if (error) {
          console.log("Coordinates could not be retrieved:", error);
          return;
        }
        //console.log("It worked! Returned coordinates:", coordinates);
        fetchISSFlyOverTimes(coordinates, (error, times) => {
          if (error) {
            console.log("It didn't work!", error);
            return;
          }
          callback(null, times);
        });
      });
    }
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation,
};
