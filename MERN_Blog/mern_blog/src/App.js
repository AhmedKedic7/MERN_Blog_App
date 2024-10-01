import './App.css';
import Header from './Header';
import Layout from './Layout';
import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import Post from "./Post";
import {Route, Routes} from "react-router-dom";
import { UserContextProvider } from './userContext';
import CreatePage from './pages/createPage';
import PostPage from './pages/postPage';
import EditPage from './pages/editPage';

function App() {
  return (
    <UserContextProvider>
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={
          <HomePage/>
        }/>
        <Route path={'/login'} element={
          <LoginPage/>
        }/>
        <Route path={'/register'} element={
          <RegisterPage/>
        }/>
        <Route path={'/create'} element ={
          <CreatePage/>
        }/>
        <Route path={'/post/:id'} element ={
          <PostPage/>
        }/>
        <Route path={'/edit/:id'} element ={
          <EditPage/>
        }/>
      </Route>
    </Routes>
    </UserContextProvider>
  );
}

export default App;
