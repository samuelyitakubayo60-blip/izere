/** Font Awesome icon helper — use official FA class names without the fa- prefix */
export default function Icon({ name, className = '', style, brand = false }) {
  const prefix = brand ? 'fab' : 'fas';
  return <i className={`${prefix} fa-${name} ${className}`.trim()} style={style} aria-hidden="true" />;
}
