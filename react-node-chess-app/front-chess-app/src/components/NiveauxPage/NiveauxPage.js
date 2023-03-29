import { React, useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { decodeToken } from "react-jwt";
import { GlobalContext } from '../GlobalContext/GlobalContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from "axios";
import { Howl, Howler } from 'howler';


import "./NiveauxPage.css"

// imporation des composants de chaque niveau
import Nomenclature1 from '../Exercices/Nomenclature/Nomenclature1';
import Nomenclature2 from '../Exercices/Nomenclature/Nomenclature2';
import Nomenclature3 from '../Exercices/Nomenclature/Nomenclature3';
import Nomenclature4 from '../Exercices/Nomenclature/Nomenclature4';

export default function NiveauxPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const exercice = location.state.exercice;
    const niveau = location.state.niveau;
    const index = location.state.index;
    const [exerciceElo, setExerciceElo] = useState(null);
    const { updateGlobalElo } = useContext(GlobalContext); // Récupération de globalElo et setGlobalElo avec useContext
    const matches = useMediaQuery("(min-width:1200px)");
    const soundHover = new Howl({
        src: ['/sons/hover.mp3']
    });
    const soundDown = new Howl({
        src: ['/sons/clicdown.wav']
    });
    const soundUp = new Howl({
        src: ['/sons/clicup.wav']
    });

    // console.log(exercice);
    // console.log(niveau);
    // console.log(index);

    useEffect(() => {
        async function setActualExerciceElo() {
            try {
                const decoded = decodeToken(sessionStorage.token);
                const name = decoded.name;
                // get elo
                var config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `http://localhost:3001/eloExercise/elo/${name}/${exercice.id}`,
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.token}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                };
                axios(config)
                    .then(function (response) {
                        setExerciceElo(response.data.exerciceElo);
                    })
                    .catch(function (error) {
                        console.log(error.response);
                    });
            }
            catch (error) {
                console.log(error);
            }
        }
        setActualExerciceElo();
    }, [exercice.id]);



    // Créez une structure de données pour stocker les composants de chaque niveau
    const niveaux = {
        1: {
            1: <Nomenclature1
                idExercice={exercice.id}
                pointsGagnes="5"
                pointsPerdus="2"
                exerciceElo={exerciceElo} setExerciceElo={setExerciceElo}
                updateGlobalElo={updateGlobalElo}
                matches={matches} />,
            2: <Nomenclature2
                idExercice={exercice.id}
                pointsGagnes="8"
                pointsPerdus="3"
                exerciceElo={exerciceElo} setExerciceElo={setExerciceElo}
                updateGlobalElo={updateGlobalElo} />,
            3: <Nomenclature3
                idExercice={exercice.id}
                pointsGagnes="10"
                pointsPerdus="5"
                exerciceElo={exerciceElo} setExerciceElo={setExerciceElo}
                updateGlobalElo={updateGlobalElo} />,
            4: <Nomenclature4
                idExercice={exercice.id}
                pointsGagnes="10"
                pointsPerdus="5"
                exerciceElo={exerciceElo} setExerciceElo={setExerciceElo}
                updateGlobalElo={updateGlobalElo} />,
            // etc...
        },
        // etc...
    };

    const handlePieceHover = () => {
        Howler.volume(0.1);
        soundHover.play();
    };

    const handlePieceDown = () => {
        Howler.volume(0.3);
        soundDown.play();
    };


    // Récupérez le composant à afficher en fonction des id
    const NiveauComponent = niveaux[exercice.id][index];

    return (
        <div className="level-container">
            <div className="level-header">
                <button className="bouton-3D"
                    onClick={() => {
                        Howler.volume(0.3);
                        soundUp.play();
                        navigate(-1)
                    }}
                    onMouseEnter={() => handlePieceHover()}
                    onMouseDown={() => handlePieceDown()}>
                    <span className="texte-3D"> {/* Retourne à la page précédente */}
                        ← Retour
                    </span>
                </button>
                <div className="level-label">Exercice <i>{exercice.name}</i> : <i>niveau {index}</i></div>
                <span className="level-elo">{exerciceElo !== null && exerciceElo} points d'élo pour cet <b>exercice</b></span>
            </div>
            {/* Affichez le composant récupéré */}
            <div className="level-jeux">
                {exerciceElo !== null && NiveauComponent}
            </div>
        </div>
    );
}