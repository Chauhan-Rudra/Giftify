import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'wouter'
import { motion } from 'framer-motion'
import { Home, Gift, Settings, LogOut, User, Heart, Package } from 'lucide-react'

const DashboardLayout = ({ children, role = 'fan' }) => {
  const [location] = useLocation()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const fanLinks = [
    { icon: Home, label: 'Discover', path: '/dashboard/fan' },
    { icon: Gift, label: 'My Gifts', path: '/dashboard/fan/history' },
    { icon: Heart, label: 'Following', path: '/dashboard/fan/following' },
    { icon: Settings, label: 'Settings', path: '/dashboard/fan/settings' },
  ]

  const creatorLinks = [
    { icon: Home, label: 'Overview', path: '/dashboard/creator' },
    { icon: Package, label: 'Inventory', path: '/dashboard/creator/inventory' },
    { icon: User, label: 'Profile', path: '/dashboard/creator/profile' },
    { icon: Settings, label: 'Settings', path: '/dashboard/creator/settings' },
  ]

  const links = role === 'creator' ? creatorLinks : fanLinks

  return (
    <div className="dashboard-container-fullscreen" style={{ display: 'flex', height: '100vh', background: '#F8FAFC' }}>
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        style={{ 
            width: '260px', 
            background: 'white', 
            borderRight: '1px solid #E2E8F0', 
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}
      >
        <div>
            <div className="logo" style={{ fontSize: '1.5rem', marginBottom: '3rem', color: '#0F172A' }}>
                Giftify<span style={{ color: '#3B82F6' }}>.</span>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {links.map((link) => {
                    const isActive = location === link.path
                    const Icon = link.icon
                    return (
                        <Link 
                            key={link.path} 
                            href={link.path}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '1rem',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                color: isActive ? '#3B82F6' : '#64748B',
                                background: isActive ? '#EFF6FF' : 'transparent',
                                textDecoration: 'none',
                                fontWeight: isActive ? 600 : 500,
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }}
                        >
                            <Icon size={20} />
                            {link.label}
                        </Link>
                    )
                })}
            </nav>
        </div>

        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: role === 'creator' ? '#DBEAFE' : '#FCE7F3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    {role === 'creator' ? '🦁' : '🦄'}
                </div>
                <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user ? `${user.firstName} ${user.lastName}` : (role === 'creator' ? 'Alex Creator' : 'Sarah Fan')}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                         {user ? user.email : (role === 'creator' ? 'alex@example.com' : 'sarah@example.com')}
                    </div>
                </div>
            </div>
            
            <Link href="/login">
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}>
                    <LogOut size={18} />
                    Sign Out
                </button>
            </Link>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
         <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>
                {links.find(l => l.path === location)?.label || 'Dashboard'}
            </h1>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-small" style={{ background: 'white', color: '#64748B', border: '1px solid #E2E8F0' }}>Help</button>
                <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#EF4444', borderRadius: '50%' }}></span>
                    <button className="btn-small" style={{ background: 'white', color: '#64748B', border: '1px solid #E2E8F0' }}>🔔</button>
                </div>
            </div>
         </header>
         
         <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
         >
            {children}
         </motion.div>
      </main>
    </div>
  )
}

export default DashboardLayout
