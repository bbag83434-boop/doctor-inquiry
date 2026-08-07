export function Button({ children, className = '', fullWidth = false, variant = 'primary', ...props }) {
  return <button className={`button button--${variant}${fullWidth ? ' button--full' : ''} ${className}`} {...props}>{children}</button>;
}
