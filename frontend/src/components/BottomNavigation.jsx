const navItems = ['Explore', 'Saved', 'Profile'];

export function BottomNavigation() {
  return <nav className="bottom-nav" aria-label="Primary navigation"><div className="bottom-nav__inner">{navItems.map((item, index) => <button className={`bottom-nav__item${index === 0 ? ' bottom-nav__item--active' : ''}`} type="button" key={item} aria-current={index === 0 ? 'page' : undefined}><span aria-hidden="true">{index === 0 ? '⌂' : index === 1 ? '♡' : '◌'}</span>{item}</button>)}</div></nav>;
}
