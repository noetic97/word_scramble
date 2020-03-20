import React, { Component } from 'react';
import { Redirect } from "@reach/router";

class WordList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loggedIn: false,
      typedWord: '',
      words: [],
      scramblePhrase: 'Corona Virus Madness',
      redirect: false,
    }
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.fetchWords = this.fetchWords.bind(this);
    this.setLocalToState = this.setLocalToState.bind(this);
    this.redirectUser = this.redirectUser.bind(this);
  }
  
  componentDidMount () {
    const localUser = JSON.parse(localStorage.getItem('WS_userStatus'));

    if (localUser) {
      this.setLocalToState(localUser);
    } else {
      this.redirectUser();
    }
    // this.fetchWords();
  }

  handleFieldChange (e) {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }
  
  setLocalToState = (data) => {
    this.setState({
      loggedIn: data.loggedIn,
    });
  }
  
  redirectUser = () => {
  this.setState({ redirect: true });
}

fetchWords = () => {
  fetch('api/v1/words-index')
    .then(res => res.json())
    .then((words) => {
      words = words.words; //eslint-disable-line
      const userName = JSON.parse(localStorage.getItem('WS_userName'));

      if (userName) {
        const customerWordArray = words.filter((word) => {
          return word.word === userName;
        });
        this.setState({
          words: customerWordArray,
        });
      } else {
        this.setState({
          words,
        });
      }
    })
    .catch(err => console.log(err));
}
  
  render() {
    const {typedWord, scramblePhrase, loggedIn, redirect} = this.state;
      
    if (!loggedIn && redirect) {
      return(
        <Redirect noThrow to="/login" />
      ) 
    }
    
    return (
      <main className="home">
        <section className="search-container">
          <p>Your Scramble Phrase is:</p>
          <h2>{scramblePhrase}</h2>
          <input
            name='typedWord'
            placeholder="Enter a word here"
            type="text"
            value={typedWord}
            onChange={this.handleFieldChange}
          />
        </section>
      </main>
    );
  }
}

export default WordList;
