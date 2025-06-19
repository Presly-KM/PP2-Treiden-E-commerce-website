import { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");                                         // Ici on gère l'état du terme de recherche. Actuellement, il est vide par défaut.
  const [isOpen, setIsOpen] = useState(false);                                              // Ici on gère l'état d'ouverture/visibilité du champ de recherche (genre ouvrir et fermer le formulaire). Actuellement, il est fermé par défaut. Le champt de recherche ne sera visible que lorsque le "IsOpen" a la ligne 14 sera sur "true" autrement dit lorsque l'utilisateur cliquera sur l'icône de recherche.

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);                                                                     // Cette fonction inverse l'état d'ouverture du champ de recherche. Si le champ est fermé, il s'ouvre, et vice versa. (!isOpen) signifie que si isOpen est "false" alors il devient "true" et vice versa.
  };

    const handleSearch = (e) => {                                                           // Pour l'heure, cette fonction va afficher le terme de recherche dans la console lorsque l'utilisateur soumet le formulaire. Et quant notre backend sera prêt, on pourra traiter le terme recherché de manière réelle.
    e.preventDefault();                                                                    // Cette fonction gère la soumission du formulaire de recherche. Elle empêche le comportement par défaut du formulaire (qui est de recharger la page) et peut être utilisée pour effectuer une action de recherche.
    console.log("Search Term:", searchTerm);                                              // Ici, on peut ajouter la logique de recherche, comme appeler une API ou filtrer des données. Pour l'instant, elle affiche simplement le terme de recherche dans la console.
    setIsOpen(false);                                                                    // Après la soumission, on ferme le champ de recherche en mettant isOpen à "false".
};

return (
    <div
      className={`flex items-center justify-center w-full transition-all duration-300 ${
        isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50" : "w-auto"                // Ici, on utilise une classe conditionnelle pour gérer le style du conteneur du champ de recherche. Si isOpen est "true", le conteneur prend toute la largeur de l'écran (w-full), est positionné en haut à gauche (absolute top-0 left-0), a un fond blanc (bg-white), une hauteur de 24 (h-24) et un z-index de 50 pour être au-dessus des autres éléments. Si isOpen est "false", il garde sa largeur automatique (w-auto).
      }  `}
    >
      {isOpen ? (                                                                              // Le champ de recherche est ouvert / visible que si le isOpen est "true" .. En l'espèce,isOpen sera "true" si l'utilisateur clique sur l'icône de recherche. cf l.35 où cliquer sur l'icone de recherche enclenche la fonction handleSearchToggle qui inverse l'état de isOpen (le passe a true si est false et vice versa).
        <form 
        onSubmit={handleSearch}                                                                // Ici, on utilise la fonction handleSearch pour gérer la soumission du formulaire de recherche. Cette fonction est appelée lorsque l'utilisateur appuie sur "Entrée" après avoir entré un terme de recherche.
        className="relative flex items-center justify-center w-full"
        >
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}                             // Ici, on met à jour l'état du terme de recherche lorsque l'utilisateur tape dans le champ de recherche.  En effet, on utilise la fonction setSearchTerm pour mettre à jour l'état de searchTerm (qui par défaut est un champ vide) avec la valeur actuelle du champ de saisie (e.target.value).                  
              className="bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full
                 placeholder:text-gray-700"
            />
            {/* search icon */}
            <button type="submit" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600
             hover:text-gray-800"
             >
              <HiMagnifyingGlass className="h-6 w-6" />
            </button>
          </div>
          { /* close button */}
          <button 
          type="button" 
          onClick={handleSearchToggle}                                                     // Ici, on utilise la fonction handleSearchToggle pour fermer le champ de recherche lorsque l'utilisateur clique sur l'icône de fermeture.
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600
           hover:text-gray-800" 
           >
            <HiMiniXMark className="h-6 w-6"/>
            </button>
        </form>
      ) : (                                                                                 // Dans le contraire (représenté ici ":") , si le champ de recherche n'est pas ouvert, on affiche simplement l'icône de recherche tout seul. On le met dans un bouton pour pouvoir cliquer sur cet icone et ouvrir le champ de recherche et ainsi passer le isOpen à "true".                   
        <button onClick={handleSearchToggle}>                                               {/*  */}
          <HiMagnifyingGlass className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};
export default SearchBar;
