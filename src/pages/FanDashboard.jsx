import React, { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { Search, Filter, Star, Gift } from 'lucide-react'
import { useToast } from '../components/ToastContext'

const FanDashboard = () => {
  const categories = ['All', 'Gaming', 'Music', 'Tech', 'Lifestyle']
  const [activeCat, setActiveCat] = useState('All')

  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  React.useEffect(() => {
    const fetchCreators = async () => {
        try {
            const { collection, getDocs, query, where } = await import('firebase/firestore');
            const { db } = await import('../firebase');
            
            const q = query(collection(db, "users"), where("role", "==", "creator"));
            const snapshot = await getDocs(q);
            
            const fetchedCreators = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    name: `${data.firstName} ${data.lastName}`,
                    category: data.category || 'Lifestyle',
                    avatar: '🦁',
                    handle: `@${data.firstName}`.toLowerCase(),
                    verified: true
                };
            });
            
            setCreators(fetchedCreators);
        } catch (error) {
            console.error("Error fetching creators:", error);
            let msg = "Failed to load creators.";
            if (error.message && (error.message.includes("Failed to load resource") || error.message.includes("BLOCKED"))) { // Client-side check
                 msg = "AdBlocker detected! Please disable it for localhost to see data.";
            } else if (error.message.includes("backend")) { // Sometimes reported as backend error
                 msg = "Connection blocked. Check extensions.";
            }
            
            addToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };
    
    fetchCreators();
  }, []);

  const filteredCreators = activeCat === 'All' 
    ? creators 
    : creators.filter(c => c.category === activeCat)

  const [user, setUser] = useState(null)
  
  React.useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (loading) return (
    <DashboardLayout role="fan">
        <div style={{ marginBottom: '2rem' }}>
            <div className="skeleton" style={{ height: '40px', width: '300px', marginBottom: '1rem', borderRadius: '8px' }}></div>
            <div className="skeleton" style={{ height: '20px', width: '200px', borderRadius: '4px' }}></div>
        </div>
        
        {/* Search Skeleton */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
             <div className="skeleton" style={{ height: '50px', flex: 1, borderRadius: '12px' }}></div>
             <div className="skeleton" style={{ height: '50px', width: '120px', borderRadius: '12px' }}></div>
        </div>

        {/* Categories Skeleton */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
            {[1,2,3,4,5].map(i => (
                <div key={i} className="skeleton" style={{ height: '36px', width: '80px', borderRadius: '99px' }}></div>
            ))}
        </div>

        {/* Card Grid Skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[1,2,3,4].map(i => (
                <div key={i} style={{ height: '300px', borderRadius: '16px', background: 'white', border: '1px solid #E2E8F0', padding: '1.5rem' }}>
                    <div className="skeleton" style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 1rem' }}></div>
                    <div className="skeleton" style={{ width: '60%', height: '24px', margin: '0 auto 0.5rem', borderRadius: '4px' }}></div>
                    <div className="skeleton" style={{ width: '40%', height: '16px', margin: '0 auto 1.5rem', borderRadius: '4px' }}></div>
                    <div className="skeleton" style={{ width: '100%', height: '42px', borderRadius: '10px' }}></div>
                </div>
            ))}
        </div>
        <style>{`
            .skeleton {
                background: #f1f5f9;
                background-image: linear-gradient(90deg, #f1f5f9 0px, #e2e8f0 40px, #f1f5f9 80px);
                background-size: 300px;
                animation: skeleton-loading 1.5s infinite linear;
            }
            @keyframes skeleton-loading {
                0% { background-position: -300px; }
                100% { background-position: 300px; }
            }
        `}</style>
    </DashboardLayout>
  );

  return (
    <DashboardLayout role="fan">
        {/* Welcome Header */}
        <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                Welcome back, {user ? user.firstName : 'Super Fan'}! 👋
            </h1>
            <p style={{ color: '#64748B' }}>Discover creators and send love instantly.</p>
        </div>
        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={{ position: 'absolute', left: 14, top: 12, color: '#94A3B8' }} />
                <input 
                    type="text" 
                    placeholder="Search creators..." 
                    style={{ 
                        width: '100%', 
                        padding: '10px 10px 10px 42px', 
                        borderRadius: '12px', 
                        border: '1px solid #E2E8F0',
                        fontSize: '0.95rem'
                    }} 
                />
            </div>
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white' }}>
                <Filter size={18} /> Filters
            </button>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setActiveCat(cat)}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '99px',
                        border: 'none',
                        background: activeCat === cat ? '#111' : 'white',
                        color: activeCat === cat ? 'white' : '#64748B',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        boxShadow: activeCat === cat ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                        transition: 'all 0.2s'
                    }}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* Creators Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filteredCreators.length > 0 ? (
                filteredCreators.map(creator => (
                <div 
                    key={creator.id} 
                    className="creator-card"
                    style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        textAlign: 'center',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-4px)'
                        e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.1)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                    }}
                >
                    <div style={{ width: 80, height: 80, margin: '0 auto 1rem', background: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                        {creator.avatar}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        {creator.name}
                        {creator.verified && <span style={{ color: '#3B82F6', fontSize: '1rem' }}>✓</span>}
                    </div>
                    <div style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{creator.handle}</div>
                    
                    <button 
                        style={{
                            width: '100%',
                            padding: '10px',
                            background: '#EFF6FF',
                            color: '#3B82F6',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        <Gift size={18} /> Send Gift
                    </button>
                </div>
            ))
            ) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🥺</div>
                    <h3>No creators found.</h3>
                    <p>Try refreshing or allow connections to seeing creators.</p>
                </div>
            )}
        </div>
    </DashboardLayout>
  )
}

export default FanDashboard
