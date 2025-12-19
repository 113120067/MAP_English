export const LoadingScreen = () => (
    <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f8f9fa',
        flexDirection: 'column'
    }}>
        <div className="spinner" style={{
            width: '50px',
            height: '50px',
            border: '5px solid #bdc3c7',
            borderTopColor: '#3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        }} />
        <h2 style={{ color: '#7f8c8d', marginTop: '20px' }}>Loading MapWorld...</h2>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
);
