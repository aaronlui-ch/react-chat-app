import React from "react";

export default function Nav({ user, signout }) {
  return (
    <nav className="navbar navbar-light" >
      <a className="navbar-brand" href="#">
        {user.displayName}
      </a>

      {signout}
    </nav>
  );
}
