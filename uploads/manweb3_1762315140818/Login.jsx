import React from "react";
import Input from "./Input";

function Login() {
  return (
    <form className="form">
      <Input tyep="text" placeholder="Username" />
      {/* here we have a second input which as a password and a placeholder of a unsername  */}
      <Input type="password" placeholder="password" />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
