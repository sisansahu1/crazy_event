const Booking = require("../../models/booking");
const Event = require('../../models/event');
const { dateToString } = require("../../helpers/date");
const { transformEvents,transformBookings } = require("./merge");



module.exports = {
  bookings: async (args,req) => {
    if(!req.isAuth){
        throw new Error('Unauthorized!');
    }

    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBookings(booking);
      });
    } catch (err) {
      throw err;
    }
  },

  //Booking

  bookEvent: async (args,req) => {
    if(!req.isAuth){
        throw new Error('Unauthorized!');
    }
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent,
    });
    const result = await booking.save();
    return transformBookings(result);
  },

  //Cancel Booking 

  cancelBooking: async (args,req) => {
    if(!req.isAuth){
        throw new Error('Unauthorized!');
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transformEvents(booking.event);
      console.log(event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
