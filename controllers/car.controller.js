const mongoose = require("mongoose");
const Car = require("../models/Car");
const carController = {};

//Create Car API
carController.createCar = async (req, res, next) => {
  try {
    // YOUR CODE HERE

    const { make, model, release_date, transmission_type, size, style, price } =
      req.body;

    if (
      !make ||
      !model ||
      !release_date ||
      !transmission_type ||
      !size ||
      !style ||
      !price
    ) {
      throw new Error("Missing required information");
    }

    const car = await Car.create({
      make,
      model,
      release_date,
      transmission_type,
      size,
      style,
      price,
    });

    // const newCar = new Car(req.body);
    // const savedCar = await newCar.save();

    return res.status(200).send({ message: "Create Car Successfully", car });
  } catch (err) {
    // YOUR CODE HERE
    res.status(400).send({ message: err.message });
  }
};

//Get All Cars API ------------------
carController.getCars = async (req, res, next) => {
  try {
    // YOUR CODE HERE
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit || 10;

    const cars = await Car.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Car.countDocuments({ isDeleted: false });

    return res.status(200).json({
      message: "Get Car List Successfully!",
      data: { cars, page, total: Math.ceil(total / limit) },
    });
  } catch (err) {
    // YOUR CODE HERE
    res.status(400).send({ message: err.message });
  }
};

//Update Cars API ------------------
carController.editCar = async (req, res, next) => {
  try {
    // YOUR CODE HERE
    const { id } = req.params; // params is the id

    if (!mongoose.isValidObjectId(id)) throw new Error("Invalid ID");

    const car = await Car.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!car) throw new Error("Car not found!");
    return res.status(200).send({ message: "Update Car Successfully!", car });
  } catch (err) {
    // YOUR CODE HERE
    res.status(400).send({ message: err.message });
  }
};

//Delete Cars API ------------------
carController.deleteCar = async (req, res, next) => {
  try {
    // YOUR CODE HERE
    const { id } = req.params; // params is the id

    if (!mongoose.isValidObjectId(id)) throw new Error("Invalid ID");

    const car = await Car.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, runValidators: true }
    );
    if (!car) throw new Error("Car not found!");
    return res.status(200).send({ message: "Delete Car Successfully!", car });
  } catch (err) {
    // YOUR CODE HERE
    res.status(400).send({ message: err.message });
  }
};

module.exports = carController;
