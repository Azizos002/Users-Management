import React, { useState, useEffect } from 'react';
import UserModal from '../modal/UserModal';
import './userTable.css';
import { db } from '../../firebase/config';
import { collection, getDocs, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';

export default function UserTable() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'fullName', direction: 'ascending' });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from Firebase
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        status: 'Active' // Default status since it's not in your Firebase model
      }));
      setUsers(usersList);
      console.log(usersList)
      setError(null);
    } catch (err) {
      console.error("Error fetching users: ", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', id));
        setUsers(users.filter(user => user.id !== id));
      } catch (err) {
        console.error("Error deleting user: ", err);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleAddUser = (newUser) => {
    // This will be handled in UserModal component
    setShowModal(false);
    fetchUsers(); // Refresh the list after adding
  };

  const handleUpdateUser = (updatedUser) => {
    // This will be handled in UserModal component
    setShowModal(false);
    setEditingUser(null);
    fetchUsers(); // Refresh the list after updating
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';
    
    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredUsers = sortedUsers.filter(user => 
    (user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.accountType?.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  console.log("users",users)

  return (
    <div className="usertable-container">
      <div className="usertable-header">
        <h2>Users Management</h2>
        <div className="usertable-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <span className="search-icon">🔍</span>
          </div>
          <button className="create-button" onClick={() => {setEditingUser(null); setShowModal(true);}}>
            + Create User
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : filteredUsers.length === 0 ? (
        <div className="no-results">No users found matching your search</div>
      ) : (
        <div className="table-responsive">
          <table className="usertable">
            <thead>
              <tr>
              <th onClick={() => handleSort('id')}>
                  ID {sortConfig.key === 'id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('fullName')}>
                  Full Name {sortConfig.key === 'fullName' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('email')}>
                  Email {sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('accountType')}>
                  Role {sortConfig.key === 'accountType' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('specialty')}>
                  Specialty {sortConfig.key === 'specialty' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('status')}>
                  Status {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.accountType?.toLowerCase()}`}>
                      {user.accountType || 'User'}
                    </span>
                  </td>
                  <td>{user.specialty || 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${user.status?.toLowerCase()}`}>
                      {user.status || 'Active'}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button className="edit" onClick={() => handleEdit(user)}>Edit</button>
                    <button className="delete" onClick={() => handleDelete(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <UserModal 
          onClose={() => {setShowModal(false); setEditingUser(null);}} 
          user={editingUser}
          onAdd={handleAddUser}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
}

