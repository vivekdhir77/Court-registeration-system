const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    id: String,
    email1: String,
    email2: String,
    email3: String,
    email4: String,
    duration:Number,
    starthours:Number,
    endhours:Number,
    sport:String,
    date: Date
});

const Booking = mongoose.model("Booking",BookingSchema);

module.exports.Booking = Booking;