import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * Navigation component props
 */
interface NavigationProps {
  mobile?: boolean;
}

/**
 * Modern Navigation component with gradient active states
 *
 * Displays navigation links for all main routes
 * Responsive: horizontal on desktop, vertical on mobile
 * Admin link only visible to admin users
 */
export function Navigation({ mobile = false }: NavigationProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const links = [
    { to: '/', label: 'Home' },
    { to: '/books', label: 'Books' },
    { to: '/favorites', label: 'Favorites' },
    { to: '/recommendations', label: 'Recommendations' },
    { to: '/reading-lists', label: 'Reading Lists' },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []), // Only show Admin link for admin users
  ];

  const baseClasses = 'transition-all duration-300 font-semibold';
  const activeClasses = mobile
    ? 'text-violet-600 bg-violet-50 border-l-4 border-violet-600'
    : 'text-violet-600 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-violet-600 after:to-indigo-600';
  const inactiveClasses = 'text-slate-700 hover:text-violet-600';

  const containerClasses = mobile ? 'flex flex-col space-y-2' : 'flex space-x-8';

  const linkClasses = mobile ? 'py-2.5 px-4 rounded-lg hover:bg-violet-50' : 'pb-1';

  return (
    <nav className={containerClasses}>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `${baseClasses} ${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
