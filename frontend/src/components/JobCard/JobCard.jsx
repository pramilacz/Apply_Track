import { MapPin, ArrowUpRight } from "lucide-react";
import "./JobCard.css";

export default function JobCard({ job }) {
  return (
    <div className="job-card">
      <div className="job-card-top">
        <div className="job-card-logo" style={{ background: `${job.color}1a`, color: job.color }}>
          {job.initial}
        </div>
        <div className="job-card-info">
          <h4>{job.company}</h4>
          <p>{job.role}</p>
        </div>
        <span className="job-card-type">{job.workType}</span>
      </div>

      <div className="job-card-tags">
        {job.skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>

      <div className="job-card-footer">
        <span className="job-card-location">
          <MapPin size={13} aria-hidden="true" />
          {job.location}
        </span>
        <a href={job.url} target="_blank" rel="noopener noreferrer" className="job-card-apply">
          View opportunity
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
