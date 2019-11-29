import React from 'react'
import './Landing.css'
import Title from "../title2.png";

const Landing = () => {
    return (
        <div class="card mb-3">
            <img src={Title} class="img-height img-center" />
            <div class="card-body">
                <h5 class="card-title">Welcome to Jam with Our Band</h5>
                <p class="card-text">
                    <p>
                        We are TeamNeo and we are participating in the <span><a href="https://www.utahgeekevents.com/competition/">Smart Cities and Connected Communities</a>
                        </span> data science competition.  In short,
                        the purpose of the competition is to focus on smart cities and connected communities with
                        the goal of gaining experience and improving how we live. We decided to focus on improving musician training software through live feeback using a machine learning algorithm.
                    </p>
                    <dl>
                        <dt>What do we need?</dt>
                        <dd>We need wind musicians to record themselves playing a concert F for 20-30 seconds (a long tone) in .wav format.  The .wav files can be uploaded to the site or you can use the recording section
                            to record yourself.
                        </dd>
                        <dt>What are the recordings used for?</dt>
                        <dd>The recordings will be used to train a machine learning algorithm that will be able to determine how stable your long tones are. </dd>
                    </dl>
                </p>
                <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
            </div>
        </div>

    )
}

export default Landing
