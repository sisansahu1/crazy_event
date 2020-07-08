import React from "react";
import "./Auth.css";
import { connect } from "react-redux";


class AuthPage extends React.Component {
  state = {
    isLogin: true,
    token:null,
    userid:null,
  };



  constructor(props) {
    super(props);

    this.emailVl = React.createRef();
    this.passwordVl = React.createRef();
  }


  submitHandler = (event) => {
  
    event.preventDefault();
    const email = this.emailVl.current.value;
    const password = this.passwordVl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return alert("Email/Password is empty.");
    }

    let requestBody = {
      query: `
            query{
                login(email:"${email}",password:"${password}"){
                    userId
                    tokenid
                    tokenExpiration
                }
            }
            `,
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
            mutation{
                createUser(userInput:{email:"${email}",password:"${password}"}) {
                  _id
                    email
                }
            }`,
      };
    }
    fetch("https://event-booking-react1.herokuapp.com/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log(res.status);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.data.login.tokenid) {
          this.setState({token:resData.data.login.tokenid,userid:resData.data.login.userId});
          this.props.OnLogin(this.state.token,this.state.userid);      
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  
  switchHandler = () => {
    this.setState((prevState) => {
      return { isLogin: !prevState.isLogin };
    });
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label>Email</label>
          <input type="email" ref={this.emailVl}></input>
        </div>
        <div className="form-control">
          <label>Password</label>
          <input type="password" ref={this.passwordVl}></input>
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.switchHandler}>
            Switch to {this.state.isLogin ? "Sign Up" : "Log in"}
          </button>
            </div>
      </form>
    );
  }
}






const mapDisapatchToProps = dispatch => {
  return {
    OnLogin: (token,userid) => dispatch({ type: 'SET_TOKEN',payload:{
      token:token,
      userid:userid
    }}),
  };
};
export default connect(null,mapDisapatchToProps)(AuthPage);
