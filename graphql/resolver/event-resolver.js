const Event = require('../../models/event');
const User = require('../../models/users');
const {dateToString}= require('../../helpers/date');
const { transformEvents} = require('./merge')


module.exports = {
    events: () => {
      return Event.find()
        .then((events) => {
          return events.map((event) => {
            return transformEvents(event)
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    createEvent: (args,req) => {
        if(!req.isAuth){
            throw new Error('Unauthorized!');
        }
      
        const event = new Event({
        title: args.eventsInput.title,
        description: args.eventsInput.description,
        price: +args.eventsInput.price,
        date: dateToString(args.eventsInput.date),
        creator: req.userId,
      });
      let createdEvent;
      return event
        .save()
        .then((result) => {
          createdEvent = transformEvents(result) //This creates varible
          return User.findById(req.userId);
        })
        .then((user) => {
          if (!user) {
            throw new Error("User does not exists");
          }
        
          user.createdEvents.push(event);
          return user.save();
        })
        .then((result) => {
          return createdEvent;
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    },

  
    
    
 
  
  };
  