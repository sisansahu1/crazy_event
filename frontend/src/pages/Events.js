import React from "react";
import "./Events.css";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import { connect } from "react-redux";
import EventList from '../components/EventList/eventlist'
import Spinner from '../components/Spinner/Spinner';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


class EventsPage extends React.Component {
  state = {
    creating: false,
    isLoading:false,
    viewModal:false,
   
  };
  constructor(props) {
    
    super(props);
    this.titleVl = React.createRef();
    this.priceVl = React.createRef();
    this.descriptionVl = React.createRef();
    this.dateVl = React.createRef();
  
  };
 UNSAFE_componentWillMount(){
   this.fetchEvents();
 }

  fetchEvents() {
    this.setState({isLoading:true})
    const requestBody = {
      query: `
        query{
          events{
            _id
            title
            price
            description
            date
            creator{
              _id
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
      },
    },)
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        const events=resData.data.events;
        this.props.addEvent(events);
        this.setState({isLoading:false})

      })
      .catch((err) => {
        this.setState({isLoading:false})
        console.log( err);
      });
  }

  startCreateHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    
    const title = this.titleVl.current.value;
    const price = +this.priceVl.current.value;
    const date = this.dateVl.current.value;
    const description = this.descriptionVl.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      description.trim().length === 0 ||
      date.trim().length === 0
    ) {
      return;
    }

    const requestBody = {
      query: `
          mutation{
            createEvent(eventsInput:{title:"${title}",description:"${description}",price:${price},date:"${date}"}){
              _id
              title
            }
          }`,
    };

    const tokenid = this.props.token;

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
        this.fetchEvents(resData.events);
        console.log(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false });
    
  };


  
  

  render() {
  

    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add event"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
            contextLabel='Confirm'
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleVl}></input>
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="text" id="price" ref={this.priceVl}></input>
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input
                  type="datetime-local"
                  id="date"
                  ref={this.dateVl}
                ></input>
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  ref={this.descriptionVl}
                ></textarea>
              </div>
            </form>
          </Modal>
        )}
        {this.props.token && (
          <div className="events-control">
            <p>Share your own events!</p>
            <button className="btn" onClick={this.startCreateHandler}>
              Create Event
            </button>
          </div>
        )}
        {
          this.state.isLoading ?<Spinner/>:<EventList/>
        }
      <Snackbar  autoHideDuration={6000} ></Snackbar>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    token:state.tokenid,
  };
};


const mapDispatchToProps=(dispatch)=>{
  return{
      addEvent:(events)=> dispatch({type:'ADD_EVENTS',payload:{
        events:events,
      }}),
      
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(EventsPage);
