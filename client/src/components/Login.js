import { Button } from "@material-ui/core";
import { auth, provider } from "../firebase";
import React from "react";
import "./Login.css";
import { useStateValue } from "../StateProvider";
import { actionTypes } from "../Reducer";

function Login() {
  const [{ user }, dispatch] = useStateValue();

  const signIn = () => {
    auth.signInWithPopup(provider).then((result) => {
      dispatch({
        type: actionTypes.SET_USER,
        user: result.user,
      });
    });
  };

  return (
    <div className="login">
      <div className="login_container">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/150px-WhatsApp.svg.png"
          alt=""
        />
        <div className="login_text">
          <h1>Sign in to Whatsapp</h1>
        </div>
        <Button type="submit" onClick={signIn}>
          Sign In With Google
        </Button>
      </div>
    </div>
  );
}

export default Login;
