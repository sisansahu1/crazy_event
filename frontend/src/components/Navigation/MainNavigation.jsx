import React from "react";
import { NavLink } from "react-router-dom";
import "./MainNavigation.css";
import {connect} from 'react-redux';


const mainNavigation = (props) => {
      return (
        <header className="main-navigation">
          <div className="main-navigation_logo">
            <h1 className="main-title">CrazyEvent</h1>
          </div>
          <nav className="main-navigation_items">
            <ul>
              {!props.tokenid  && (
                <li>
                  <NavLink to="/auth">Authentication </NavLink>
                </li>
              )}
              <li>
                <NavLink to="/events">Events </NavLink>
              </li>
              {props.tokenid && (
                <React.Fragment>
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                  <li>
                    <button onClick={props.OnLogout}>Logout</button>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </nav>
        </header>
      );
    }


    const mapStateToProps = (state) => {
      return {
        tokenid: state.tokenid,
      };
    };
    const mapDisapatchToProps = dispatch => {
      return {
        OnLogout: () => dispatch({ type: 'LOGOUT',
        }),
      };
    };
    
    export default connect(mapStateToProps,mapDisapatchToProps)(mainNavigation);
