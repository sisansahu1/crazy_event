import React from "react";
import { connect } from "react-redux";
import "./Bookings.css";
import Spinner from "../components/Spinner/Spinner";

class BookingsPage extends React.Component {
  state = {
    bookedEventsList: [],
    isLoading: false,
  };
  UNSAFE_componentWillMount() {
    this.fetchBookings();
  }

  fetchBookings() {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
           query{
            bookings{
              _id
              event{
                title
              }
            }
          }
             `,
    };

    fetch("https://event-booking-react1.herokuapp.com/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        const bookings = resData.data.bookings;
        this.setState({ isLoading: false });
        this.props.addBookings(bookings);
        //  const events=resData.data.events;
        //  this.setState({isLoading:false})
      })
      .catch((err) => {
        //  this.setState({isLoading:false})
        this.setState({ isLoading: false });
        console.log(err);
      });
  }

  deleteBookingHandler = (_id) => {
    console.log(_id);
    const requestBody = {
      query: `
          mutation{
            cancelBooking(bookingId:"${_id}"){
             _id
             title
            }
          }
             `,
    };

    fetch("https://event-booking-react1.herokuapp.com/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        this.fetchBookings();
        // this.props.deleteBooking(resData.data.cancelBooking._id)
        //  const events=resData.data.events;
        //  this.setState({isLoading:false})
      })
      .catch((err) => {
        //  this.setState({isLoading:false})
        console.log(err);
      });
  };

  render() {
    const bookingList = this.props.bookedEvents.map((eventlist, index) => {
      return (
        <li className="bookings_item" key={index}>
          <div>
            <h1 className="event_title">{eventlist.event.title}</h1>
          </div>
          <div>
            <button
              className="btn"
              onClick={this.deleteBookingHandler.bind(this, eventlist._id)}
            >
              Cancel
            </button>
          </div>
        </li>
      );
      
    });
    return (
      <React.Fragment>
        <h1>Booked Events</h1>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <ul className="bookings_list">{bookingList}</ul>
        )}
        {/* /* <BookedList></BookedList> */}
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    token: state.tokenid,
    bookedEvents: state.bookedEvents,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addBookings: (bookedEvents) =>
      dispatch({
        type: "ADD_BOOKINGS",
        payload: {
          bookedEvents: bookedEvents,
        },
      }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(BookingsPage);
