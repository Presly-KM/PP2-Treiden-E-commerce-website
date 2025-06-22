import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import login from "../assets/login.webp";
import { loginUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();                 // Ci-contre, on utilise useNavigate pour naviguer vers une autre page après la connexion. En effet, useNavigate est un hook de React Router qui permet de naviguer vers une autre page de l'application. Par exemple, si l'utilisateur se connecte avec succès, on peut utiliser navigate("/checkout") pour rediriger l'utilisateur vers la page de paiement. Cela permet de gérer la navigation dans l'application de manière dynamique en fonction des actions de l'utilisateur.
  const location = useLocation();                 // Ci-contre, on utilise useLocation pour obtenir l'URL actuelle. En effet, useLocation est un hook de React Router qui permet d'accéder à l'objet location, qui contient des informations sur l'URL actuelle, y compris les paramètres de requête. Cela nous permet de récupérer le paramètre "redirect" de l'URL pour rediriger l'utilisateur après la connexion. Par exemple, si l'URL actuelle est "/login?redirect=/checkout", on peut utiliser useLocation pour obtenir l'objet location et ensuite extraire le paramètre "redirect" de l'URL. Cela nous permet de rediriger l'utilisateur vers la page de paiement après la connexion, si nécessaire.
  const { user, guestId, loading } = useSelector((state) => state.auth); // Ici, on utilise useSelector pour accéder à l'état de l'utilisateur connecté, de l'ID invité et de l'état de chargement dans le store Redux. En effet, useSelector est un hook de React Redux qui permet d'accéder à l'état du store Redux. On utilise useSelector pour récupérer les informations sur l'utilisateur connecté, l'ID invité (guestId) et l'état de chargement (loading) depuis le slice authSlice. Cela nous permet de gérer l'état de connexion de l'utilisateur et d'afficher des messages appropriés en fonction de l'état de chargement ou de la présence d'un utilisateur connecté. state.auth est le slice Redux qui gère l'authentification de l'utilisateur, et il contient des informations sur l'utilisateur connecté, l'ID invité et l'état de chargement de la connexion. State.auth est un objet qui contient les propriétés user, guestId et loading, qui sont utilisées pour gérer l'état de connexion de l'utilisateur dans l'application. 
  const { cart } = useSelector((state) => state.cart);                   // Ici, on utilise useSelector pour accéder à l'état du panier dans le store Redux. En effet, useSelector est un hook de React Redux qui permet d'accéder à l'état du store Redux. On utilise useSelector pour récupérer les informations sur le panier depuis le slice cartSlice. Cela nous permet de gérer l'état du panier dans l'application et d'afficher les produits du panier à l'utilisateur. state.cart est le slice Redux qui gère le panier de l'utilisateur, et il contient des informations sur les produits ajoutés au panier, la quantité de chaque produit, etc. State.cart est un objet qui contient la propriété products, qui est un tableau d'objets représentant les produits ajoutés au panier. Chaque objet produit contient des informations telles que l'ID du produit, le nom, la quantité, la taille, la couleur, etc.

  // Get redirect parameter and check if it's checkout or something
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";  // Ici, on utilise URLSearchParams pour extraire le paramètre "redirect" de l'URL. Si le paramètre "redirect" n'est pas présent, on utilise "/" comme valeur par défaut. Cela permet de rediriger l'utilisateur vers la page de paiement ou la page d'accueil après la connexion, en fonction de l'URL actuelle. Par exemple, si l'URL actuelle est "/login?redirect=/checkout", on peut utiliser URLSearchParams pour obtenir le paramètre "redirect" et rediriger l'utilisateur vers la page de paiement après la connexion.
  const isCheckoutRedirect = redirect.includes("checkout");                      // Ici, on vérifie si le paramètre "redirect" contient "checkout". Si c'est le cas, cela signifie que l'utilisateur est redirigé vers la page de paiement après la connexion. On utilise cette information pour décider où rediriger l'utilisateur après la connexion. Par exemple, si l'utilisateur est redirigé vers la page de paiement, on peut utiliser navigate("/checkout") pour rediriger l'utilisateur vers la page de paiement après la connexion.

  useEffect(() => {                                          // Ici, on utilise useEffect pour exécuter une action après que le composant a été monté. Plus précisément, on utilise useEffect pour vérifier si l'utilisateur est connecté et s'il y a des produits dans le panier. Si l'utilisateur est connecté et qu'il y a des produits dans le panier, on fusionne le panier de l'invité avec celui de l'utilisateur connecté.
    if (user) {
      if (cart?.products.length > 0 && guestId) {            // Ici, on vérifie si l'utilisateur est connecté et s'il y a des produits dans le panier. Si c'est le cas, on fusionne le panier de l'invité avec celui de l'utilisateur connecté.
        dispatch(mergeCart({ guestId, user })).then(() => {  // Ici, on utilise l'action mergeCart pour fusionner le panier de l'invité avec celui de l'utilisateur connecté. Cette action est définie dans le slice cartSlice et permet de mettre à jour l'état du panier dans le store Redux en combinant les produits du panier de l'invité avec ceux de l'utilisateur connecté. 
          navigate(isCheckoutRedirect ? "/checkout" : "/");  // Ici, on utilise navigate pour rediriger l'utilisateur vers la page de paiement ou la page d'accueil après la fusion du panier. Si isCheckoutRedirect est vrai, on redirige vers "/checkout", sinon on redirige vers la page d'accueil ("/"). Cela permet de gérer la navigation de l'utilisateur après la connexion en fonction de l'état du panier et de l'URL actuelle.
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");    // Ici, on utilise navigate pour rediriger l'utilisateur vers la page de paiement ou la page d'accueil après la connexion, même s'il n'y a pas de produits dans le panier. Si isCheckoutRedirect est vrai, on redirige vers "/checkout", sinon on redirige vers la page d'accueil ("/"). Cela permet de gérer la navigation de l'utilisateur après la connexion en fonction de l'état du panier et de l'URL actuelle.
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);  // Ici, on utilise useEffect pour surveiller les changements dans les dépendances user, guestId, cart, navigate, isCheckoutRedirect et dispatch. Si l'une de ces dépendances change, la fonction de rappel sera exécutée. Cela permet de gérer la logique de redirection et de fusion du panier en fonction des changements dans l'état de l'utilisateur, du panier et des paramètres de navigation. Par exemple, si l'utilisateur se connecte ou se déconnecte, ou si le panier est mis à jour, la fonction de rappel sera exécutée pour gérer la redirection et la fusion du panier. la fonction de rappel marche de la manière suivante : si l'utilisateur est connecté, on vérifie s'il y a des produits dans le panier et un ID invité. Si c'est le cas, on fusionne le panier de l'invité avec celui de l'utilisateur connecté et on redirige vers la page de paiement ou la page d'accueil. Si l'utilisateur n'est pas connecté ou s'il n'y a pas de produits dans le panier, on redirige simplement vers la page de paiement ou la page d'accueil.

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));                     // Ici, on utilise dispatch pour envoyer l'action loginUser avec les informations d'identification de l'utilisateur (email et mot de passe) pour se connecter. Cette action est définie dans le slice authSlice et permet de mettre à jour l'état de l'utilisateur connecté dans le store Redux. On utilise e.preventDefault() pour empêcher le comportement par défaut du formulaire, qui est de recharger la page lors de la soumission. Cela permet de gérer la connexion de l'utilisateur de manière asynchrone sans recharger la page.
  };

  return (
    <div className="flex">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">Rabbit</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Hey there! 👋🏻</h2>
          <p className="text-center mb-6">
            Enter your username and password to Login.
          </p>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your email address"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            {loading ? "loading..." : "Sign In"}               {/* Ici, on utilise une condition pour afficher "loading..." si l'état de chargement est vrai, sinon on affiche "Sign In". Cela permet d'informer l'utilisateur que la connexion est en cours.*/}
          </button>
          <p className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}         // Ici, on utilise encodeURIComponent pour encoder le paramètre de redirection dans l'URL. Cela permet de s'assurer que l'URL est correctement formatée et que les caractères spéciaux sont correctement encodés. Par exemple, si le paramètre de redirection contient des espaces ou des caractères spéciaux, encodeURIComponent les encodera correctement pour éviter les problèmes d'URL.
              className="text-blue-500"
            >
              Register
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={login}
            alt="Login to Account"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
export default Login;
