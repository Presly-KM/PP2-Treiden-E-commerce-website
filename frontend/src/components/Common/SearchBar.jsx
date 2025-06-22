import { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchProductsByFilters,
  setFilters,
} from "../../redux/slices/productsSlice";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();                                              // Ici on utilise useDispatch pour accéder à la fonction dispatch de Redux
  const navigate = useNavigate();                                              // Ici on utilise useNavigate pour accéder à la fonction navigate de React Router. Elle permet de naviguer vers une autre page de l'application. 

  const handleSearchToggle = () => {                                           // Ici on utilise handleSearchToggle pour basculer l'état de isOpen entre true et false. Si isOpen est true, la barre de recherche s'affiche, sinon elle est masquée.
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));                              // Ici on utilise setFilters pour mettre à jour les filtres de recherche dans Redux. On passe l'objet { search: searchTerm } pour mettre à jour le filtre de recherche avec la valeur de searchTerm. searchTerm est la valeur saisie par l'utilisateur dans la barre de recherche. Cela permet de filtrer les produits en fonction de la recherche effectuée par l'utilisateur. 
    dispatch(fetchProductsByFilters({ search: searchTerm }));                  // Ici on utilise fetchProductsByFilters pour récupérer les produits en fonction des filtres de recherche. On passe l'objet { search: searchTerm } pour récupérer les produits qui correspondent à la valeur de searchTerm.
    navigate(`/collections/all?search=${searchTerm}`);                         // Ici on utilise navigate pour rediriger l'utilisateur vers la page de résultats de recherche. On construit l'URL en utilisant la valeur de searchTerm pour afficher les produits correspondants à la recherche effectuée par l'utilisateur.
    setIsOpen(false);                                                          // Ici on utilise setIsOpen pour fermer la barre de recherche après avoir effectué la recherche. Cela permet de masquer la barre de recherche une fois que l'utilisateur a cliqué sur le bouton de recherche ou appuyé sur la touche Entrée.
  };

  return (
    <div
      className={`flex items-center justify-center w-full transition-all duration-300 ${  
        isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50" : "w-auto"
      } `}
    >
      {isOpen ? (
        <form
          onSubmit={handleSearch}                                             // Ici on utilise handleSearch pour gérer la soumission du formulaire de recherche. Lorsque l'utilisateur appuie sur le bouton de recherche ou appuie sur la touche Entrée, la fonction handleSearch est appelée pour effectuer la recherche.
          className="relative flex items-center justify-center w-full"
        >
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
            />
            {/* search icon */}
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              <HiMagnifyingGlass className="h-6 w-6" />
            </button>
          </div>
          {/* close button  */}
          <button
            type="button"
            onClick={handleSearchToggle}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            <HiMiniXMark className="h-6 w-6" />
          </button>
        </form>
      ) : (
        <button onClick={handleSearchToggle}>
          <HiMagnifyingGlass className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};
export default SearchBar;
