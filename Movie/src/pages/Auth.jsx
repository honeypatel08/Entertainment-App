import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Auth() {
  const { mode = "login" } = useParams();
  const registering = mode === "register";
  const { authenticate } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await authenticate(registering ? "register" : "login", values);
      navigate("/");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="authPage">
      <form className="authCard" onSubmit={submit}>
        <span className="eyebrow">Your watchlist, everywhere</span>
        <h1>{registering ? "Create your account" : "Welcome back"}</h1>
        <p>Save favorites and discover spoiler-free AI summaries.</p>
        {registering && <input name="name" placeholder="Name" autoComplete="name" required />}
        <input name="email" type="email" placeholder="Email" autoComplete="email" required />
        <input name="password" type="password" placeholder="Password" autoComplete={registering ? "new-password" : "current-password"} minLength="8" required />
        {error && <p className="errorMessage">{error}</p>}
        <button className="primaryButton" disabled={loading}>{loading ? "Please wait…" : registering ? "Create account" : "Sign in"}</button>
        <p>{registering ? "Already registered?" : "New here?"} <Link to={`/auth/${registering ? "login" : "register"}`}>{registering ? "Sign in" : "Create an account"}</Link></p>
      </form>
    </div>
  );
}
