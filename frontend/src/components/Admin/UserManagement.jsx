import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "../../redux/slices/adminSlice";

const UserManagement = () => {                     // Ici, on crée un composant UserManagement qui gère la gestion des utilisateurs dans l'interface d'administration. Il permet à l'administrateur d'ajouter, de modifier et de supprimer des utilisateurs.
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth); // On récupère l'utilisateur connecté depuis le store Redux. En effet, on utilise le hook useSelector pour accéder à l'état de l'utilisateur dans le store Redux. L'utilisateur est stocké dans l'état du slice auth, qui est géré par le reducer authSlice.
  const { users, loading, error } = useSelector((state) => state.admin);  // On récupère les utilisateurs, le chargement et les erreurs depuis le store Redux. En effet, on utilise le hook useSelector pour accéder à l'état des utilisateurs dans le store Redux. Les utilisateurs sont stockés dans l'état du slice admin, qui est géré par le reducer adminSlice. Le chargement et les erreurs sont également stockés dans cet état.

  useEffect(() => {                                // On vérifie si l'utilisateur est connecté et s'il a le rôle d'administrateur. Si ce n'est pas le cas, on redirige l'utilisateur vers la page d'accueil.
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {                                // On vérifie si l'utilisateur est connecté et s'il a le rôle d'administrateur. Si c'est le cas, on récupère la liste des utilisateurs depuis le store Redux en dispatchant l'action fetchUsers.
    if (user && user.role === "admin") {
      dispatch(fetchUsers());                     // On dispatch l'action fetchUsers pour récupérer la liste des utilisateurs depuis le store Redux. Cette action est gérée par le reducer adminSlice, qui met à jour l'état des utilisateurs dans le store Redux.
    }
  }, [dispatch, user]);

  const [formData, setFormData] = useState({       // On initialise l'état du formulaire avec les données par défaut pour ajouter un nouvel utilisateur.
    name: "",                                      // Le nom de l'utilisateur est initialisé à une chaîne vide.
    email: "",           
    password: "",
    role: "customer", // Default role
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addUser(formData));

    // Reset the form after Submission
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "customer",
    });
  };

  const handleRoleChange = (userId, newRole) => {                   // On gère le changement de rôle d'un utilisateur. Cette fonction est appelée lorsque l'administrateur change le rôle d'un utilisateur dans la liste des utilisateurs.
    dispatch(updateUser({ id: userId, role: newRole }));            // On dispatch l'action updateUser avec l'ID de l'utilisateur et le nouveau rôle. Ainsi, on met à jour le rôle de l'utilisateur dans le store Redux. Cette action est gérée par le reducer adminSlice, qui met à jour l'état des utilisateurs dans le store Redux.
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {/* Add New User Form */}
      <div className="p-6 rounded-lg mb-6">
        <h3 className="text-lg font-bold mb-4">Add New User</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Add User
          </button>
        </form>
      </div>

      {/* User List Management */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                  {user.name}
                </td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default UserManagement;
