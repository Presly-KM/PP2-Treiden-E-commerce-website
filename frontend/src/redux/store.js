import {configureStore} from '@reduxjs/toolkit'; // On importe configureStore depuis Redux Toolkit afin de permettre la création du store et ainsi pouvoir gérer l'état de l'application

const store = configureStore({  // On déclare une constante store qui va contenir le store de l'application. A l'intérieur de cette constante, on lui passe l'objet reducer qui contiendront les différents fonctions de chaque focntionnalité de l'application comme par exemple "user reducer" pour la gestion de l'utilisateur ou encore "cart reducer" pour la gestion du panier.
    reducer: {}, // On initialise le store avec un objet vide pour l'instant, car nous n'avons pas encore de reducers définis.
});


export default store; // On exporte le store pour qu'il puisse être utilisé dans d'autres parties de l'application, comme dans le fichier index.js pour être intégré à l'application React.