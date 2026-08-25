import logoIcon from "../../assets/apply_tracker_logo.svg";
import "./Logo.css";

export default function Logo({ size = "md" }) {
  return (
    <span className={`logo logo-${size}`}>
      <img src={logoIcon} alt="ApplyTrack logo" className="logo-icon" />
      <span className="logo-word">ApplyTrack</span>
    </span>
  );
}