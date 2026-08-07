import { useNavigate } from 'react-router-dom';
import { BottomNavigation } from '../components/BottomNavigation.jsx';
import { DashboardHeader } from '../components/DashboardHeader.jsx';
import { HealthStatCard } from '../components/HealthStatCard.jsx';
import { QuickActionCard } from '../components/QuickActionCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const actions = [
  { icon: '+', title: 'Book Appointment', description: 'Find a specialist', accent: 'blue' },
  { icon: '▣', title: 'My Appointments', description: 'View your schedule', accent: 'purple' },
  { icon: '♙', title: 'Doctors', description: 'Explore care experts', accent: 'orange' },
  { icon: '▤', title: 'Medical Records', description: 'Keep health organised', accent: 'green' },
];

export function HomeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard-shell">
      <main className="dashboard" aria-label="Home dashboard">
        <DashboardHeader name={user?.name} />
        <label className="dashboard-search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Search doctors, specialties..." aria-label="Search doctors and specialties" /></label>
        <section className="dashboard-section" aria-labelledby="quick-actions-title">
          <div className="section-heading"><div><p>Care made simple</p><h2 id="quick-actions-title">Quick actions</h2></div></div>
          <div className="quick-actions-grid">{actions.map((action) => <QuickActionCard key={action.title} {...action} onClick={action.title === 'Doctors' ? () => navigate('/doctors') : action.title === 'My Appointments' ? () => navigate('/appointments') : undefined} />)}</div>
        </section>
        <section className="dashboard-section" aria-labelledby="health-summary-title">
          <div className="section-heading"><div><p>Your wellbeing</p><h2 id="health-summary-title">Health summary</h2></div><button type="button">View all</button></div>
          <div className="health-stats"><HealthStatCard icon="♡" label="Heart rate" value="72 bpm" note="Within your usual range" tone="coral" /><HealthStatCard icon="◒" label="Sleep" value="7h 40m" note="A restful night" tone="blue" /><HealthStatCard icon="⌁" label="Daily steps" value="6,840" note="68% of your goal" tone="green" /></div>
        </section>
        <section className="dashboard-section" aria-labelledby="appointment-title">
          <div className="section-heading"><div><p>Stay on track</p><h2 id="appointment-title">Upcoming appointment</h2></div><button type="button" onClick={() => navigate('/appointments')}>See all</button></div>
          <article className="appointment-card"><div className="appointment-card__date"><strong>24</strong><span>JUN</span></div><div className="appointment-card__details"><span className="appointment-card__badge">Next visit</span><h3>Dr. Priya Sharma</h3><p>General consultation · 10:30 AM</p></div><span className="appointment-card__arrow" aria-hidden="true">›</span></article>
        </section>
        <section className="dashboard-section dashboard-section--activity" aria-labelledby="activity-title">
          <div className="section-heading"><div><p>Your timeline</p><h2 id="activity-title">Recent activity</h2></div></div>
          <article className="activity-card"><span className="activity-card__icon" aria-hidden="true">✓</span><div><h3>Health profile updated</h3><p>Your medical information is securely up to date.</p></div><time>Today</time></article>
        </section>
      </main>
      <BottomNavigation activeItem="Home" />
    </div>
  );
}
