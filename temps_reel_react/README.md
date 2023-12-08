# Application de Chatbox

Cette application est une application qui permet a différents clients d'échanger des messages sans authentification, applique des actions et récevoir des réponses depuis une intélligence artificielle.

## Fonctionnalités :

### Discution en temps réel

Des personnes peuvent echanger des messages en temps réel grace à l'utilisation de socket.i0

### Traduction de message

Chaque client peut traduire individuellement le message qu'il souhaite en choisissant la langue dans une liste de 10 langues proposées, la réponse de la traduction est visible depuis une modale qui s'affiche.

### Validation de message

Chaque client a la possibilité de valider le message qu'il souhaite en cliquant sur le button valider

### Suggestion de réponses

chaque client a la possibilité de selectionner un nombre de message qu'il souhaite, en fonction du contenu reçu une réponse liste de proposition (réponse) est affiché dans la modale avec un button envoyer qui merci d'envoyer l'une des propostion comme message dans le chat.

## Améliorations :

- Traduction de plusieurs messages en meême temps
- Utiliser le model whisper pour permettre à l'utilisateur de transmettre un audio afin qu'il soit transcripté en texte.

NB: le projet est divisé en 2

- Backend en Nestjs
- Frontend en Nextjs
- Pour faire tourner l'application correctement, il faut une clé OpenIA.
