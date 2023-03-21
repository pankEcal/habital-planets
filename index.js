const { parse } = require("csv-parse");
const fs = require("fs");

// array to store the final values
const habitablePlanets = [];

// determine habitable planet based on criterias:
// 1. koi_disposition: 'CONFIRMED' (is confirmed to be existing)
// 2. koi_insol > 0.36 && koi_insol < 1.11 (defines that the light and heat is suitable enough like in earth)
// 3. koi_prad < 1.6  upper of limit of size of the planet as compared to earth

const isHabitablePlanet = (planet) => {
  const isHabitable =
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6;

  return isHabitable;
};

// create stream based on the type of event. In this case, data
// chaining event handlers
fs.createReadStream("./kepler_data.csv")
  // piping data to parse. i.e getting readable data and process it and make it writeable as meaningful data
  .pipe(
    parse({
      comment: "#", // to indicate comments. (line starting with a '#')
      columns: true, // to get each csv field as a seprate line
    })
  )
  // processing the received data as a column
  .on("data", (planet) => {
    // the data received are buffers only and may not have any particular usage.
    // The buffer has to be parsed in order to get meaningful data

    if (isHabitablePlanet(planet)) {
      habitablePlanets.push(planet);
    }
  })
  .on("error", (error) => {
    console.log("some error occured!!");
    console.log(error);
  })
  .on("end", () => {
    console.log("finished processing data");
    console.log(habitablePlanets[2]);
    console.log("habitable planets: ", habitablePlanets.length);
  });
