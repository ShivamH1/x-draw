import React from "react";
import { AuthContainer } from "../../components/Auth/AuthComponent";

function signIn() {
  return (
    <div>
      <AuthContainer isSignup={false} />
    </div>
  );
}

export default signIn;
