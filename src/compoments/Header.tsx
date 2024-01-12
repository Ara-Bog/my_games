import { useDispatch, useSelector } from "react-redux";
import { decrement, increment, setUserData } from "../stores/reducer";
import type { RootState } from "../stores/store";
import { Link } from "react-router-dom";
import type { routeType } from "../App";
import { useEffect, useState } from "react";

import { signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { authFirebase } from "../firebaseData";

const DEFAULT_PHOTO = process.env.PUBLIC_URL + "/user_def.png";

export default function Header({ routes }: { routes: routeType[] }) {
  const count = useSelector((state: RootState) => state.value);
  const currentUser = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    signOut(authFirebase)
      .then(() => {
        console.log("ВЫХОД ИЗ СИСТЕМЫ");
        dispatch(setUserData({ user: null }));
      })
      .catch((error: string) => {});
  };

  return (
    <section>
      <Link to={"/"}>Главная</Link>
      {routes.map((item) => (
        <Link to={item.path}>Зонк</Link>
      ))}
      <div style={{ display: "flex", marginLeft: "auto" }}>
        {currentUser === null ? (
          <Link to={"/auth"}>Войти</Link>
        ) : (
          <div>
            <Link to={"/profile"} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <img style={{ width: 50, height: 50 }} src={currentUser.photoURL || DEFAULT_PHOTO} alt="user-logo" />
              <span>{currentUser.displayName || currentUser.email}</span>
            </Link>
            <input type="button" onClick={handleLogout} value="Выйти" />
          </div>
        )}
        {/* <p>Counter: {count}</p>
        <button onClick={() => dispatch(increment())}>Increment</button>
        <button onClick={() => dispatch(decrement())}>Decrement</button> */}
      </div>
    </section>
  );
}
