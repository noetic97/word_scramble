import React from 'react';
import { Router } from "@reach/router";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import WordList from "../WordList/WordList";
import Register from "../Register/Register";
import Login from "../Login/Login";

function App() {
  return (
    <div className="app">
    <Header />
      <Router>
        <WordList path="/" />
        <Register path="/register" />
        <Login path="/login" />
      </Router>
    <Footer />
    </div>
  );
}

export default App;
