import { Link } from "react-router-dom";
import type { routeType } from "../App";
import "./main.css";

const card = (data: routeType) => {
  return (
    <Link to={data.path} className="card">
      <div className="card__img">
        <img src={require(`../img/${data.img}`)} alt={data.img.split(".")[0]} />
      </div>
      <div className="card__descr">
        <div className="card__descr_wrap">
          <span>{data.name}</span>
          <p>{data.game}</p>
        </div>
      </div>
    </Link>
  );
};

export default function Main({ routes }: { routes: routeType[] }) {
  return (
    <section>
      <div className="games_wrap">
        {routes.map((item: routeType) => card(item))}
        <div className="card">
          <div className="card__img">
            <img src={require(`../img/skoro.png`)} alt="skoro" />
          </div>
          <div className="card__descr">
            <div className="card__descr_wrap">
              <span>Скоро</span>
              <p>Что-то будет</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// import {useState, useEffect } from 'react';
// import { authFirebase } from '../firebaseData';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// import { useDispatch, useSelector } from 'react-redux';
// import {decrement, increment} from '../stores/reducer'
// import type { RootState } from '../stores/store'

// const [email, setEmail] = useState('')
// const [password, setPassword] = useState('');

// const aut = async (e:any) => {
//   e.preventDefault()
//   signInWithEmailAndPassword(authFirebase, email, password)
//     .then((userCredential) => {
//       // Signed in
//       const user = userCredential.user;
//       console.log('SIGN SUC')
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       console.log('SIGN ERR CODE', errorCode)
//       console.log('SIGN ERR CODE', errorMessage)
//     });

// }

// const reg = async (e:any) => {
//   e.preventDefault()
//   await createUserWithEmailAndPassword(authFirebase, email, password)
//     .then((userCredential) => {
//       const user = userCredential.user;
//       console.log('REG SUC')
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       console.log('REG ERR CODE', errorCode)
//       console.log('REG ERR', errorMessage)
//     });

// }

// const handleLogout = () => {
//     signOut(authFirebase).then(() => {
//     // Sign-out successful.
//         console.log("ВЫХОД ИЗ СИСТЕМЫ")
//     }).catch((error: string) => {
//     // An error happened.
//     });
// }

// return (
//   <div>
//     <form>
//       <div>
//           <label htmlFor="email-address">Email address</label>
//           <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               placeholder="Email address"
//           />
//       </div>

//       <div>
//           <label htmlFor="password">Password</label>
//           <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               placeholder="Password"
//           />
//       </div>

//       <button type='submit' onClick={reg}>
//           Регистрация
//       </button>

//       <button type='submit' onClick={aut}>
//           Авторизация
//       </button>

//     </form>
//     <button onClick={handleLogout}>
//       Logout
//     </button>
//   </div>
// )
