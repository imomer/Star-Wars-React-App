import React, {Component} from 'react';
import StarWarsLogo from './images/Star_Wars_Logo.svg';
import Loading from './images/loading.svg';
import './style.css';

class App extends Component {

    /**
     * Constructor
     */
    constructor() {
        super();
        this.state = {
            btnActive: false,
            showLoader: false,
            showQAs: false,
            longestOpeningCrawlFilm: null,
            mostAppearedCharacter: null,
            planetsWithPilots: null,
            mostAppearedSpecies: null
        }
    }


    /**
     * Show QAs
     */
    getQAs() {

        if (this.state.btnActive) {

            this.setState({
                btnActive: false,
                showQAs: false,
            });

        } else {

            // Show the loader while fetching data
            this.setState({
                btnActive: true,
                showLoader: true
            });

            // Ajax URLs
            const proxyURL = "https://cors-anywhere.herokuapp.com/";
            const longestOpeningCrawlFilmURL = "https://prototype-star-wars-api.herokuapp.com/api/longest-opening-crawl-film";
            const mostAppearedCharacterURL = "https://prototype-star-wars-api.herokuapp.com/api/most-appeared-character";
            const mostAppearedSpeciesURL = "https://prototype-star-wars-api.herokuapp.com/api/most-appeared-species";
            const planetsWithPilotsURL = "https://prototype-star-wars-api.herokuapp.com/api/planets-with-pilots";

            // Ajax call for longest opening crawl film
            const call1 = fetch(proxyURL + longestOpeningCrawlFilmURL)
                .then(res => res.json())
                .then(
                    (result) => {
                        return result[0];
                    },
                    (error) => {
                        this.setState({
                            error
                        });
                    }
                );

            // Ajax call for most appeared character
            const call2 = fetch(proxyURL + mostAppearedCharacterURL)
                .then(res => res.json())
                .then(
                    (result) => {
                        return result[0];
                    },
                    (error) => {
                        this.setState({
                            error
                        });
                    }
                );

            // Ajax call for most appeared species
            const call3 = fetch(proxyURL + mostAppearedSpeciesURL)
                .then(res => res.json())
                .then(
                    (result) => {
                        return result;
                    },
                    (error) => {
                        this.setState({
                            error
                        });
                    }
                );

            // Ajax call for planets with pilots
            const call4 = fetch(proxyURL + planetsWithPilotsURL)
                .then(res => res.json())
                .then(
                    (result) => {
                        return result;
                    },
                    (error) => {
                        this.setState({
                            error
                        });
                    }
                );


            Promise.all([call1, call2, call3, call4]).then(values => {
                console.log(values);
                this.setState({
                    showLoader: false,
                    showQAs: true,
                    longestOpeningCrawlFilm: values[0],
                    mostAppearedCharacter: values[1],
                    mostAppearedSpecies: values[2],
                    planetsWithPilots: values[3],
                });
            });


        }


    }


    /**
     * Render view
     */
    render() {


        return (
            <div className="star-wars-app">

                {/* header begins */}
                <header className="app-header">
                    <img src={StarWarsLogo} alt="Star Wars"/>
                </header>
                {/* header ends */}

                {/* revelation button begins  */}
                <div className="revelation-btn">
                    <button
                        onClick={() => this.getQAs()}
                        className={this.state.btnActive ? 'active' : ''}
                    >
                        <i className="fas fa-star star"></i>
                        Do. Or do not. There is no try.
                        <i className="fas fa-star star"></i>
                    </button>
                </div>
                {/* revelation button ends  */}

                {/* loading animation begins */}
                {this.state.showLoader ?
                    <div className="loading-anim">
                        <img src={Loading} alt="Loading"/><br/>
                        Please wait... While we are searching the stars for answers.
                    </div>
                    : null
                }
                {/* loading animation ends */}

                {/* api data display begins */}
                {this.state.showQAs ?
                    <div className="films-qas">
                        <div className="qa-item">
                            <article className="question">Which of all StarWars Movies has longest opening crawl?
                            </article>
                            <article className="answer">{this.state.longestOpeningCrawlFilm.title}</article>
                        </div>
                        <div className="qa-item">
                            <article className="question">What character (person) appeared in the most of StarWars
                                films?
                            </article>
                            <article className="answer">{this.state.mostAppearedCharacter.name}</article>
                        </div>
                        <div className="qa-item">
                            <article className="question">What species appeared in the most number of StarWars films?
                            </article>
                            <article className="answer">
                                <ul>
                                    {Object.keys(this.state.mostAppearedSpecies).slice(0, 5).map(key =>
                                        <li key={key}>{key} ({this.state.mostAppearedSpecies[key]})</li>
                                    )}
                                </ul>
                            </article>
                        </div>
                        <div className="qa-item">
                            <article className="question">What planet in StarWars universe provided the largest number
                                of vehicle pilots?
                            </article>
                            <article className="answer">
                                <ul>
                                    {this.state.planetsWithPilots.slice(0, 4).map((value, index) => {
                                        return <li key={index}>Plante: {value.name} - Pilots:
                                            ({value.people_count})<br /> <Pilots data={value.people}/></li>
                                    })}
                                </ul>
                            </article>
                        </div>
                    </div>
                    : null
                }
                {/* api data display ends */}

            </div>
        )
    }

}


export default App;


/**
 * Pilots component to display pilots and their species.
 *
 */
function Pilots(props) {

    const data = props.data;
    const pilotsCount = (data.length - 1);

    const pilots = data.map((pilot, index) =>
        <span key={index} className="pilot">{pilot.name} - {pilot.species.length > 0 ? pilot.species[0].name : 'Unknown'}{pilotsCount === index ? null : ', '}</span>
    );

    return (
        <span>{pilots}</span>
    );

}