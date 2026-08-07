export function Input({ label, id, className = '', ...props }) {
  const inputId = id || props.name;
  return <label className={`input-group ${className}`} htmlFor={inputId}><span className="input-group__label">{label}</span><input id={inputId} className="input" {...props} /></label>;
}
