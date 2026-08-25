import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import Badge from "../Badge/Badge";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import { formatDate } from "../../utils/formatDate";
import "./ApplicationTable.css";

export default function ApplicationTable({ applications, onDelete }) {
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    await onDelete(pendingDelete.id);
    setDeleting(false);
    setPendingDelete(null);
  };

  return (
    <>
      {/* Desktop table */}
      <div className="app-table-wrap">
        <table className="app-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Applied</th>
              <th>Status</th>
              <th className="app-table-actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td className="app-table-company">{app.company}</td>
                <td className="app-table-role">{app.role}</td>
                <td className="app-table-date">{formatDate(app.date)}</td>
                <td>
                  <Badge status={app.status} />
                </td>
                <td>
                  <div className="app-table-actions">
                    <button
                      className="app-table-action"
                      onClick={() => navigate(`/applications/${app.id}/edit`)}
                      aria-label={`Edit application for ${app.company}`}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      className="app-table-action app-table-action-danger"
                      onClick={() => setPendingDelete(app)}
                      aria-label={`Delete application for ${app.company}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="app-cards">
        {applications.map((app) => (
          <div className="app-card" key={app.id}>
            <div className="app-card-top">
              <div>
                <p className="app-card-company">{app.company}</p>
                <p className="app-card-role">{app.role}</p>
              </div>
              <Badge status={app.status} />
            </div>
            <p className="app-card-date">Applied {formatDate(app.date)}</p>
            <div className="app-card-actions">
              <Button
                variant="secondary"
                size="sm"
                icon={Pencil}
                onClick={() => navigate(`/applications/${app.id}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={Trash2}
                onClick={() => setPendingDelete(app)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title="Delete application?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={confirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        Are you sure you want to delete the application for{" "}
        <strong>{pendingDelete?.company}</strong>? This action cannot be undone.
      </Modal>
    </>
  );
}
