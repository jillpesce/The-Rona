import React from 'react';
import PageNavbar from './PageNavbar';
import BestGenreRow from './BestGenreRow';
import '../style/BestGenres.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BestGenre extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedDecade: "",
			decades: [],
			genres: []
		};

		this.submitDecade = this.submitDecade.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	/* ---- Q3a (Best Genres) ---- */
	componentDidMount() {
    fetch("http://localhost:8081/decades",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(decadesList => {
      if (!decadesList) return;

      let decadesDivs = decadesList.map((decade, i) =>
      	<option key={i} value={decade.decade}>{decade.decade}</option>
      );

      this.setState({
        decades: decadesDivs
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
	
	}

	handleChange(e) {
		this.setState({
			selectedDecade: e.target.value

		});
	}

	/* ---- Q3b (Best Genres) ---- */
	submitDecade() {
		fetch(`http://localhost:8081/decades/'${this.state.selectedDecade}'`, {
			method: 'GET',
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(genreRatingsList => {
			if (!genreRatingsList) return;

			let bestGenreDivs = genreRatingsList.map((genre, i) =>
				<BestGenreRow key={i} genre={genre.genre} rating={genre.avg_rating}/>
			);

			this.setState({
				genres: bestGenreDivs
			});
		}, err => {
			console.log(err);
		});
	}


	render() {

		return (
			<div className="BestGenres">
				<PageNavbar active="bestgenres" />

				<div className="container bestgenres-container">
			      <div className="jumbotron">
			        <div className="h5">Best Genres</div>

			        <div className="years-container">
			          <div className="dropdown-container">
			            <select value={this.state.selectedDecade} onChange={this.handleChange} className="dropdown" id="decadesDropdown">
			            	{this.state.decades}
			            </select>
			            <button className="submit-btn" id="decadesSubmitBtn" onClick={this.submitDecade}>Submit</button>
			          </div>
			        </div>
			      </div>
			      <div className="jumbotron">
			        <div className="movies-container">
			          <div className="movie">
			            <div className="header"><strong>Genre</strong></div>
			            <div className="header"><strong>Average Rating</strong></div>
			          </div>
			          <div className="movies-container" id="results">
			            {this.state.genres}
			          </div>
			        </div>
			      </div>
			    </div>
			</div>
		);
	}
}