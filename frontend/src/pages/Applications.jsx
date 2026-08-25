import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Inbox, RefreshCw } from "lucide-react";
import { applicationService } from "../services/applicationService";
import { useToast } from "../components/Toast/ToastContext";
import Card from "../components/Card/Card";
import Button from "../components/Button/Button";
import EmptyState from "../components/EmptyState/EmptyState";
import ApplicationTable from "../components/ApplicationTable/ApplicationTable";
import { SkeletonTable } from "../components/Loading/Loading";
import "./Applications.css";

export default function Applications() {
  const toast = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.title = "Applications — ApplyTrack";
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
    <div className="applications-page">
      <div className="applications-header">
        <div>
          <h1>Applications</h1>
          <p>Every internship and job application you're tracking.</p>
        </div>
        <Link to="/applications/new">
          <Button icon={Plus}>Add Application</Button>
        </Link>
      </div>

      <Card padded={false}>
        {loading ? (
          <SkeletonTable rows={6} />
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
          <div className="applications-table-pad">
            <ApplicationTable applications={applications} onDelete={handleDelete} />
          </div>
        )}
      </Card>
    </div>
  );
}
