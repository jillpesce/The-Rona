import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import GenreButton from './GenreButton';
import DashboardMovieRow from './DashboardMovieRow';
import queryString from "query-string";
import PropTypes from 'prop-types';

export default class Dashboard extends React.Component {
  // static propTypes = {
  //   authenticated: PropTypes.bool.isRequired
  // };
  
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of genres,
    // and a list of movies for a specified genre.
    this.state = {
      genres: [],
      movies: []
    }

    this.showMovies = this.showMovies.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/genres",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(genreList => {
      if (!genreList) return;
      // Map each genreObj in genreList to an HTML element:
      // A button which triggers the showMovies function for each genre.
      let genreDivs = genreList.map((genreObj, i) =>
      <GenreButton id={"button-" + genreObj.genre} onClick={() => this.showMovies(genreObj.genre)} genre={genreObj.genre} />
      );

      

      // Set the state of the genres list to the value returned by the HTTP response from the server.
      this.setState({
        genres: genreDivs
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
  }


  /* ---- Q1b (Dashboard) ---- */
  /* Set this.state.movies to a list of <DashboardMovieRow />'s. */
  showMovies(genre) {
    fetch(`http://localhost:8081/genres/'${genre}'`, 
    {
      method: "GET"
    }).then(res => {
      return res.json()
    }, err => {
      console.log(err);
    }).then(topMovies => {
      if (!topMovies) return;
      let movieDivs = topMovies.map((topMovie, i) => 
      <DashboardMovieRow title={topMovie.title} rating={topMovie.rating} votes={topMovie.votes}/>
      );

      this.setState({
        movies: movieDivs
      });
    }, err => {
      console.log(err);
    });
  
  }

  handleLogin() {
    window.open("http://localhost:8081/auth/google", "_self");
  }
  
  render() {    
    return (
      <div className="Dashboard">

        <PageNavbar active="dashboard" />
          <h3> 
            <a  class="button">
              <div onClick={() => this.handleLogin()}>
                <span class="svgIcon t-popup-svg">
                  <svg class="svgIcon-use" width="25" height="37" viewBox="0 0 25 25">
                    <g fill="none" fill-rule="evenodd">
                      <path d="M20.66 12.693c0-.603-.054-1.182-.155-1.738H12.5v3.287h4.575a3.91 3.91 0 0 1-1.697 2.566v2.133h2.747c1.608-1.48 2.535-3.65 2.535-6.24z" fill="#4285F4"/>
                      <path d="M12.5 21c2.295 0 4.22-.76 5.625-2.06l-2.747-2.132c-.76.51-1.734.81-2.878.81-2.214 0-4.088-1.494-4.756-3.503h-2.84v2.202A8.498 8.498 0 0 0 12.5 21z" fill="#34A853"/>
                      <path d="M7.744 14.115c-.17-.51-.267-1.055-.267-1.615s.097-1.105.267-1.615V8.683h-2.84A8.488 8.488 0 0 0 4 12.5c0 1.372.328 2.67.904 3.817l2.84-2.202z" fill="#FBBC05"/>
                      <path d="M12.5 7.38c1.248 0 2.368.43 3.25 1.272l2.437-2.438C16.715 4.842 14.79 4 12.5 4a8.497 8.497 0 0 0-7.596 4.683l2.84 2.202c.668-2.01 2.542-3.504 4.756-3.504z" fill="#EA4335"/>
                    </g>
                  </svg>
                </span>
              <span class="button-label">Sign in with Google</span>
              </div>
            </a> 
          </h3>
        <br></br>
        <div className="container movies-container">
          <div className="jumbotron">
            <div className="h5">Top Movies</div>
            <div className="genres-container">
              {this.state.genres}
            </div>
          </div>

          <br></br>
          <div className="jumbotron">
            <div className="movies-container">
              <div className="movies-header">
                <div className="header-lg"><strong>Title</strong></div>
                <div className="header"><strong>Rating</strong></div>
                <div className="header"><strong>Vote Count</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.movies}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Dashboard.propTypes = {
//   isAuthenticated: PropTypes.bool.isRequired,
//   setAuthenticated: PropTypes.func.isRequired,
// }