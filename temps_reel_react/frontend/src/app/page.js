"use client";
import "./style.css";
import React from "react";

export default function Home() {
  return (
    <div>
      <header className="header">
        <a href="/">
          <h1>Chatbox App</h1>
        </a>
      </header>

      <main>
        <p>
          Bienvenue sur notre chatbox ! Pour garantir une expérience positive et
          respectueuse pour tous les utilisateurs, nous vous prions de suivre
          quelques règles de bienveillance. <br></br>Tout d'abord, soyez aimable
          et respectueux envers les autres participants. Évitez les propos
          offensants, discriminatoires ou toute forme de harcèlement. <br></br>
          Notre chatbox est un espace inclusif où chacun est invité à s'exprimer
          librement tout en maintenant le respect mutuel. Assurez-vous également
          de rester sur le sujet et d'éviter les discussions trop personnelles.
          Respectez la vie privée des autres utilisateurs et ne partagez pas
          d'informations sensibles. <br></br>Si vous avez des préoccupations ou
          des problèmes, n'hésitez pas à contacter notre équipe de support qui
          se fera un plaisir de vous aider. <br></br>Enfin, profitez de
          l'intelligence artificielle qui alimente notre chatbox pour des
          discussions enrichissantes et informatives. Utilisez cette plateforme
          comme un moyen de partager des idées, poser des questions et apprendre
          les uns des autres de manière positive. <br></br>Nous sommes ravis de
          vous avoir parmi nous et sommes convaincus que votre contribution
          rendra notre communauté en ligne encore plus dynamique et agréable
          pour tous. Merci de respecter ces règles et de faire de notre chatbox
          un espace convivial pour tous les utilisateurs.
        </p>

        <a href="/chat" className="message">
          Messagerie
        </a>
      </main>
    </div>
  );
}
