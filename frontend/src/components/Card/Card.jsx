import "./Card.css";

export default function Card({ children, className = "", padded = true, ...rest }) {
  return (
    <div className={`card ${padded ? "card-padded" : ""} ${className}`} {...rest}>
      {children}
    </div>
  );
}
