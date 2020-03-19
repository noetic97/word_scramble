import React from 'react';
import { Link } from "@reach/router";
import Banner from '../../images/word_scramble_header.jpg';

function Header() {
  return (
    <header className="header">
      <Link to="/">
        <img src={Banner} alt="Word Scramble header banner" className="header-banner" />
      </Link>
    </header>
  );
}

export default Header;
