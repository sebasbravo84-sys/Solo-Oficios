import Navbar from '@/components/layout/Navbar'

export default function Loading() {
  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
        {/* Sidebar skeleton */}
        <div style={{ width: 260, flexShrink: 0, background: '#fff', borderRight: '1px solid #e2e8f0', padding: 24 }}>
          {[80, 60, 90, 50, 70].map((w, i) => (
            <div key={i} style={{ height: 14, width: `${w}%`, background: '#e2e8f0', borderRadius: 6, marginBottom: 16, animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
        {/* Cards skeleton */}
        <div style={{ flex: 1, padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 18 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <div style={{ height: 130, background: '#e2e8f0', animation: 'pulse 1.5s ease-in-out infinite' }} />
                <div style={{ padding: 18 }}>
                  {[70, 50, 90, 40].map((w, j) => (
                    <div key={j} style={{ height: 13, width: `${w}%`, background: '#e2e8f0', borderRadius: 5, marginBottom: 12, animation: 'pulse 1.5s ease-in-out infinite' }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
    </>
  )
}
