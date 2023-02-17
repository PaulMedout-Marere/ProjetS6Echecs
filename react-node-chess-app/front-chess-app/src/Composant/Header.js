import React from 'react';
import './Header.css';
import chess from './chess.png';

function Header(){
    return (
        <div className='Header'>
            <h1 className='titre'> Blind Chess </h1>
            <img className='chess' src={chess} alt='imgchess'></img>
            
        </div>
    )
}

export default Header;