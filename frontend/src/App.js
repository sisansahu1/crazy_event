import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/Auth";
import EventsPage from "./pages/Events";
import BookingsPage from "./pages/Bookings";
import MainNavigation from "./components/Navigation/MainNavigation";
import {connect} from 'react-redux';

class App extends React.Component {
  state = {
    tokenid: null,
    userId: null,
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {this.props.token && <Redirect from="/" to="/events" exact />}
                {this.props.token && (
                  <Redirect from="/auth" to="/events" exact />
                )}
                {!this.props.token && (
                  <Route path="/auth" component={AuthPage} />
                )}
                <Route path="/events" component={EventsPage} />
                {this.props.token && (
                  <Route path="/bookings" component={BookingsPage} />
                )}
                 {!this.props.token && <Redirect to="/auth" exact />}
              </Switch>
            </main>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.tokenid,
  };
};
export default connect(mapStateToProps)(App);
