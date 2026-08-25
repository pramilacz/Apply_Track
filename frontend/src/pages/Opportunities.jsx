import { useEffect } from "react";
import JobCard from "../components/JobCard/JobCard";
import { opportunities } from "../data/opportunities";
import "./Opportunities.css";

export default function Opportunities() {
  useEffect(() => {
    document.title = "Opportunities — ApplyTrack";
  }, []);

  return (
    <div className="opportunities-page">
      <h1>Opportunities</h1>
      <p>Internship openings at companies actively hiring right now.</p>

      <div className="opportunities-page-grid">
        {opportunities.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
