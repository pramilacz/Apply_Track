import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/Card/Card";
import Button from "../components/Button/Button";
import { Input, Select, Textarea } from "../components/Input/FormField";
import { Spinner } from "../components/Loading/Loading";
import { useToast } from "../components/Toast/ToastContext";
import { applicationService } from "../services/applicationService";
import "./ApplicationForm.css";

const STATUS_OPTIONS = [
  { value: "Applied", label: "Applied" },
  { value: "Interview", label: "Interview" },
  { value: "Offer", label: "Offer" },
  { value: "Rejected", label: "Rejected" },
];

const EMPTY_FORM = { company: "", role: "", date: "", status: "Applied", notes: "" };

export default function ApplicationForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loadingEntry, setLoadingEntry] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    document.title = `${isEdit ? "Edit" : "Add"} Application — ApplyTrack`;
  }, [isEdit]);

  useEffect(() => {
    if (!isEdit) return;
    let mounted = true;
    applicationService
      .get(id)
      .then((entry) => mounted && setForm(entry))
      .catch(() => mounted && setLoadError(true))
      .finally(() => mounted && setLoadingEntry(false));
    return () => {
      mounted = false;
    };
  }, [id, isEdit]);

  const validate = () => {
    const next = {};
    if (!form.company.trim()) next.company = "Company name is required.";
    if (!form.role.trim()) next.role = "Role is required.";
    if (!form.date) next.date = "Applied date is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (isEdit) {
        await applicationService.update(id, form);
        toast.success("Application updated.");
      } else {
        await applicationService.create(form);
        toast.success("Application added.");
      }
      navigate("/applications");
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) setErrors(apiErrors);
      else toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingEntry) {
    return <Spinner label="Loading application" />;
  }

  if (loadError) {
    return (
      <Card>
        <p>We couldn't load that application.</p>
        <Button variant="secondary" onClick={() => navigate("/applications")}>
          Back to applications
        </Button>
      </Card>
    );
  }

  return (
    <div className="app-form-page">
      <h1>{isEdit ? "Edit application" : "Add application"}</h1>
      <p className="app-form-subtitle">
        {isEdit
          ? "Update the details for this application."
          : "Log a new internship or job application to start tracking it."}
      </p>

      <Card>
        <form onSubmit={handleSubmit} noValidate>
          <div className="app-form-grid">
            <Input
              label="Company Name"
              placeholder="e.g. WSO2"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              error={errors.company}
              required
            />
            <Input
              label="Role"
              placeholder="e.g. Software Engineering Intern"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              error={errors.role}
              required
            />
            <Input
              label="Date Applied"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              error={errors.date}
              required
            />
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              options={STATUS_OPTIONS}
              error={errors.status}
              required
            />
          </div>

          <Textarea
            label="Notes"
            placeholder="Interview details, contacts, follow-ups..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            hint="Optional"
          />

          <div className="app-form-actions">
            <Button type="submit" loading={saving}>
              {isEdit ? "Save changes" : "Save Application"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
