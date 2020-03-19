import React, { Component } from 'react';

class WordList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      typedWord: '',
      scramblePhrase: 'Corona Virus Madness',
    }
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }
  
  componentDidMount () {
    console.log("hello world");
  }

  handleFieldChange (e) {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }
  
  render() {
    const {typedWord, scramblePhrase} = this.state;
    
    // if (!pokemon.length) {
    //   return null;
    // }
    
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
