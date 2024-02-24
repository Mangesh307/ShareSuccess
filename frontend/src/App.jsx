import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components";
import { Toaster } from "react-hot-toast";
import {
  Authors,
  AuthorsPost,
  CategoryPosts,
  CreatePost,
  DashBoard,
  DeletePost,
  EditPost,
  ErrorPage,
  Home,
  Login,
  Logout,
  PostDetail,
  Profile,
  Signup,
} from "./pages";
import "./index.css";
import UserProvider from "./context/userContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <UserProvider>
        <Layout />
      </UserProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <Signup /> },
      { path: "login", element: <Login /> },
      { path: "authors", element: <Authors /> },
      { path: "create", element: <CreatePost /> },
      { path: "profile/:id", element: <Profile /> },
      { path: "posts/:id", element: <PostDetail /> },
      { path: "posts/categories/:category", element: <CategoryPosts /> },
      { path: "posts/users/:id", element: <AuthorsPost /> },
      { path: "myposts/:id", element: <DashBoard /> },
      { path: "posts/:id/edit", element: <EditPost /> },
      { path: "posts/:id/delete", element: <DeletePost /> },
      { path: "logout", element: <Logout /> },
    ],
  },
]);

const App = () => {
  return (
    <>
      <Toaster position="top-center" />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
