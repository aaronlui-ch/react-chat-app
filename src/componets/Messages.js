import React from "react";
import Moment from "react-moment";
import { useState } from "react";
export default function Messages({ msg }) {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("uid"));
  const [isFrom, setIsFrom] = useState(currentUser == msg.from ? true : false);
  const toDateTime = (secs) => {
    let t;
    t = new Date(secs * 1000);
    return t;
  };
  return (
    <>
      <div
        className={`messageBox d-flex ${
          isFrom ? "flex-row" : "flex-row-reverse"
        } `}
      >
        <div>
          <p className={`mb-0 ${isFrom ? "text-left" : "text-right"}   `}>
            {msg.selection}
          </p>
          <small>
            <Moment fromNow>{toDateTime(msg.createdAt.seconds)}</Moment>
          </small>
        </div>
      </div>
    </>
  );
}
