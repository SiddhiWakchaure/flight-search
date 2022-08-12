const express = require("express");
const app = express();

app.use(express.json());

const { MongoClient } = require("mongodb");

// program to convert first letter of a string to uppercase
function capitalizeFirstLetter(str) {
  // converting first letter to uppercase
  const capitalized = str.charAt(0).toUpperCase() + str.slice(1);

  return capitalized;
}

MongoClient.connect(
  "mongodb://127.0.0.1/27017",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error, client) => {
    if (error) {
      return console.log("Unable");
    }

    const db = client.db("FlightDB");

    const port = 3000 || process.env.port;

    app.get("/flights", (req, res) => {
      var { origin, destination } = req.body;
      try {
        origin = origin.toLowerCase();
        destination = destination.toLowerCase();
        db.collection("flight")
          .find({
            origin: capitalizeFirstLetter(origin),
            destination: capitalizeFirstLetter(destination),
          })
          .toArray((error, result) => {
            if (!result || result == []) {
              return res.status(404).send("No such flights available!");
            }
            if (error) {
              res.status(500).send("Something went wrong");
            }

            res.send(result);
          });
      } catch (e) {
        res.status(500).send("Something wend wrong!");
      }
    });

    app.listen(port, () => {
      console.log("Server is up");
    });
  }
);
