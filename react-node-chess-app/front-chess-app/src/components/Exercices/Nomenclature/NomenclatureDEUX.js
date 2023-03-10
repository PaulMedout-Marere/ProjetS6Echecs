import React from "react";
import './Nomenclature.css';
import '../../Components.css';
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'

class NomenclatureDEUX extends React.Component {
    constructor() {
        super();
        this.state = {
            inputValue: '',
            correctMessage: '',
            incorrectMessage: '',
            nomPiece: '',
            pos: '',
            chess: new Chess()
        };

        const alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

        var colonneP, colonneM, ligneP, ligneM, coul, coulM, couleur;
        this.state.chess.clear();

        //choix couleur
        if (Math.random() < 0.5) {
            couleur = 'b';
            coul = 'b';
            coulM = 'w';
            this.state.chess.load('kK6/8/8/8/8/8/8/8 b -- - 0 1');
            this.state.chess.remove('a8');
            this.state.chess.remove('b8');

        }
        else {
            coul = 'w';
            coulM = 'b';
        }

        // premiere etape choisir piece
        const pieces = ['p', 'r', 'n', 'b', 'q', 'k'];
        const piece = pieces[Math.floor(Math.random() * pieces.length)];
        this.piece = piece;
        // 3 cas
        if (piece === 'p') { // pions
            if (couleur === 'b') {
                // position piece qui mange
                colonneP = Math.floor(Math.random() * 6) + 1;
                ligneP = Math.floor(Math.random() * 7) + 2;


                // position piece mangé
                colonneM = colonneP + 1;
                ligneM = ligneP - 1;
            }
            else {
                // position piece qui mange
                colonneP = Math.floor(Math.random() * 5) + 1;
                ligneP = Math.floor(Math.random() * 7) + 1;

                // position piece mangé
                colonneM = colonneP + 1;
                ligneM = ligneP + 1;
            }
        }
        else if (piece === 'r') { // tours
            // position piece qui mange
            colonneP = Math.floor(Math.random() * 8) + 1;
            ligneP = Math.floor(Math.random() * 8) + 1;

            if (Math.random() < 0.5) { // choix entre L ou I
                // position I
                if (Math.random() < 0.5) { // choix entre ligne ou colonne
                    // meme colonne
                    // position piece mangé
                    colonneM = colonneP;
                    do {
                        ligneM = Math.floor(Math.random() * 6) + 2;
                    }
                    while (ligneM === ligneP);
                }
                else { // meme ligne
                    // position piece mangé
                    ligneM = ligneP;
                    do {
                        colonneM = Math.floor(Math.random() * 6) + 2; ///// warning
                    }
                    while (colonneM === colonneP);
                }
            }
            else { // position L
                if (Math.random() < 0.5) { // choix entre ligne ou colonne
                    // meme colonne

                    // position piece mangé
                    colonneM = colonneP;
                    do {
                        ligneM = Math.floor(Math.random() * 8) + 1;
                    }
                    while (ligneM === ligneP);
                }
                else { // meme ligne

                    // position piece mangé
                    ligneM = ligneP;
                    do {
                        colonneM = Math.floor(Math.random() * 8) + 1;
                    }
                    while (colonneM === colonneP);
                }
            }
        }
        else if (piece === 'n') {
            // position piece qui mange
            colonneP = Math.floor(Math.random() * 8) + 1;
            ligneP = Math.floor(Math.random() * 8) + 1;

            // 4 cas
            if (colonneP <= 4 && ligneP <= 4) { // bas gauche
                if (Math.random() < 0.5) { // x+2 y+1
                    // position piece mangé
                    colonneM = colonneP + 2
                    ligneM = ligneP + 1
                }
                else {
                    // position piece mangé
                    colonneM = colonneP + 1
                    ligneM = ligneP + 2
                }
            }
            if (colonneP > 4 && ligneP <= 4) {  // bas droite
                if (Math.random() < 0.5) { // x-2 y+1
                    // position piece mangé
                    colonneM = colonneP - 2
                    ligneM = ligneP + 1
                }
                else {
                    // position piece mangé
                    colonneM = colonneP - 1
                    ligneM = ligneP + 2
                }
            }
            if (colonneP <= 4 && ligneP > 4) { // haut gauche
                if (Math.random() < 0.5) { // x+2 y+1
                    // position piece mangé
                    colonneM = colonneP + 2
                    ligneM = ligneP - 1
                }
                else {
                    // position piece mangé
                    colonneM = colonneP + 1
                    ligneM = ligneP - 2
                }
            }
            if (colonneP > 4 && ligneP > 4) { // haut droite
                if (Math.random() < 0.5) { // x+2 y+1
                    // position piece mangé
                    colonneM = colonneP - 2
                    ligneM = ligneP - 1
                }
                else {
                    // position piece mangé
                    colonneM = colonneP - 1
                    ligneM = ligneP - 2
                }
            }

        }
        else if (piece === 'b') {
            //piece qui mange 
            colonneP = Math.floor(Math.random() * 8) + 1;
            ligneP = Math.floor(Math.random() * 8) + 1;
            //piece qui sera mangé 
            do {
                do {
                    colonneM = Math.floor(Math.random() * 8) + 1;
                }
                while (colonneM === colonneP);
                ligneM = ligneP + Math.abs(colonneP - colonneM);
                if (ligneM > 8) {
                    ligneM = ligneP - Math.abs(colonneP - colonneM);
                }
            } while (ligneM < 0 || ligneM > 8);
        }
        else if (piece === 'q') {
            //piece qui mange 
            colonneP = Math.floor(Math.random() * 8) + 1;
            ligneP = Math.floor(Math.random() * 8) + 1;
            //piece qui sera mangé 
            colonneM = Math.floor(Math.random() * 8) + 1;
            do { ligneM = Math.floor(Math.random() * 8) + 1; }
            while ((colonneM === colonneP && ligneM === ligneP) || (ligneM !== ligneP && colonneM !== colonneP
                && ligneM !== (ligneP + Math.abs(colonneP - colonneM) || ligneP - Math.abs(colonneP - colonneM))));


        }
        else if (piece === 'k') {
            //piece qui mange 
            colonneP = Math.floor(Math.random() * 8) + 1;
            ligneP = Math.floor(Math.random() * 8) + 1;
            //piece qui sera mangé 
            do {
                colonneM = Math.floor(Math.random() * 3) + (colonneP - 1);
                ligneM = Math.floor(Math.random() * 3) + (ligneP - 1);
            }
            while (colonneM > 8 || colonneM < 1 || ligneM > 8 || ligneM < 1 ||
                (ligneM === ligneP && colonneM === colonneP));
        }


        this.state.chess.put({ type: `${piece}`, color: `${coul}` }, `${alpha[colonneP - 1]}${ligneP}`) // P
        this.state.chess.put({ type: `q`, color: `${coulM}` }, `${alpha[colonneM - 1]}${ligneM}`) // M

        if (piece === 'p') this.state.nomPiece = `le pion en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'r') this.state.nomPiece = `la tour en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'n') this.state.nomPiece = `le cavalier en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'b') this.state.nomPiece = `le fou en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'q') this.state.nomPiece = `la reine en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'k') this.state.nomPiece = `le roi en ${alpha[colonneP - 1]}${ligneP}`

        this.state.pos = `${alpha[colonneM - 1]}${ligneM}`;

        var coup = '';
        if (piece !== 'p') {
            coup += piece.toUpperCase();
        }
        if (piece === 'p') {
            coup += alpha[colonneP - 1];
        }

        coup += 'x';
        coup += alpha[colonneM - 1] + ligneM;

        console.log(coup);
        console.log(this.state.chess.moves({ verbose: true }));
        this.coup = coup;

    }

    handleInputChange = (event) => {
        this.setState({ inputValue: event.target.value });
    };

    handleClick = () => {
        const { inputValue, chess } = this.state;

        if (inputValue === this.coup || (this.piece === 'p' && inputValue === 'p'+ this.coup)) {
            const text = "Bravo c'était ça !";
            this.setState({ chess: chess, correctMessage: text, incorrectMessage: '', inputValue: '' });
            chess.move(inputValue);

        }
        else {
            const text = "NON ! TU ES NUL ! TOUT LE MONDE A REUSSI SAUF TOI !"
            this.setState({ chess: chess, incorrectMessage: text, correctMessage: '', inputValue: '' });

        }
    }

    render() {
        return (
            <div className="containerNom">
                <div className="chesscenter">
                    <h2 id="txt">Ecrivez le coup pour que {this.state.nomPiece} mange la reine en {this.state.pos}</h2>
                    <Chessboard
                        position={this.state.chess.fen()}
                        squareStyles={{ e4: { backgroundColor: "yellow" } }}
                        arePiecesDraggable={false}
                        width={400}
                    />
                </div>
                <div className="elementsDroite">
                    <input id="saisieposition" type="text" placeholder="Entrez le mouvement..." value={this.state.inputValue} onChange={this.handleInputChange}></input>
                    <button id="checkposition" onClick={this.handleClick}>Valider</button>
                    <div id="correctMessage">{this.state.correctMessage} </div>
                    <div id="incorrectMessage">{this.state.incorrectMessage} </div>
                </div>
            </div>
        );
    }
}

export default NomenclatureDEUX;