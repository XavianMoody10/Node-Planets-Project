const { parse } = require("csv-parse");
const fs = require("fs");

const habitablePlanets = [];

// Filter if planet is habitable
const isHabaitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

fs.createReadStream("kepler_data.csv")
  .pipe(
    parse({
      // ignore lines that has the '#' (those are comments and information about the data)
      comment: "#",
      // Convert data to json
      columns: true,
    })
  )
  // push data to array
  .on("data", (data) => {
    if (isHabaitablePlanet(data)) {
      habitablePlanets.push(data);
    }
  })
  // any error that accure during stream
  .on("error", (error) => {
    console.log(error);
  })
  // What happens when stream ends
  .on("end", () => {
    console.log(
      habitablePlanets.map((planet) => {
        return planet["kepler_name"];
      })
    );
    console.log(`${habitablePlanets.length} habitable planets found!`);
  });
