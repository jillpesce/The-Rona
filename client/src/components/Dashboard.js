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

  // routeChangeCorona = () => {
  //   let path = "http://localhost:3000/coronavirus";
  //   let history = useHistory();
  //   history.push(path);
  // };

  render() {
    return (
      <div>
        <PageNavbar active="dashboard" />
        <h3>hello we in dashboarT</h3>
        <div className="dashboard-container">
          <CardDeck>
            <Card className="text-center">
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
            <Card className="text-center">
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
            <Card className="text-center">
              <Card.Header>National Causes</Card.Header>
              <Card.Body>
                <Card.Title>Special title treatment</Card.Title>
                <Card.Text>
                  With supporting text below as a natural lead-in to additional
                  content.
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
            <Card className="text-center">
              <Card.Header>Global Causes</Card.Header>
              <Card.Body>
                <Card.Title>Special title treatment</Card.Title>
                <Card.Text>
                  With supporting text below as a natural lead-in to additional
                  content.
                </Card.Text>
                <Button variant="outline-primary">
                  <Link to={"/GlobalCauses"}>See page</Link>
                </Button>
              </Card.Body>
            </Card>
            <Card className="text-center">
              <Card.Header>Life Expectancy Calculator</Card.Header>
              <Card.Body>
                <Card.Title>Special title treatment</Card.Title>
                <Card.Text>
                  With supporting text below as a natural lead-in to additional
                  content.
                </Card.Text>
                <Button variant="outline-primary">
                  <Link to={"/GlobalCauses"}>See page</Link>
                </Button>
              </Card.Body>
            </Card>
          </CardDeck>
        </div>
      </div>
    );
  }
}
