import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ArrowUpRight,
  LockKeyhole,
  UserRound,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Logo } from "../components/Header";
export default function LoginPage() {
  const { user, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const state: unknown = location.state;
  let from = "/";
  if (
    state &&
    typeof state === "object" &&
    "from" in state &&
    state.from &&
    typeof state.from === "object" &&
    "pathname" in state.from &&
    state.from.pathname === "/checkout"
  )
    from = "/checkout";
  if (user) return <Navigate to={from} replace />;
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!login(username, password)) {
      setError("Enter a username and the demo password: 123456.");
      return;
    }
    navigate(from, { replace: true });
  };
  return (
    <div className="container login-page">
      <div className="login-art">
        <span className="eyebrow">YOUR EVERYDAY, A LITTLE ELEVATED.</span>
        <h2>
          Good to
          <br />
          have you
          <br />
          <em>back.</em>
        </h2>
        <div className="login-bag">
          <ShoppingBag size={120} strokeWidth={1} />
          <span>sm.</span>
        </div>
        <p>
          A little world of things you’ll love.
          <br />
          Come on in and make yourself at home.
        </p>
        <ArrowUpRight className="login-arrow" size={48} />
      </div>
      <div className="login-form-wrap">
        <Logo />
        <h1>Welcome back.</h1>
        <p className="muted">Your next favorite is just a sign-in away.</p>
        <form onSubmit={submit}>
          <label className="form-label" htmlFor="username">
            Username
          </label>
          <div className="input-with-icon">
            <UserRound size={18} />
            <input
              id="username"
              autoComplete="username"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="What should we call you?"
            />
          </div>
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <div className="input-with-icon">
            <LockKeyhole size={18} />
            <input
              id="password"
              type={visible ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
            />
            <button
              type="button"
              aria-label={visible ? "Hide password" : "Show password"}
              onClick={() => setVisible(!visible)}
            >
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="btn full-width sign-in-button" type="submit">
            Sign in <ArrowRight size={18} />
          </button>
        </form>
        <div className="demo-note">
          <LockKeyhole size={18} />
          <p>
            <strong>A little demo, a full experience.</strong>
            <br />
            Use any username and password <code>123456</code>.<br />
            This is a demo session, not production authentication.
          </p>
        </div>
        <Link to="/" className="inline-link">
          Back to discovering <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
