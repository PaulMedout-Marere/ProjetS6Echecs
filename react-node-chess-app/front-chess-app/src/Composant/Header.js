import React from 'react';
import './Header.css';
import './chess.png';

function Header(){
    return (
        <div className='Header'>
            <h1 className='titre'> Blind Chess </h1>
            <img className='chess' src='https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/CHESScom/phpyyRnHb.png' alt='imgchess'></img>
            
        </div>
    )
}

export default Header;