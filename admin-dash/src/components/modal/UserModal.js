import React, { useState, useEffect } from 'react';
import './Modal.css';
import { db } from '../../firebase/config';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, updateEmail } from 'firebase/auth';

export default function UserModal({ onClose, user, onAdd, onUpdate }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    accountType: 'patient',
    specialty: '',
    phone: '',
    address: '',
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = !!user;
  const auth = getAuth();

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        ...user,
        password: '' // Don't populate password for security
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        // Update existing user
        const userRef = doc(db, 'users', user.id);
        const updateData = {
          fullName: formData.fullName,
          email: formData.email,
          accountType: formData.accountType,
          specialty: formData.specialty || null,
          phone: formData.phone || null,
          address: formData.address || null,
          status: formData.status
        };
        
        await updateDoc(userRef, updateData);
        onUpdate(formData);
      } else {
        // Create new user with Firebase Authentication
        try {
          // Create user in Firebase Auth
          const userCredential = await createUserWithEmailAndPassword(
            auth, 
            formData.email, 
            formData.password
          );
          
          // Add user to Firestore with the UID from Auth
          const newUser = {
            uid: userCredential.user.uid,
            fullName: formData.fullName,
            email: formData.email,
            accountType: formData.accountType,
            specialty: formData.accountType === 'doctor' ? formData.specialty : null,
            phone: formData.phone || null,
            address: formData.address || null,
            createdAt: serverTimestamp(),
            status: 'Active'
          };
          
          await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
          onAdd(newUser);
        } catch (authError) {
          console.error("Error creating user:", authError);
          setError(authError.message);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error("Error saving user: ", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3>{isEditMode ? 'Edit User' : 'Create New User'}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          
          {!isEditMode && (
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="accountType">Account Type</label>
            <select
              id="accountType"
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              required
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          
          {formData.accountType === 'doctor' && (
            <div className="form-group">
              <label htmlFor="specialty">Specialty</label>
              <input
                type="text"
                id="specialty"
                name="specialty"
                value={formData.specialty || ''}
                onChange={handleChange}
                placeholder="e.g., Cardiology, Pediatrics"
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="Phone Number"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              placeholder="Address"
            />
          </div>
          
          {isEditMode && (
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          )}
          
          <div className="modal-buttons">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Saving...' : isEditMode ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

