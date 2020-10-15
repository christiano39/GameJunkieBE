const router = require("express").Router();
const axios = require("axios");

router.get("/", (req, res) => {
  axios
    .get("https://api.rawg.io/api/games", {
      headers: {
        "User-Agent": "GameJunkie",
      },
    })
    .then((response) => {
      res.status(200).json({ games: response.data });
    })
    .catch((err) => {
      res.status(500).json({ error: err.response });
    });
});

module.exports = router;
