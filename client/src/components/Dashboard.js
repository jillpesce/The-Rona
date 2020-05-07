import React from "react";
import "../style/Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PageNavbar from "./PageNavbar";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import { Link } from "react-router-dom";

export default class Dashboard extends React.Component {
  constructor(props) {
    // this.routeChangeCorona = this.routeChangeCorona.bind(this);
    super(props);
  }

  render() {
    return (
      <div>
        <PageNavbar active="dashboard" />
        <br></br>
        <div className="dashboard-container">
          <h1>Welcome!</h1>
          <br></br>
          <CardDeck>
            <Card className="text-center" border="primary">
              <Card.Header>Coronavirus</Card.Header>
              <Card.Body>
                <Card.Text>
                  Check out this page to see up-to-date Coronavirus statistics.
                  Filter by country to see how different parts of the world are
                  handling the pandemic.
                </Card.Text>
                <Button variant="outline-primary">
                  <Link to={"/coronavirus"}>See page</Link>
                </Button>
              </Card.Body>
            </Card>
            <Card className="text-center" border="danger">
              <Card.Header>Timeline</Card.Header>
              <Card.Body>
                <Card.Text>
                  View and compare various causes of death and their impact on
                  countries over time.
                </Card.Text>
                <Button variant="outline-primary">
                  <Link to={"/timeline"}>See page</Link>
                </Button>
              </Card.Body>
            </Card>
            <Card className="text-center" border="success">
              <Card.Header>National Causes</Card.Header>
              <Card.Body>
                <Card.Text>
                  See how the leading causes of death have changed in the United
                  States from 1999.
                </Card.Text>
                <Button variant="outline-primary">
                  <Link to={"/NationalCauses"}>See page</Link>
                </Button>
              </Card.Body>
            </Card>
          </CardDeck>
        </div>
        <div className="dashboard-container">
          <CardDeck>
            <Card className="text-center" border="info">
              <Card.Header>Global Causes</Card.Header>
              <Card.Body>
                <Card.Text>
                  See how the leading causes of death have changed globally from
                  1990.
                </Card.Text>
                <Button variant="outline-primary">
                  <Link to={"/GlobalCauses"}>See page</Link>
                </Button>
              </Card.Body>
            </Card>
            <Card className="text-center" border="warning">
              <Card.Header>Population vs. Cause of Death</Card.Header>
              <Card.Body>
                <Card.Text>
                  Compare population changes and causes of death for specific
                  countries.
                </Card.Text>
                <Button variant="outline-primary">
                  <Link to={"/LifeExpCalc"}>See page</Link>
                </Button>
              </Card.Body>
            </Card>
            <Card className="text-center" border="primary">
              <Card.Header>Life Expectancy Calculator</Card.Header>
              <Card.Body>
                <Card.Text>
                  See how life expectancy has changed over the course of the las
                  century.
                </Card.Text>
                <Button variant="outline-primary">
                  <Link to={"/LifeExpCalc"}>See page</Link>
                </Button>
              </Card.Body>
            </Card>
          </CardDeck>
        </div>
      </div>
    );
  }
}
