export default function Loading() {
  return (
    <div style={{ maxWidth: 1000, margin: '40px auto', padding: '0 20px' }}>
      {/* Hero skeleton */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '32px 20px', marginBottom: 0 }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ width: 100, height: 100, borderRadius: 24, background: '#e2e8f0', animation: 'pulse 1.5s ease-in-out infinite', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ width: '40%', height: 32, background: '#e2e8f0', borderRadius: 8, marginBottom: 12, animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ width: '25%', height: 18, background: '#e2e8f0', borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite' }} />
          </div>
        </div>
      </div>
      {/* Body skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40, padding: '32px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[100, 60, 80, 70].map((w, i) => (
            <div key={i} style={{ height: 18, width: `${w}%`, background: '#e2e8f0', borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
        <div style={{ background: '#e2e8f0', borderRadius: 24, height: 300, animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
    </div>
  )
}
