import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>
      <div className="admin-actions">
        <button onClick={() => navigate('/admin/manage-colleges')}>
          Manage Colleges
        </button>
        {/* Add more admin actions here */}
      </div>
    </div>
  );
}

export default AdminDashboard;