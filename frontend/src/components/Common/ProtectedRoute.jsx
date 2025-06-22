import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {               // Ici, on utilise un composant ProtectedRoute qui prend en paramètre les enfants (children) et un rôle optionnel (role). Ce composant est utilisé pour protéger certaines routes de l'application en vérifiant si l'utilisateur est connecté et s'il a le rôle requis. Si l'utilisateur n'est pas connecté ou n'a pas le rôle requis, il sera redirigé vers la page de connexion.
  const { user } = useSelector((state) => state.auth);         // On utilise le hook useSelector pour accéder à l'état de l'utilisateur dans le store Redux. L'utilisateur est stocké dans l'état du slice auth, qui est géré par le reducer authSlice. Ainsi, on peut vérifier si l'utilisateur est connecté et s'il a le rôle requis pour accéder à la route protégée.

  if (!user || (role && user.role !== role)) {                 // On vérifie si l'utilisateur n'est pas connecté (user est null ou undefined) ou si un rôle est spécifié et que l'utilisateur n'a pas ce rôle. Si l'utilisateur n'est pas connecté ou n'a pas le rôle requis, on le redirige vers la page de connexion.
    return <Navigate to="/login" replace />;                   // On utilise le composant Navigate de react-router-dom pour rediriger l'utilisateur vers la page de connexion. L'attribut replace est utilisé pour remplacer l'entrée actuelle dans l'historique de navigation, ce qui signifie que l'utilisateur ne pourra pas revenir en arrière à la page protégée après avoir été redirigé vers la page de connexion.
  }

  return children;
};
export default ProtectedRoute;
