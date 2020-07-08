import React from "react";
import "./eventlist.css";
import { connect } from "react-redux";
import Modal from '../Modal/Modal'
import Backdrop from '../Backdrop/Backdrop';
const EventList = (props) => {

    const bookEventHandler=()=>{
       
        const requestBody = {
            query: `
            mutation{
                bookEvent(eventId:"${props.eventIdDisplay._id}"){
                  event{
                      title
                  }
                 
                }
                }`,
          };
      
          const tokenid = props.token;
      
          fetch("https://event-booking-react1.herokuapp.com/graphql",{
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + tokenid,
            },
          })
            .then((res) => {
              if (res.status !== 200 && res.status !== 201) {
                throw new Error("Failed");
              }
              return res.json();
            })
            .then((resData) => {    
              props.onCancelDetails(false);
              console.log('Booking mut',resData);
            })
            .catch((err) => {
              console.log(err);
            });
        };
  const showEvent = props.events.map((event, index) => {
    return (
      <li key={index} className="events_list-item">
        <div>
          <h1>{event.title}</h1>

          <h2>
            ${event.price}- {new Date(event.date).toLocaleDateString()}
          </h2>
        </div>
        <div>
          {props.userid === event.creator._id ? (
            <p>You are owner of the event.</p>
          ) : (
            <button className="btn" onClick={props.onDetails.bind(this,event)}>
              View Details
            </button>
          )}
        </div>
      </li>
    );
  });

  return (
    <React.Fragment>
        {props.viewData && <Backdrop />}
      {props.viewData && (
        <Modal
          title="View Details"
          canCancel
          canConfirm
          onCancel={props.onCancelDetails}
          onConfirm={props.token ? bookEventHandler:
        props.onCancelDetails}
          contextLabel={"Book"}
        >
            <h1>{props.eventIdDisplay.title}</h1>
            <h2>
            ${props.eventIdDisplay.price}- {new Date(props.eventIdDisplay.date).toLocaleDateString()}
          </h2>
      <p>{props.eventIdDisplay.description}</p>
        </Modal>
      )}
      <ul className="events_list">{showEvent}</ul>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    events: state.events,
    userid: state.userid,
    viewData:state.viewDetail,
    eventIdDisplay:state.eventIdToDisplay,
    token:state.tokenid,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onDetails: (eventid) =>
      dispatch({
        type: "VIEW_EVENTS",
        payload: {
          detail: true,
          eventIdToDisplay:eventid,
        },
      }),
      onCancelDetails: (val) =>
  dispatch({
    type: "VIEW_EVENTS",
    payload: {
      detail: false,
    },
  }),
  };

  
  
};

export default connect(mapStateToProps, mapDispatchToProps)(EventList);
