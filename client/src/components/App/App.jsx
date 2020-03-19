import React from 'react';
import { Router } from "@reach/router";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import WordList from "../WordList/WordList";

function App() {
  return (
    <div className="app">
    <Header />
      <Router>
        <WordList path="/" />
      </Router>
    <Footer />
    </div>
  );
}

export default App;
