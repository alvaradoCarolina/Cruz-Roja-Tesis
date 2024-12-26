import React from 'react';
import image from '../../assets/undraw_access-denied_bbso.png';
import "./NonCompat.style.css"

const NonCompat = () => {
    return(
        <main className="layout">
            <img className="img" src={image} alt=""/>
            <p>Tu dispositivo no es compatible con este sitio.</p>
        </main>
    );
}

export default NonCompat;