import React from "react";
import "../style/SignIn.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PageNavbar from "./PageNavbar";
import Button from "react-bootstrap/Button";
import { Redirect } from "react-router-dom";

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
  }

  handleLogin() {
    window.open("/api/auth/google", "_self");
  }

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <div className="signin-container">
        <div className="signinform">
          <h1>Welcome!</h1>
          <p>
            To view The Coronavirus and Other Causes of Death site, please sign
            in with your Google account.
          </p>
          <h3>
            <div onClick={() => this.handleLogin()}>
              <span class="svgIcon t-popup-svg">
                <Button variant="outline-primary">
                  Sign in with Google
                  <svg
                    class="svgIcon-use"
                    width="25"
                    height="37"
                    viewBox="0 0 25 25"
                  >
                    <path
                      d="M20.66 12.693c0-.603-.054-1.182-.155-1.738H12.5v3.287h4.575a3.91 3.91 0 0 1-1.697 2.566v2.133h2.747c1.608-1.48 2.535-3.65 2.535-6.24z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12.5 21c2.295 0 4.22-.76 5.625-2.06l-2.747-2.132c-.76.51-1.734.81-2.878.81-2.214 0-4.088-1.494-4.756-3.503h-2.84v2.202A8.498 8.498 0 0 0 12.5 21z"
                      fill="#34A853"
                    />
                    <path
                      d="M7.744 14.115c-.17-.51-.267-1.055-.267-1.615s.097-1.105.267-1.615V8.683h-2.84A8.488 8.488 0 0 0 4 12.5c0 1.372.328 2.67.904 3.817l2.84-2.202z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.5 7.38c1.248 0 2.368.43 3.25 1.272l2.437-2.438C16.715 4.842 14.79 4 12.5 4a8.497 8.497 0 0 0-7.596 4.683l2.84 2.202c.668-2.01 2.542-3.504 4.756-3.504z"
                      fill="#EA4335"
                    />
                  </svg>
                </Button>{" "}
              </span>
            </div>
          </h3>
        </div>
      </div>
    );
  }
}
