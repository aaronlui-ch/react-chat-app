import React from "react";
import { useState, useEffect } from "react";
import Nav from "./Nav";
import { db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uid } from "react-uid";

import {
  onSnapshot,
  collection,
  query,
  where,
  setDoc,
  addDoc,
  Timestamp,
  doc,
  orderBy,
} from "firebase/firestore";
import Signout from "./Signout";
import { getFirestore } from "firebase/firestore";
import Userlist from "./Userlist";
import ChatSection from "./ChatSection";

export default function Userhome() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [userList, setUserList] = useState([]);
  const [chat, setChat] = useState({});
  const [msgs, setMsgs] = useState([]);

  const fetchUsers = () => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        const userRef = collection(db, "users");
        const q = query(
          userRef,
          where("uid", "not-in", [auth.currentUser.uid])
        );
        // execute query
        const unsub = onSnapshot(q, (querySnapshot) => {
          let users = [];
          querySnapshot.forEach((doc) => {
            users.push(doc.data());
          });
          console.log(users);
          setUserList((prev) => users);
        });
      }
    });
  };

  const selectUser = (userInfo) => {
    setChat((prevState) => {
      return userInfo;
    });
    console.log(chat);
    const targetUser = userInfo.uid;
    const fromUser = user.uid;
    let id =
      user > targetUser
        ? `${fromUser + targetUser}`
        : `${targetUser + fromUser}`;

    console.log(id);
    const msgRef = collection(db, "messages", id, "chat");

    //display from old to new ,top to bot
    const q = query(msgRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let messages = [];

      querySnapshot.forEach((doc) => {
        messages.push(doc.data());
      });

      console.log(messages);

      setMsgs(messages);
    });
  };

  const handleSubmit = async (selection) => {
    const fromUser = user.uid;
    const targetUser = chat.uid;
    let id =
      user > targetUser
        ? `${fromUser + targetUser}`
        : `${targetUser + fromUser}`;

    let id2 = uid(id);

    try {
      const fetch = addDoc(collection(db, "messages", id, "chat"), {
        selection,
        from: fromUser,
        to: targetUser,
        createdAt: Timestamp.fromDate(new Date()),
      });

      toast.promise(fetch, {
        pending: "Pending..",
        success: "Submited 👌",
        error: "Some error...",
      });

      const res = await fetch;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <>
      <Nav signout={<Signout />} user={user} />

      <div className="container-fluid ">
        <div className="row ">
          <div className="col-3 mx-0 px-0 rightLine   ">
            {userList.length > 0
              ? userList.map((onlineUser, i) => (
                  <Userlist user={onlineUser} key={i} selectUser={selectUser} />
                ))
              : "Loading..."}
          </div>

          <div className="col-9" style={{ minHeight: "80vh" }}>
            {chat.name ? (
              <ChatSection
                user={chat}
                handleSubmit={handleSubmit}
                responeMsgs={msgs}
              />
            ) : (
              <h4 className="my-2"> Select user to begin!</h4>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
