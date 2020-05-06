import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import CoronaVirus from "./CoronaVirus";
import GlobalCauses from "./GlobalCauses";
import NationalCauses from "./NationalCauses";
import "../style/PageNavbar.css";

export default class PageNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navDivs: [],
    };
  }

  componentDidMount() {
    const pageList = [
      "dashboard",
      "coronavirus",
      "GlobalCauses",
      "NationalCauses",
      "timeline",
      "LifeExpCalc",
    ];

    let navbarDivs = pageList.map((page, i) => {
      if (this.props.active === page) {
        return (
          <a className="nav-item nav-link active" key={i} href={"/" + page}>
            {page.charAt(0).toUpperCase() + page.substring(1, page.length)}
          </a>
        );
      } else {
        return (
          <a className="nav-item nav-link" key={i} href={"/" + page}>
            {page.charAt(0).toUpperCase() + page.substring(1, page.length)}
          </a>
        );
      }
    });

    this.setState({
      navDivs: navbarDivs,
    });
  }

  render() {
    return (
      <div className="PageNavbar">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <span className="navbar-brand center">
            The Rona and Other Causes of Death
          </span>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              {/*this.state.navDivs*/}
              <Link className="header-link" to={"/dashboard"}>
                Dashboard
              </Link>
              <Link className="header-link" to={"/coronavirus"}>
                Coronavirus
              </Link>
              <Link className="header-link" to={"/timeline"}>
                Timeline
              </Link>
              <Link className="header-link" to={"/NationalCauses"}>
                National Causes
              </Link>
              <Link className="header-link" to={"/GlobalCauses"}>
                Global Causes
              </Link>
              <Link className="header-link" to={"/Correlation"}>
                Population vs. Cause of Death
              </Link>
              <Link className="header-link" to={"/LifeExpCalc"}>
                Life Expectancy Calculator
              </Link>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
