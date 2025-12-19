import { APPS } from './data/apps';
import './App.css';

function App() {
  const handleOpenApp = (url: string) => {
    if (url === '#') return;
    window.open(url, '_blank');
  };

  return (
    <div className="launcher-container">
      <header className="launcher-header">
        <h1>🛍️ Learning App Store</h1>
        <p>One Account. Infinite Learning Possibilities.</p>
      </header>

      <div className="sections">
        <section>
          <h2>Featured Apps</h2>
          <div className="app-grid">
            {APPS.map(app => (
              <div key={app.id} className={`app-card ${app.status}`} onClick={() => handleOpenApp(app.url)}>
                <div className="app-icon">{app.icon}</div>
                <div className="app-info">
                  <h3>{app.name}</h3>
                  <p>{app.description}</p>
                  <span className={`badge ${app.category}`}>{app.category}</span>
                  {app.status === 'dev' && <span className="badge dev">Coming Soon</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="developer-zone">
          <h2>👨‍💻 Developer Zone</h2>
          <p>Want to build your own learning app? Check out our open source guide.</p>
          <a href="#" className="dev-link">Read Architecture Docs</a>
        </section>
      </div>
    </div>
  );
}

export default App;
