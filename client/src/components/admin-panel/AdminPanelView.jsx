import styles from './AdminPanel.module.css';

const roleLabels = {
  admin: 'Admin (Leader)',
  designer: 'Designer',
  employee: 'Employee',
};

const AdminPanelView = ({
  pendingUsers,
  availableRoles,
  selectedRoles,

  onRoleChange,
  onApprove,
  onReject,
}) => {
  return (
    <div className={styles['admin-panel']}>
      <h2>Pending Users</h2>

      {pendingUsers.length === 0 ? (
        <p>No pending users.</p>
      ) : (
        <table className={styles['admin-panel__table']}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Username</th>
              <th>Select Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {pendingUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.username}</td>

                <td>
                  <select
                    value={
                      selectedRoles[user._id] ||
                      user.role ||
                      ''
                    }
                    onChange={(e) =>
                      onRoleChange(
                        user._id,
                        e.target.value
                      )
                    }
                    className={
                      styles['admin-panel__select']
                    }
                  >
                    <option value="">
                      Select Role
                    </option>

                    {availableRoles.map((role) => (
                      <option key={role} value={role}>
                        {roleLabels[role] || role}
                      </option>
                    ))}
                  </select>
                </td>

                <td
                  className={
                    styles['admin-panel__button']
                  }
                >
                  <button
                    onClick={() => onApprove(user._id)}
                    className={
                      styles['admin-panel__button-approve']
                    }
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => onReject(user._id)}
                    className={
                      styles['admin-panel__button-reject']
                    }
                    style={{ marginLeft: '0.5rem' }}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanelView;
