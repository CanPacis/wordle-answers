const express = require("express");
const tr_list = require("./tr_list.json");
require("dotenv").config();
const en_list = require("./en_list.json");

const app = express();
const port = process.env.PORT;

class Wordle {
  constructor(list) {
    this.list = list;
  }

  findByDate(date) {
    let entries = Object.entries(this.list);
    entries = entries.map((entry) => {
      let key = entry[0];
      let split = key.split(" ");
      split.shift();
      entry[0] = split.join(" ");
      return entry;
    });

    let result = entries.find((entry) => entry[0] === date.toDateString());
    if (result) {
      return result[1];
    } else {
      return undefined;
    }
  }

  today() {
    return this.findByDate(new Date());
  }
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

const languages = {
  tr: new Wordle(tr_list),
  en: new Wordle(en_list),
};

for (const [key, wordle] of Object.entries(languages)) {
  let router = express.Router();
  app.use(`/${key}`, router);

  router.get("/", (req, res) => {
    res.json({ solution: wordle.today() });
  });

  router.get("/today", (req, res) => {
    res.json({ solution: wordle.today() });
  });

  router.get("/:date", (req, res) => {
    let date = new Date(parseInt(req.params.date));

    if (isValidDate(date)) {
      res.json({ solution: wordle.findByDate(date) });
    } else {
      res.status(400);
      res.json({ error: "invalid date" });
    }
    res.end();
  });
}

app.listen(port, () => console.log(`Server is running on port ${port}...`));
