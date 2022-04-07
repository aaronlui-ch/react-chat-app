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
  updateDoc,
  addDoc,
  Timestamp,
  doc,
  orderBy,
  getDoc,
  getDocs,
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
  const [matchRD, setMatchRD] = useState(1);

  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 720 ? true : false
  );

  //choose the screen size
  const handleResize = () => {
    if (window.innerWidth < 720) return setIsMobile(true);
    return setIsMobile(false);
  };

  // create an event listener
  useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

  const fetchUsers = () => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
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

          users.sort(function (a, b) {
            return b.isOnline - a.isOnline;
          });
          setUserList((prev) => users);
        });
      }
    });
  };

  const selectUser = async (userInfo) => {
    setChat((prevState) => userInfo);
    const targetUser = userInfo.uid;
    const fromUser = user.uid;
    let id =
      user > targetUser
        ? `${fromUser + targetUser}`
        : `${targetUser + fromUser}`;
    //find match len
    var len;
    const docRef = collection(db, "messages", id, "chat");
    // const docSnap = await getDocs(docRef).then((res) => {
    //   console.log("SelectUserres", res.docs.length);

    //   len = res.docs.length;

    //   setMatchRD(len);
    // });

    const q = query(docRef);

    onSnapshot(q, (querySnapshot) => {
      let messages = [];

      querySnapshot.forEach((doc) => {
        messages.push(doc.data());
      });

      console.log("bew len", messages);
      setMatchRD((prev) => messages.length);
    });
  };

  const displayMsgs = () => {
    const targetUser = chat.uid;
    const fromUser = user.uid;
    let id =
      user > targetUser
        ? `${fromUser + targetUser}`
        : `${targetUser + fromUser}`;

    let len = matchRD;
    const msgRef = collection(
      db,
      "messages",
      id,
      "chat",
      `match${len == 0 ? len + 1 : len}`,
      "playerSelection"
    );

    //display from old to new ,top to bot
    const q = query(msgRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let messages = [];

      querySnapshot.forEach((doc) => {
        messages.push(doc.data());
      });

      console.log(messages);

      setMsgs((prev) => messages);
    });
  };

  useEffect(() => {
    displayMsgs();
  }, [matchRD]);

  const handleSubmit = async (selection, msglen) => {
    const fromUser = user.uid;
    const targetUser = chat.uid;
    let id =
      user > targetUser
        ? `${fromUser + targetUser}`
        : `${targetUser + fromUser}`;

    //find match len
    var len;
    const docRef = collection(db, "messages", id, "chat");
    const docSnap = await getDocs(docRef).then((res) => {
      console.log("res", res.docs.length);

      len = res.docs.length;
    });

    //check which match to play

    let match = [];
    const querySnapshot = await getDocs(collection(db, "messages", id, "chat"));
    querySnapshot.forEach((doc) => {
      match.push(doc.data());
      //   console.log(doc.id, " => ", doc.data());
    });
    console.log("newmat", match);
    let matchLen = match.length - 1;
    let isPlayed;
    try {
      let isPlayed = match[matchLen].hasOwnProperty(fromUser);
    } catch (err) {
      isPlayed = false;
    }
    console.log("isPlayed", isPlayed);

    console.log("fromuser", fromUser);
    try {
      const fetch = setDoc(
        doc(
          db,
          "messages",
          id,
          "chat",
          `match${len == 0 ? len + 1 : len}`,
          "playerSelection",
          fromUser
        ),
        {
          selection,
          from: fromUser,
          to: targetUser,
          createdAt: Timestamp.fromDate(new Date()),
        }
      );

      toast.promise(fetch, {
        pending: "Pending..",
        success: "Submited 👌",
        error: "Some error...",
      });

      const res = await fetch;

      let isReveal = msglen == 1 ? true : false;
      var matchInfo = {};
      matchInfo.winner = null;
      matchInfo.reveal = isReveal;
      matchInfo[fromUser] = true;

      console.log("matchInfoobj", matchInfo);

      await setDoc(
        doc(db, "messages", id, "chat", `match${len == 0 ? len + 1 : len}`),
        matchInfo
      );
    } catch (err) {
      console.log(err);
    }
  };

  const createNewMatch = async () => {
    const fromUser = user.uid;
    const targetUser = chat.uid;
    let id =
      user > targetUser
        ? `${fromUser + targetUser}`
        : `${targetUser + fromUser}`;

    let id2 = uid(id);
    var len;

    const docRef = collection(db, "messages", id, "chat");
    const docSnap = await getDocs(docRef).then((res) => {
      console.log("fromCreateNewmatch", res.docs.length);

      len = res.docs.length;
    });

    try {
      await setDoc(doc(db, "messages", id, "chat", `match${len + 1}`), {
        winner: null,
        reveal: false,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getMatchinfo = async (id) => {
    try {
      const msgRef = collection(db, "messages", id, "chat");

      const q = query(msgRef);
      let messages = [];

      await onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          messages.push(doc.data());
        });
      });

      return messages;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();

    // test();
  }, []);
  return (
    <>
      <Nav signout={<Signout />} user={user} />

      <div className="container-fluid bg">
        <div className="row ">
          <div
            className={`col-lg-3 col-12 mx-0 px-0 rightLine  ${
              isMobile ? "displayWebkit horizScroll" : ""
            } `}
          >
            {userList.length > 0
              ? userList.map((onlineUser, i) => (
                  <Userlist user={onlineUser} key={i} selectUser={selectUser} />
                ))
              : "Loading..."}
          </div>

          <div className="col-lg-9 col-12" style={{ minHeight: "80vh" }}>
            {chat.name ? (
              <ChatSection
                user={chat}
                handleSubmit={handleSubmit}
                responeMsgs={msgs}
                createNewMatch={createNewMatch}
                selectUser={selectUser}
                currentUser={user}
                setMatchRD={setMatchRD}
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
