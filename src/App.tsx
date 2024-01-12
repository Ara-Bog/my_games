// import {useState, useEffect } from 'react';
// import { authFirebase } from './firebaseData';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./compoments/Header";
import Zonk from "./pages/zonk/index";
import Auth from "./pages/auth/index";
import Profile from "./pages/profile/index";
import Main from "./main";
import "./App.css";

export type routeType = {
  path: string;
  element: React.ReactElement;
  name: string;
  game: string;
  img: string;
};

export type gameSettings = {
  difficulty: "easy" | "mid" | "hard";
  continue: boolean;
};

const routesList: routeType[] = [
  {
    path: "/zonk",
    element: <Zonk />,
    name: "Зонк",
    game: "Kingdom Come: Deliverance",
    img: "zonk.jpg",
  },
];

export default function App() {
  return (
    <>
      <Router>
        <Header routes={routesList} />
        <Routes>
          <Route path="/" element={<Main routes={routesList} />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          {routesList.map((item) => (
            <Route path={item.path} element={item.element} />
          ))}
        </Routes>
      </Router>
    </>
  );
}
