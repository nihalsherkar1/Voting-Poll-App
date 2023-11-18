const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");
const app = express();
const dataFile = path.join(__dirname, "data.json");

//* Support Posting form data with URL encoded
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.get("/poll", async (req, res) => {
  //* Here data Read the data from dataFile and parse in JSON format
  let data = JSON.parse(await fs.readFile(dataFile, "utf-8"));

  const totalVotes = Object.values(data).reduce((total, n) => (total += n), 0);

  data = Object.entries(data).map(([label, votes]) => {
    return {
      label,
      percentage: ((100 * votes) / totalVotes || 0).toFixed(0),
    };
  });

  //   console.log(totalVotes);
  res.json(data);
});

app.post("/poll", async (req, res) => {
  const data = JSON.parse(await fs.readFile(dataFile, "utf-8"));
  data[req.body.add]++;
  await fs.writeFile(dataFile, JSON.stringify(data));
  res.end();
});

// Listen the server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
