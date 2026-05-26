import { NavLink, Outlet } from 'react-router-dom';

const tabs = [
  { to: '/', label: 'Главная', icon: '🏠' },
  { to: '/search', label: 'Поиск', icon: '🔍' },
  { to: '/compiler', label: 'Уголок', icon: '⚡' },
  { to: '/favorites', label: 'Избранное', icon: '★' },
];

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-bg-elevated border-b border-border sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-bg-elevated/85">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center gap-6 h-14">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="size-7 rounded-lg bg-accent grid place-items-center text-white font-extrabold">
              A
            </span>
            <span className="font-bold text-text hidden sm:inline">
              Anime IDE Code
            </span>
          </NavLink>
          <nav className="flex items-center gap-1 ml-auto">
            {tabs.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.to === '/'}
                className={({ isActive }) =>
                  [
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    'hover:bg-bg-card',
                    isActive
                      ? 'text-accent bg-bg-card'
                      : 'text-text-dim',
                  ].join(' ')
                }
              >
                <span className="mr-1.5">{t.icon}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
