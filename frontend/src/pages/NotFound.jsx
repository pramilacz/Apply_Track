import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Button from "../components/Button/Button";
import Logo from "../components/Logo/Logo";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="notfound-page">
      <Link to="/" className="notfound-logo">
        <Logo />
      </Link>
      <div className="notfound-icon">
        <Compass size={26} strokeWidth={1.75} />
      </div>
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
