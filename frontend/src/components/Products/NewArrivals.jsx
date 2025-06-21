import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const NewArrivals = () => {
  const scrollRef = useRef(null);                                  // Ici pour faire défiler le contenu horizontalement en utilisant la référence du conteneur. La référence est utilisée pour accéder aux propriétés de défilement du conteneur.
  const [isDragging, setIsDragging] = useState(false);             // Pour suivre si l'utilisateur est en train de faire glisser le contenu (sans l'aide des boutons?). / Pour checker si le conteneur peut être glissé ou non.
  const [startX, setStartX] = useState(0);                         // Pour stocker la position X de départ du curseur lors du début du glissement. / C'est le point de départ du x-axis (du glissement) quand l'utilisateur saisit et commence à faire glisser le conteneur.
  const [scrollLeft, setScrollLeft] = useState(false);             // Pour stocker la position de défilement initiale du conteneur avant le glissement./ C'est la position initial du conteneur avant que l'utilisateur ne commence à faire glisser le contenu.
  const [canScrollLeft, setCanScrollLeft] = useState(false);       // Pour savoir si le contenu peut être défilé vers la gauche.
  const [canScrollRight, setCanScrollRight] = useState(true);      // Pour savoir si le contenu peut être défilé vers la droite.

  const [newArrivals, setNewArrivals] = useState([])            // Pour stocker les nouveaux produits à afficher dans la section "New Arrivals".
  
  useEffect(() => {                                              // Ici on utilise useEffect pour récupérer les nouveaux produits depuis l'API lors du chargement du composant. Cela permet de charger les données nécessaires pour afficher les nouveaux produits.
    const fetchNewArrivals = async () => {                      // On définit une fonction asynchrone pour récupérer les nouveaux produits depuis l'API.
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals` // On envoie une requête GET à l'API pour récupérer les nouveaux produits. Ici on dit va chercher dans localhost:9000/api/products/new-arrivals les nouveaux produits. avant ça on avait hardocodé les nouveaux produits dans le composant NewArrivals.jsx (genre const newArrivals = _id: 1, name: 'Stylish Jacket', price: 120, images: url https://picsum.photos/500/500?random=1" etc. avec un long tableau), mais maintenant on va les récupérer depuis l'API.
        );
        setNewArrivals(response.data);                         // On met à jour l'état newArrivals avec les données récupérées de l'API.  
      } catch (error) {   
        console.error("Error fetching new arrivals:", error); // On affiche une erreur dans la console si la récupération des nouveaux produits échoue.   
      }
    };

      fetchNewArrivals();
    }, []); // On appelle la fonction fetchNewArrivals lors du chargement du composant pour récupérer les nouveaux produits.
  
  
      const handleMouseDown = (e) => {                            // Ici on gère le début du glissement en utilisant l'événement onMouseDown. Lorsque l'utilisateur appuie sur le bouton de la souris, la fonction handleMouseDown est appelée. cf(explication 2:11:00)
    setIsDragging(true);                                      // On met à jour l'état isDragging à true pour indiquer que l'utilisateur est en train de faire glisser le contenu.
    setStartX(e.pageX - scrollRef.current.offsetLeft);        // On stocke la position X de départ du curseur en soustrayant la position gauche du conteneur de défilement. Cela permet de calculer la distance entre le curseur et le début du conteneur.
    setScrollLeft(scrollRef.current.scrollLeft);              // On stocke la position de défilement initiale du conteneur avant le glissement. Cela permet de savoir où se trouve le contenu avant que l'utilisateur ne commence à faire glisser le conteneur.
  };
  
  const handleMouseMove = (e) => {                           // Ici on gère le mouvement de la souris pendant le glissement en utilisant l'événement onMouseMove. Lorsque l'utilisateur déplace la souris tout en maintenant le bouton enfoncé, la fonction handleMouseMove est appelée.
    if (!isDragging) return;                                 // On vérifie si l'utilisateur est en train de faire glisser le contenu. Si isDragging est false, on quitte la fonction pour ne pas effectuer d'actions inutiles.
    const x = e.pageX - scrollRef.current.offsetLeft;        // On calcule la position X actuelle du curseur en soustrayant la position gauche du conteneur de défilement. Cela permet de savoir où se trouve le curseur par rapport au conteneur.
    const walk = (x - startX);                               // On calcule la distance de glissement en multipliant la différence entre la position actuelle du curseur et la position de départ par 2. Cela permet d'accélérer le glissement pour une meilleure expérience utilisateur.
    scrollRef.current.scrollLeft = scrollLeft - walk;        // On met à jour la position de défilement du conteneur en soustrayant la distance de glissement de la position de défilement initiale. Cela permet de faire défiler le contenu horizontalement en fonction du mouvement de la souris.
  };                            
 
  const handleMouseUpOrLeave = () => {                       // Ici on gère la fin du glissement en utilisant l'événement onMouseUp. Lorsque l'utilisateur relâche le bouton de la souris, la fonction handleMouseUp est appelée. 
    setIsDragging(false);                                    // On met à jour l'état isDragging à false pour indiquer que l'utilisateur a terminé de faire glisser le contenu.
  };                     
  
  const scroll = (direction) => {                                           // Ici on gère le défilement du contenu horizontalement en fonction de la direction (gauche ou droite) passée en paramètre. Cette fonction scroll est appelée lorsque l'utilisateur clique sur les boutons (gauche ou droite) de défilement.
    const scrollAmount = direction === "left" ? -300 : 300;                 // On définit la quantité de défilement en pixels. Si la direction est "left", on défile vers la gauche (-300 pixels), sinon on défile vers la droite (300 pixels). 
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" }); // Remarque : ".current" est utilisé pour accéder à l'élément DOM réel auquel la référence est attachée. Ainsi la référence scrollRef.current pointe vers l'élément DOM du conteneur de défilement. Puis on utilise la méthode scrollBy pour faire défiler le conteneur horizontalement de la quantité définie. Le paramètre behavior: "smooth" permet d'ajouter une animation de défilement fluide.Attention ! left est la propriété qui indique la distance à défiler horizontalement ! Et ne veut pas dire gauche. 
  };
  // Update Scroll Buttons
  const updateScrollButtons = () => {                                // Ici on met à jour les boutons de défilement en fonction de la position actuelle du défilement. Cela permet de désactiver les boutons si l'utilisateur ne peut pas faire défiler davantage dans une direction.
    const container = scrollRef.current;                             // On récupère la référence (actuelle ?) du conteneur de défilement. current est utilisé pour accéder à l'élément DOM réel auquel la référence est attachée. Ainsi la référence scrollRef.current pointe vers l'élément DOM du conteneur de défilement.

    if (container) {                                                 // On vérifie si la référence (actuelle ?) scrollRef.current est définie avant de procéder à la mise à jour des boutons de défilement. Cela évite les erreurs si la référence n'est pas encore attachée à un élément DOM.
      const leftScroll = container.scrollLeft;                       // On récupère la position (valeur) actuelle du défilement horizontal du conteneur. scrollLeft est une propriété qui indique la distance en pixels que le contenu a été défilé vers la gauche.
      const rightScrollable =                                       
        container.scrollWidth > leftScroll + container.clientWidth;  // On vérifie si le contenu peut être défilé vers la droite en comparant la largeur totale du contenu à défiler (scrollWidth) avec la position actuelle du défilement plus la largeur visible du conteneur par l'utilisateur(clientWidth). Autrement dit la somme de ces deux derniers paramètres. Si le contenu est plus large que ce qui est visible, cela signifie qu'il y a du contenu à droite qui peut être défilé. (Remarque : scrollWidth est la largeur totale du contenu, y compris la partie qui n'est pas visible à l'écran, tandis que clientWidth est la largeur visible du conteneur dans la fenêtre du navigateur. // Container est la zone défilable de parmis toute notre gallerie d'images. La valeur initiale de container.scrollLeft est 0, ce qui signifie que le contenu n'a pas été défilé vers la gauche. L'icone du bouton de défilement vers la gauche sera alors désactivée. Si l'utilisateur fait défiler le contenu vers la droite, cette valeur augmente. L'utilisateur peut maintenant scroller vers la gauche (icone du bouton de defil. vers la gauche reactivé) jusqu'a ce que la valeur atteigne à nouveau zéro. La valeur de container.clientWidth est la largeur visible du conteneur dans la fenêtre du navigateur. Si le contenu est plus large que ce qui est visible, cela signifie qu'il y a du contenu supplémentaire à droite qui peut être défilé.)

      setCanScrollLeft(leftScroll > 0);                              // On peut scroller vers la gauche si le scrollLeft est supérieur à 0. Cela signifie que l'utilisateur a déjà fait défiler le contenu vers la droite et peut revenir en arrière. // Ici on met à jour l'état canScrollLeft à "true" ou "false" afin de d'activer ou désactiver l'icone gauche. / Ici la variable sera "true" si scrolleLeft est supérieur à 0, ce qui signifie que l'utilisateur a déjà fait défiler le contenu vers la droite et peut revenir en arrière. Sinon, elle sera "false", ce qui désactive l'icône de défilement vers la gauche.
      setCanScrollRight(rightScrollable);                            // On peut scroller vers la droite si le contenu est plus large que ce qui est visible. Cela signifie qu'il y a du contenu supplémentaire à droite qui peut être défilé. // Il s'agissait ici de verifier si l'utilisateur a atteint la fin du contenu défilable. le contenu total à défiler (y compris ce qui n'est pas visible) est de 3854 pixels. Ainsi on additione la position actuelle du défilement (leftScroll "sa valeur évolue avec le défilement enclenché par l'utilisateur") à la largeur visible du conteneur (clientWidth "dont la valeur est constamment égale à 1536"). Si la somme des deux est inférieure à la largeur totale du contenu (scrollWidth "dont la valeur est constamment égale à 3854"), cela signifie qu'il y a encore du contenu à droite qui peut être défilé. Dans ce cas setCanScrollLeft s'applique et agit pour mettre à jour l'état canScrollRight à "true", ce qui active l'icône de défilement vers la droite. Sinon (Si la somme est inférieure à la largeur totale du contenu "3854") alors on met à jour l'état canScrollRight à "false", ce qui désactive l'icône de défilement vers la droite.
    }
  };


  // UseEffect sert à gérer les effets de bord dans les composants fonctionnels. Il est exécuté après le rendu du composant et peut être utilisé pour effectuer des opérations telles que la récupération de données, l'ajout d'écouteurs d'événements, ou la mise à jour du DOM.
  useEffect(() => {                                              // Ici on utilise useEffect pour ajouter un écouteur d'événement de défilement au conteneur. Cela permet de mettre à jour les boutons de défilement en fonction de la position actuelle du défilement.
    const container = scrollRef.current;                         // On récupère la référence (actuelle ?) du conteneur de défilement. current est utilisé pour accéder à l'élément DOM réel auquel la référence est attachée. Ainsi la référence scrollRef.current pointe vers l'élément DOM du conteneur de défilement.
    if (container) {                                             // Ici la référence (actuelle ?) scrollRef.current est vérifiée pour s'assurer qu'elle est définie avant d'ajouter l'écouteur d'événement de défilement. Cela évite les erreurs si la référence n'est pas encore attachée à un élément DOM.
      container.addEventListener("scroll", updateScrollButtons); // On ajoute un écouteur d'événement de défilement au conteneur pour mettre à jour les boutons de défilement.
      updateScrollButtons();                                     // On appelle la fonction pour mettre à jour les boutons de défilement immédiatement après l'ajout de l'écouteur d'événement.                   
      return () => container.removeEventListener("scroll", updateScrollButtons); // On retourne une fonction de nettoyage qui supprime l'écouteur d'événement de défilement lorsque le composant est démonté ou que la référence change. Cela permet d'éviter les fuites de mémoire et les erreurs liées à des écouteurs d'événements obsolètes.                                       
    }
  }, [newArrivals]); // Le tableau de dépendances [newArrivals] indique que l'effet doit être exécuté à chaque fois que newArrivals change. Cela garantit que les boutons de défilement sont mis à jour lorsque les nouveaux produits sont récupérés depuis l'API.
  
  return (
    <section className="py-16 px-4 lg:px-0 no-scrollbar">
      <div className="container mx-auto text-center mb-10 relative"> 
        <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
        <p className="text-lg text-gray-600 mb-8">             
          Discover the latest styles straight off the runway freshly added to
          keep your wardrobe on the cutting edge of fashion.
        </p>

        {/* Scrolls Buttons */}
        <div className="absolute right-0 bottom-[-30px] flex space-x-2"> 
          <button
            onClick={() => scroll("left")}                      // Au clic sur le bouton on appelle la fonction scroll avec la direction "left" pour faire défiler le contenu vers la gauche.
            disabled={!canScrollLeft}                           // Le bouton est désactivé si l'utilisateur ne peut pas faire défiler le contenu vers la gauche. "!" est utilisé pour inverser la valeur de canScrollLeft. Si canScrollLeft est false, le bouton sera désactivé.
            className={`p-2 rounded border ${                   // Ici on applique des classes conditionnelles pour le style du bouton en fonction de la possibilité de défiler vers la gauche ou la droite. Si canScrollLeft est true, le bouton aura un fond blanc et du texte noir, sinon il aura un fond gris clair et du texte gris clair avec un curseur non autorisé.
              canScrollLeft
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={() => scroll("right")}                   // Au clic sur le bouton on appelle la fonction scroll avec la direction "right" pour faire défiler le contenu vers la droite.
            className={`p-2 rounded border ${
              canScrollRight
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        ref={scrollRef}                      // Ici on attache la référence au défileur du conteneur . Car plus haut on a créé l'option "scrollRef" pour cheker la référence et accéder aux propriétés de défilement du conteneur.
        className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${
          isDragging ? "cursor-grabbing" : "cursor-grab"}`} 
        onMouseDown={handleMouseDown}            // Ici on gère le début du glissement en utilisant l'événement onMouseDown. Lorsque l'utilisateur appuie sur le bouton de la souris, la fonction handleMouseDown est appelée.
        onMouseMove={handleMouseMove}          // Ici on gère le mouvement de la souris pendant le glissement en utilisant l'événement onMouseMove. Lorsque l'utilisateur déplace la souris tout en maintenant le bouton enfoncé, la fonction handleMouseMove est appelée.
        onMouseUp={handleMouseUpOrLeave}              // Ici on gère la fin du glissement en utilisant l'événement onMouseUp. Lorsque l'utilisateur relâche le bouton de la souris, la fonction handleMouseUp est appelée.
        onMouseLeave={handleMouseUpOrLeave}        // Ici on gère le cas où la souris quitte le conteneur pendant le glissement en utilisant l'événement onMouseLeave. Si l'utilisateur quitte le conteneur tout en maintenant le bouton de la souris enfoncé, la fonction handleMouseLeave est appelée.
     >
        {newArrivals.map((product) => (
          <div
            key={product._id}
            className="min-w-[100%] md:min-w-[50%] lg:min-w-[30%] relative"
          >
            <img
              src={product.images[0]?.url}
              alt={product.images[0]?.altText || product.name}
              className="w-full h-[500px] object-cover rounded-lg"
              draggable="false"                    // Pour empêcher le glissement de l'image lors du défilement horizontal.
            />
            <div
              className="absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white 
                p-4 rounded-b-lg"
            >
              <Link to={`/product/${product._id}`} className="block">
                <h4 className="font-medium">{product.name}</h4>
                <p className="mt-1">${product.price}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default NewArrivals;
