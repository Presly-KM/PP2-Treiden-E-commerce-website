import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage";
import ProductDetails from "./components/Products/ProductDetails";
import Checkout from "./components/Cart/Checkout";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminLayout from "./components/Admin/AdminLayout"; // Importing the AdminLayout component for admin routes
import AdminHomePage from "./pages/AdminHomePage";
import UserManagement from "./components/Admin/UserManagement";
import ProductManagement from "./components/Admin/ProductManagement"; // Importing the ProductManagement component for managing products in the admin panel
import EditProductPage from "./components/Admin/EditProductPage";
import OrderManagement from "./components/Admin/OrderManagement"; // Importing the OrderManagement component for managing orders in the admin panel
import {Provider } from "react-redux";
import store from "./redux/store"; // Importing the Redux store for state management
const App = () => {
  return (
    <Provider store={store}>                                     {/* On utilise le Provider de Redux pour fournir le store à l'ensemble de l'application. Cela permet à tous les composants de l'application d'accéder au store et de se connecter aux données qu'il contient. */}
    <BrowserRouter>                                              {/* On utilise BrowserRouter pour gérer les routes. Les routes servent à naviguer entre différentes pages de l'application. Par exemple on pourrait avoir une route pour la page d'accueil, une autre pour la page de contact, etc. */}
      <Toaster position="top-right"/>                            {/* Toaster est utilisé pour afficher des notifications à l'utilisateur. Par exemple, lorsqu'une action réussit ou échoue, une notification peut être affichée pour informer l'utilisateur. */}
      <Routes>
         <Route path="/" element={<UserLayout/>}>                { /* La route "/" correspond à la page d'accueil de l'application. Le composant UserLayout sera affiché lorsque l'utilisateur visitera cette page. */}
         <Route index element={<Home />} />                      {/* La route index correspond à la page d'accueil de l'application. Elle est généralement utilisée pour afficher le contenu principal de l'application. */}
         <Route path="login" element={<Login />} />              {/* La route "login" correspond à la page de connexion de l'application. Lorsque l'utilisateur visitera cette page, le composant Login sera affiché. */}
          <Route path="register" element={<Register />} />       {/* La route "register" correspond à la page d'inscription de l'application. Le composant Register est utilisé ici, mais il pourrait être remplacé par un composant d'inscription spécifique. */}
          <Route path="profile" element={<Profile />} />         {/* La route "profile" correspond à la page de profil de l'utilisateur. Le composant Profile sera affiché lorsque l'utilisateur visitera cette page. */}
          <Route path="collections/:collection" element={<CollectionPage />} /> {/* La route "collections/:collection" correspond à une page de collection spécifique. Le paramètre ":collection" est dynamique et peut être remplacé par le nom d'une collection spécifique. Le composant CollectionPage sera affiché lorsque l'utilisateur visitera cette page. */}
          <Route path="product/:id" element={<ProductDetails />} /> {/* La route "product/:id" correspond à une page de détails d'un produit spécifique. Le paramètre ":id" est dynamique et peut être remplacé par l'identifiant d'un produit spécifique. Le composant ProductDetails sera affiché lorsque l'utilisateur visitera cette page. */}
          <Route path="checkout" element={<Checkout />} />       {/* La route "checkout" correspond à la page de paiement. Le composant Checkout sera affiché lorsque l'utilisateur visitera cette page. */}
          <Route path="order-confirmation" element={<OrderConfirmationPage />} /> {/* La route "order-confirmation" correspond à la page de confirmation de commande. Le composant OrderConfirmationPage sera affiché lorsque l'utilisateur visitera cette page. */}
          <Route path="order/:id" element={<OrderDetailsPage />} /> {/* La route "order/:id" correspond à une page de détails d'une commande spécifique. Le paramètre ":id" est dynamique et peut être remplacé par l'identifiant d'une commande spécifique. Le composant OrderDetailsPage sera affiché lorsque l'utilisateur visitera cette page. */}
          <Route path="my-orders" element={<MyOrdersPage />} /> {/* La route "my-orders" correspond à la page des commandes de l'utilisateur. Le composant MyOrdersPage sera affiché lorsque l'utilisateur visitera cette page. */}
         </Route>
          <Route path="/admin" element={<AdminLayout />}> 
          <Route index element={<AdminHomePage />} /> {/* La route index de l'admin correspond à la page d'accueil de l'administration. Le composant AdminHomePage sera affiché lorsque l'utilisateur visitera cette page. */}
           <Route path="users" element={<UserManagement />} /> {/* La route "users" correspond à la page de gestion des utilisateurs de l'administration. Le composant UserManagement sera affiché lorsque l'utilisateur visitera cette page. */} 
           <Route path="products" element={<ProductManagement />} /> {/* La route "products" correspond à la page de gestion des produits de l'administration. Le composant ProductManagement sera affiché lorsque l'utilisateur visitera cette page. */}
           <Route path="products/:id/edit" element={<EditProductPage />} /> {/* La route "products/:id/edit" correspond à la page d'édition d'un produit spécifique. Le paramètre ":id" est dynamique et peut être remplacé par l'identifiant d'un produit spécifique. Le composant EditProductPage sera affiché lorsque l'utilisateur visitera cette page. */}
           <Route path="orders" element={<OrderManagement />} /> {/* La route "orders" correspond à la page de gestion des commandes de l'administration. Le composant OrderManagement sera affiché lorsque l'utilisateur visitera cette page. */}
          </Route>
      </Routes>
    </BrowserRouter>
    </Provider>
  );
};
export default App;
