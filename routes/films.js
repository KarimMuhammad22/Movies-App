const { Film, validate } = require("../models/film");
const { Genre } = require("../models/genre");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const films = await Film.find().sort("name");
  res.send(films);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  let film = new Film({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });
  film = await film.save();

  res.send(film);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const film = await Film.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    },
    { new: true }
  );

  if (!film)
    return res.status(404).send("The film with the given ID was not found.");

  res.send(film);
});

router.delete("/:id", async (req, res) => {
  const film = await Film.findByIdAndRemove(req.params.id);

  if (!film)
    return res.status(404).send("The film with the given ID was not found.");

  res.send(film);
});

router.get("/:id", async (req, res) => {
  const film = await Film.findById(req.params.id);

  if (!film)
    return res.status(404).send("The film with the given ID was not found.");

  res.send(film);
});

module.exports = router;
