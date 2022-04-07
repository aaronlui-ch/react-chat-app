import React from "react";
import Moment from "react-moment";
import { useState, useEffect } from "react";
export default function Messages({ msg, setIsUserSelect ,len}) {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("uid"));
  const [isFrom, setIsFrom] = useState(currentUser == msg.from ? true : false);
  const toDateTime = (secs) => {
    let t;
    t = new Date(secs * 1000);
    return t;
  };

  useEffect(() => {
    if (isFrom) return setIsUserSelect(true);
  }, [isFrom]);

  return (
    <>
      <div
        className={` d-flex ${isFrom ? "flex-row-reverse" : "flex-row"} my-2`}
      >
        <div className={` messageBox ${isFrom ? "darkpurple" : "darkpink"}`}>
          <p className={`mb-0 ${isFrom ? "text-right" : "text-left"}   `}>
            {len==1&& !isFrom?"Player has selected!":msg.selection}
            <br />
            <small>
              <Moment fromNow>{toDateTime(msg.createdAt.seconds)}</Moment>
            </small>
          </p>
        </div>
      </div>
    </>
  );
}
