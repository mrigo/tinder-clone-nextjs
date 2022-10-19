import Head from "next/head";
import { useEffect, useState } from "react";
import * as dayjs from "dayjs";
import * as _ from "lodash";
import styles from "../styles/Home.module.css";
import { onValue } from "firebase/database";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { chatsRef, writeMessageOnChat } from "../services/database";
import { auth } from "../services/firebaseConfig";

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [credentials, setCredentials] = useState({
    email: "testprova@prova.it",
    password: "testlogin",
  });
  const [user, setUser] = useState(undefined);

  const updateMessages = (res) => {
    setMessages(_.orderBy(res, ["dateObj"], ["asc"]));
  };

  const writeOnDb = async () => {
    await writeMessageOnChat(user.email, text);
    setText("");
  };

  useEffect(() => {
    // Realtime database
    onValue(chatsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (!data) {
          return;
        }
        const res = Object.keys(data).map((id) => {
          return {
            ...data[id],
            dateObj: dayjs(data[id].date).toDate(),
            date: dayjs(data[id].date).format("DD/MM/YYYY HH:mm"),
          };
        });
        updateMessages(res);
      } catch (error) {
        console.log(error);
      }
    });

    // Auth state change
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(user);
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);

  const getMessagesList = () => {
    return (
      <div>
        <ul style={{ listStyle: "none" }}>
          {messages &&
            messages.map((m, index) => {
              return (
                <li key={index}>
                  <span style={{ fontFamily: "Courier" }}>{m.date}</span>{" "}
                  <b>{m.username}:</b> {m.message}
                </li>
              );
            })}
        </ul>
      </div>
    );
  };

  const userRegistration = async () => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      if (userCredentials) {
        setUser(userCredentials.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const userLogin = async () => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      if (userCredentials) {
        setUser(userCredentials.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const userLogout = async () => {
    try {
      await signOut(auth);
      setUser(undefined);
      setCredentials({ email: undefined, password: undefined });
    } catch (error) {
      console.log(error);
    }
  };

  const getLoginForm = () => {
    return (
      <form
        id="auth-form"
        style={{
          width: "50%",
        }}
        action="#"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <b>Email</b>
          <input
            type="text"
            value={credentials.email}
            onChange={(event) =>
              setCredentials({
                ...credentials,
                email: event.target.value,
              })
            }
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <b>Password</b>
          <input
            type="password"
            value={credentials.password}
            onChange={(event) =>
              setCredentials({
                ...credentials,
                password: event.target.value,
              })
            }
          />
        </div>
        <button
          disabled={!credentials.email || !credentials.password}
          onClick={userLogin}
        >
          Login
        </button>
        <button
          disabled={!credentials.email || !credentials.password}
          onClick={userRegistration}
        >
          Registration
        </button>
      </form>
    );
  };

  const getForm = () => {
    return (
      <form
        id="message-form"
        style={{
          width: "50%",
        }}
        action="#"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <b>Username</b>
          <input type="text" value={user.email} disabled />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <b>Text</b>
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </div>
        <button disabled={!text || !user.email} onClick={writeOnDb}>
          Send
        </button>
        <button onClick={userLogout}>Logout</button>
      </form>
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Tinder Clone</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Tinder Clone</h1>
        {user && (
          <>
            {getMessagesList()}
            {getForm()}
          </>
        )}
        {!user && getLoginForm()}
      </main>
    </div>
  );
};

export default Home;
