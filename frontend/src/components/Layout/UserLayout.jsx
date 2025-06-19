import { Outlet } from "react-router-dom";
import Footer from "../Common/Footer";
import Header from "../Common/Header";

const UserLayout = () => {
  return (
    <>
      {/* Header */}
      <Header />
      {/* Main Content */}
      <main>
        <Outlet />                              {/* Outlet est utilisé pour afficher le contenu des routes imbriquées. Les routes imbriquées sont des routes qui sont définies à l'intérieur d'une autre route. Par exemple, si vous avez une route pour la page d'accueil et une autre pour la page de contact, vous pouvez utiliser Outlet pour afficher le contenu de ces pages à l'intérieur du composant UserLayout. Ici, Hero.jsx est un exemple de contenu qui sera affiché dans l'Outlet. Sans Oulet, Hero.jsx ne s'affiche pas*/}    
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default UserLayout;
