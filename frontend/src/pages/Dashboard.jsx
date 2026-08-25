import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Inbox, Mic, Trophy, XCircle, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast/ToastContext";
import { applicationService } from "../services/applicationService";
import StatCard from "../components/StatCard/StatCard";
import Card from "../components/Card/Card";
import Button from "../components/Button/Button";
import EmptyState from "../components/EmptyState/EmptyState";
import ApplicationTable from "../components/ApplicationTable/ApplicationTable";
import JobCard from "../components/JobCard/JobCard";
import { SkeletonStatCards, SkeletonTable } from "../components/Loading/Loading";
import { opportunities } from "../data/opportunities";
import "./Dashboard.css";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.title = "Dashboard — ApplyTrack";
  }, []);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await applicationService.list();
      setApplications(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const total = applications.length;
    const interviews = applications.filter((a) => a.status === "Interview").length;
    const offers = applications.filter((a) => a.status === "Offer").length;
    const rejected = applications.filter((a) => a.status === "Rejected").length;
    return { total, interviews, offers, rejected };
  }, [applications]);

  const recent = applications.slice(0, 5);

  const handleDelete = async (id) => {
    try {
      await applicationService.remove(id);
      setApplications((current) => current.filter((a) => a.id !== id));
      toast.success("Application deleted.");
    } catch {
      toast.error("Couldn't delete that application. Please try again.");
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-greeting">
            {getGreeting()}, {user?.username}
          </h1>
          <p className="dashboard-subtitle">Here's an overview of your internship applications.</p>
        </div>
        <Link to="/applications/new">
          <Button icon={Plus}>Add Application</Button>
        </Link>
      </div>

      {loading ? (
        <SkeletonStatCards />
      ) : (
        <div className="stats-grid">
          <StatCard label="Total Applications" value={stats.total} icon={Inbox} tone="applied" />
          <StatCard label="Interviews" value={stats.interviews} icon={Mic} tone="interview" />
          <StatCard label="Offers" value={stats.offers} icon={Trophy} tone="offer" />
          <StatCard label="Rejected" value={stats.rejected} icon={XCircle} tone="rejected" />
        </div>
      )}

      <Card padded={false} className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Applications</h2>
          {applications.length > 0 && (
            <Link to="/applications" className="dashboard-section-link">
              View all
            </Link>
          )}
        </div>

        {loading ? (
          <SkeletonTable />
        ) : error ? (
          <EmptyState
            icon={RefreshCw}
            title="Something went wrong"
            description="We couldn't load your applications."
            action={
              <Button variant="secondary" onClick={load}>
                Try again
              </Button>
            }
          />
        ) : applications.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No applications yet"
            description="Start tracking your internship applications by adding your first one."
            action={
              <Link to="/applications/new">
                <Button icon={Plus}>Add Application</Button>
              </Link>
            }
          />
        ) : (
          <div className="dashboard-table-pad">
            <ApplicationTable applications={recent} onDelete={handleDelete} />
          </div>
        )}
      </Card>

      <Card padded={false} className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Opportunities</h2>
          <Link to="/opportunities" className="dashboard-section-link">
            View all
          </Link>
        </div>
        <div className="dashboard-opps-grid">
          {opportunities.slice(0, 4).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </Card>
    </div>
  );
}
