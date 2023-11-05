/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import "./index.css";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
//import "firebase/analytics";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyApd8cZ7ACjq1FWfuzBQemE5pWVIYB7a6I",

  authDomain: "basechat-cc7fc.firebaseapp.com",

  projectId: "basechat-cc7fc",

  storageBucket: "basechat-cc7fc.appspot.com",

  messagingSenderId: "737547088111",

  appId: "1:737547088111:web:d8e6ce2f3d9b6ab4782b1a",

  measurementId: "G-4V0543HXC1",
});

const auth = firebase.auth();
const firestore = firebase.firestore();
//const analytics = firebase.analytics();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1 className="title">თბილისი ფორუმი</h1>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        შემო აბა ძმა!
      </button>
    </>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        მოვხიეთ ანუ?
      </button>
    )
  );
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="აქ უნდა ჩაწეროო! ✏️"
        />

        <button type="submit" disabled={!formValue}>
          ✈️
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div className="chat-message">
      <p className={`uid ${messageClass}`}>{messageClass === "received" ? uid : null}</p>
      <div className={`message ${messageClass}`}>
        <img src={photoURL} alt="User" />
        <p>{text}</p>
      </div>
    </div>
  );
}

export default App;
