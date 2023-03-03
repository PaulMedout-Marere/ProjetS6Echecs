import React from 'react';
import './chess.css';
import chess from './../chess.png';
import * as Chess from 'chess.js';
import * as Chessboard from '/../chessboard';

class ChessGame extends React.Component {
    state = {
        game : new Chess(),
    };
    board1 = Chessboard('board1', 'start');
    
    componentDidMount() {
        console.log(this.state.game.fen());
        this.state.game.move("e4");
        console.log(this.state.game.fen());
    }
    render(){
    return (
        <div id="board1" style="width: 400px"></div>
    )
}}

export default ChessGame;