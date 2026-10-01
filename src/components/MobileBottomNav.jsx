import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, HeartHandshake, PhoneCall, ShoppingBag, Sparkles } from 'lucide-react';

const MobileBottomNav = ({ onBookClick }) => {
  const location = useLocation();

  // Hide on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    {
      label: 'Home',
      icon: Home,
      href: '/',
      isActive: location.pathname === '/',
    },
    {
      label: 'Matrimony',
      icon: HeartHandshake,
      href: '/matrimony',
      isActive: location.pathname.startsWith('/matrimony'),
      badge: 'Live',
    },
    {
      label: 'Talk to Jyotish',
      icon: PhoneCall,
      isAction: true,
      onClick: onBookClick,
      highlight: true,
    },
    {
      label: 'Store',
      icon: ShoppingBag,
      href: '/store',
      isActive: location.pathname === '/store',
    },
    {
      label: 'Online Jyotish',
      icon: Sparkles,
      href: '/planets',
      isActive: location.pathname === '/planets' || location.pathname === '/numerology' || location.pathname === '/blogs',
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-1 pointer-events-none">
      <nav className="max-w-md mx-auto bg-white/95 backdrop-blur-2xl border border-[#EADCC8] rounded-2xl shadow-[0_-8px_25px_rgba(194,65,12,0.08),0_2px_8px_rgba(0,0,0,0.04)] px-2 py-1.5 flex items-center justify-around pointer-events-auto">
        {navItems.map((item, idx) => {
          if (item.isAction) {
            return (
              <button
                key={idx}
                type="button"
                onClick={item.onClick}
                className="flex flex-col items-center justify-center -mt-5 group cursor-pointer focus:outline-none"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C2410C] via-[#EA580C] to-[#D97706] text-white flex items-center justify-center shadow-lg shadow-[#C2410C]/35 group-active:scale-95 transition-all border-2 border-white">
                  <PhoneCall size={20} className="animate-pulse" />
                </div>
                <span className="text-[10px] font-bold text-[#C2410C] mt-1 tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          }

          const IconComponent = item.icon;
          const active = item.isActive;

          return (
            <Link
              key={idx}
              to={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                active ? 'text-[#C2410C]' : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <div className="relative">
                <IconComponent size={19} strokeWidth={active ? 2.5 : 1.8} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-[#C2410C] text-white text-[8px] font-bold rounded-full uppercase leading-tight animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${active ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
              {active && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C] mt-0.5" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default React.memo(MobileBottomNav);
