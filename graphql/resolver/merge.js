const Event = require('../../models/event');
const User = require('../../models/users');
const {dateToString}= require('../../helpers/date');



const eventsById = (eventId) => {
    return Event.find({ _id: { $in: eventId } })
      .then((events) => {
        return events.map((event) => {
          return transformEvents(event);
        });
      })
      .catch((err) => {
        throw err;
      });
  };
  
  
  const singleEvent = async (eventId) => {
    try {
      const event = await Event.findById(eventId);
      return transformEvents(event);
    } catch (err) {
      throw err;
    }
  };
  
  const user = (userId) => {
    return User.findById(userId)
      .then((user) => {
        return {
          ...user._doc,
          password: null,
          _id: user.id,
          createdEvents: eventsById.bind(this, user._doc.createdEvents),
        };
      })
      .catch((err) => {
        throw err;
      });
  };

  const transformBookings = (booking) => {
    return {
      ...booking._doc,
      _id: booking.id,
      user: user.bind(this, booking._doc.user),
      event: singleEvent.bind(this, booking._doc.event),
      createdAt: dateToString(booking._doc.createdAt),
      updatedAt: dateToString(booking._doc.updatedAt),
    };
  };
  const transformEvents = (event)=>{
    return{
      ...event._doc,
      _id: event.id,
      date: dateToString(event._doc.date),
      creator: user.bind(this, event.creator),
    };}
  

exports.transformBookings=transformBookings;
exports.transformEvents=transformEvents;
//   exports.user=user;
//   //exports.eventsById=eventsById;
//   exports.singleEvent=singleEvent;