import { useId } from "react";
import "./FormField.css";

function FieldWrapper({ label, error, hint, required, children, htmlFor }) {
  const hintId = useId();
  return (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={htmlFor}>
          {label}
          {required && <span className="field-required"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : (
        hint && (
          <p className="field-hint" id={hintId}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export function Input({ label, error, hint, required, id, className = "", endAdornment, ...rest }) {
  const autoId = useId();
  const fieldId = id || autoId;
  return (
    <FieldWrapper label={label} error={error} hint={hint} required={required} htmlFor={fieldId}>
      <div className="field-input-wrap">
        <input
          id={fieldId}
          className={`field-input ${error ? "field-input-error" : ""} ${className}`}
          aria-invalid={!!error}
          {...rest}
        />
        {endAdornment && <div className="field-input-adornment">{endAdornment}</div>}
      </div>
    </FieldWrapper>
  );
}

export function Select({ label, error, hint, required, id, options, className = "", ...rest }) {
  const autoId = useId();
  const fieldId = id || autoId;
  return (
    <FieldWrapper label={label} error={error} hint={hint} required={required} htmlFor={fieldId}>
      <select
        id={fieldId}
        className={`field-input field-select ${error ? "field-input-error" : ""} ${className}`}
        aria-invalid={!!error}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

export function Textarea({ label, error, hint, required, id, className = "", ...rest }) {
  const autoId = useId();
  const fieldId = id || autoId;
  return (
    <FieldWrapper label={label} error={error} hint={hint} required={required} htmlFor={fieldId}>
      <textarea
        id={fieldId}
        className={`field-input field-textarea ${error ? "field-input-error" : ""} ${className}`}
        aria-invalid={!!error}
        {...rest}
      />
    </FieldWrapper>
  );
}
