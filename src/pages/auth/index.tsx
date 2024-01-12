import { useState, useEffect } from "react";
import { authFirebase } from "../../firebaseData";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

import { useDispatch, useSelector } from "react-redux";
import { decrement, increment, setUserData } from "../../stores/reducer";
import type { RootState } from "../../stores/store";

export default function Main() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const dispatch = useDispatch();

  const aut = async () => {
    signInWithEmailAndPassword(authFirebase, email, password)
      .then((userCredential) => {
        // Signed in
        const { displayName, email, emailVerified, photoURL } = userCredential.user;
        dispatch(setUserData({ user: { displayName, email, emailVerified, photoURL } }));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("SIGN ERR CODE", errorCode);
        console.log("SIGN ERR CODE", errorMessage);
      });
  };

  const reg = async () => {
    await createUserWithEmailAndPassword(authFirebase, email, password)
      .then((userCredential) => {
        const { displayName, email, emailVerified, photoURL } = userCredential.user;
        dispatch(setUserData({ user: { displayName, email, emailVerified, photoURL } }));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("REG ERR CODE", errorCode);
        console.log("REG ERR", errorMessage);
      });
  };

  return (
    <div>
      <div>
        <label htmlFor="email">Email address</label>
        <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email address" />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" />
      </div>

      <button type="submit" onClick={reg}>
        Регистрация
      </button>

      <button type="submit" onClick={aut}>
        Авторизация
      </button>
    </div>
  );
}
