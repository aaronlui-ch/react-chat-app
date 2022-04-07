import React from "react";

export default function Userlist({ user, selectUser }) {
  return (
    <>
      <div
        className={`d-flex align-items-center my-3 mr-4 clickpointer ${
          user.isOnline ? "clickpointer" : "notAllow"
        } `}
        onClick={() => {
          
          
          user.isOnline ?
          selectUser(user):alert("You can only match with online player!")}}
      >
        <div className="overlap base img-border">
          <img
            src={String(user.photoURL)}
            className="img-fluid img-border p-2 mr-2 icon"
            alt=""
          />

          <span
            class={`dot ${user.isOnline ? "bg-success" : "bg-danger"} `}
          ></span>
        </div>

        <h5>{user.name}</h5>
      </div>
    </>
  );
}
