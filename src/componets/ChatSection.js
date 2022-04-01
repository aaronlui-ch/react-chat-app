import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useRef, useEffect } from "react";
import Messages from "./Messages";

export default function ChatSection({ user, handleSubmit, responeMsgs }) {
  const [selection, setSelection] = useState(null);
  const myRef = useRef();

  const notify = (option) => toast(`You selected ${option}!`);

  const handleSelect = (option) => {
    setSelection(option);
    notify(option);
  };

  const scrollToRef = () =>
    myRef.current.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    myRef.current.scrollIntoView({ behavior: "smooth" });
  }, [responeMsgs]);

  return (
    <div className="">
      <div className="borderBot">
        <h4 className="my-2"> {user.name}</h4>
      </div>
      <div className="chatHistory " style={{ height: "70vh" }}>
        {responeMsgs.length
          ? responeMsgs.map((msg, i) => <Messages msg={msg} key={i} />)
          : "No histoy"}
        　<div ref={myRef}></div>
      </div>
      <div className=" ">
        <div className="centerdiv optionSelect">
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
              handleSelect("stone");
            }}
          >
            ✊
          </p>
        </div>

        <button
          onClick={(e) => {
            handleSubmit(selection);
            setTimeout(() => scrollToRef(), 500);
          }}
        >
          Submit
        </button>
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
