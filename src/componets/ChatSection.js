import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useRef, useEffect } from "react";
import Messages from "./Messages";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { db } from "../firebase";
export default function ChatSection({
  user,
  handleSubmit,
  responeMsgs,
  createNewMatch,
  selectUser,
  currentUser,
}) {
  const [selection, setSelection] = useState(null);

  const [isUserSelect, setIsUserSelect] = useState(false);

  const [matchEnd, setMatchEnd] = useState(false);
  const [chatReset, setChatReset] = useState(false);
  const [result, setResult] = useState("");
  const myRef = useRef();

  const notify = (option) => toast(`You selected ${option}!`);

  const handleSelect = (option) => {
    setSelection(option);
    notify(option);
  };

  const scrollToRef = () =>
    myRef.current.scrollIntoView({ behavior: "smooth" });

  const submit = () => {
    if (selection) return handleSubmit(selection, responeMsgs.length);

    return alert("You need to make selection!");
  };

  useEffect(() => {
    myRef.current.scrollIntoView({ behavior: "smooth" });
  }, [responeMsgs]);

  useEffect(() => {
    if (responeMsgs.length % 2 == 0 && responeMsgs.length > 0)
      return setMatchEnd(true);

    return setMatchEnd(false);
  }, [responeMsgs]);

  const choicesObject = {
    rock: {
      rock: "draw",
      scissors: "win",
      paper: "lose",
    },
    scissors: {
      rock: "lose",
      scissors: "draw",
      paper: "win",
    },
    paper: {
      rock: "win",
      scissors: "lose",
      paper: "draw",
    },
  };

  const checkerResult = (userChoice, oppChoice) => {
    var choices = ["rock", "paper", "scissors"];

    let result;

    switch (choicesObject[userChoice][oppChoice]) {
      case "win":
        result = "YOU WIN";
        break;
      case "lose":
        result = "YOU LOSE";
        break;
      default:
        result = "DRAW";
        break;
    }
    console.log(result);
    setResult(result);
  };

  useEffect(() => {
    if (responeMsgs.length == 2) {
      let userChoice =
        responeMsgs[0].from == currentUser.uid
          ? responeMsgs[0].selection
          : responeMsgs[1].selection;
      let oppChoice =
        responeMsgs[0].from == currentUser.uid
          ? responeMsgs[1].selection
          : responeMsgs[0].selection;

      console.log("userChoice", userChoice);

      checkerResult(userChoice, oppChoice);
    }

    if (responeMsgs.length == 0) {
      setResult("");
      setIsUserSelect(false);
    }
  }, [responeMsgs.length]);

  return (
    <div className="">
      <div className="borderBot">
        <h4 className="my-2"> {user.name}</h4>
      </div>
      <div className="chatHistory " style={{ height: "60vh" }}>
        {responeMsgs.length
          ? responeMsgs.map((msg, i) => (
              <Messages
                msg={msg}
                key={i}
                setIsUserSelect={setIsUserSelect}
                len={responeMsgs.length}
              />
            ))
          : "Make your selection!"}
        {result && result}
        <br /> <br />
        {matchEnd ? (
          <button
            onClick={() => {
              createNewMatch();
            }}
          >
            click to start new match
          </button>
        ) : (
          ""
        )}
        　<div ref={myRef}></div>
      </div>
      <div className=" ">
        <div className="centerdiv optionSelect">
          {!isUserSelect && (
            <>
              <p
                onClick={() => {
                  handleSelect("paper");
                }}
              >
                🖐
              </p>
              <p
                onClick={() => {
                  handleSelect("scissors");
                }}
              >
                ✌
              </p>
              <p
                onClick={() => {
                  handleSelect("rock");
                }}
              >
                ✊
              </p>
            </>
          )}
        </div>

        {!isUserSelect && (
          <button
            className="mb-4 mt-n2"
            onClick={(e) => {
              submit();
              setTimeout(() => scrollToRef(), 500);
            }}
          >
            Submit
          </button>
        )}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
}
