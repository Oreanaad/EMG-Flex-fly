import React, { useState } from 'react';

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(8px)',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    padding: '40px',
    borderRadius: '28px',
    width: '100%',
    maxWidth: '550px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    position: 'relative',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  formTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '8px',
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: '14px',
    color: '#fbfbfb',
    marginBottom: '35px',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '8px',
    textAlign: 'left',
    paddingLeft: '4px',
  },
  input: {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '14px',
    border: '2px solid transparent',
    backgroundColor: '#ffffff',
    fontSize: '15px',
    color: '#1e293b',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
    textAlign: 'left',
  },
  row: {
    display: 'flex',
    gap: '20px',
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#6d28d9',
    color: 'white',
    padding: '16px',
    borderRadius: '14px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 10px 15px -3px rgba(109, 40, 217, 0.3)',
    transition: 'transform 0.2s',
  },
  cancelButton: {
    width: '100%',
    backgroundColor: 'white',
    color: '#1e293b',
    padding: '14px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '12px',
    borderRadius: '14px',
  }
};

const PatientFormModal = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    id_number: '',
    age: '',
    affected_side: 'Right Hemiplegia',
    condition: ''
  });

  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // --- MANUAL VALIDATIONS ---
    if (!formData.name.trim() || formData.name.length < 3) {
      setError('Name must be at least 3 characters long.');
      return;
    }
    if (!formData.id_number.trim()) {
      setError('ID number is required.');
      return;
    }
    if (!formData.age || formData.age <= 0 || formData.age > 110) {
      setError('Please enter a valid age.');
      return;
    }
    if (!formData.condition.trim()) {
      setError('Please include a brief medical observation.');
      return;
    }

    setError(''); 
    onSave(formData);
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={styles.formTitle}>Patient Data</h2>
        <p style={styles.formSubtitle}>Complete the clinical information to start the session.</p>

        {/* Visual Error Message */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            color: '#fca5a5',
            padding: '10px',
            borderRadius: '10px',
            fontSize: '13px',
            marginBottom: '20px',
            textAlign: 'center',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input 
              style={styles.input}
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div style={styles.row}>
            {/* ID / Identification */}
            <div style={{...styles.inputGroup, flex: 2}}>
              <label style={styles.label}>ID Number</label>
              <input 
                style={styles.input}
                placeholder="Identification"
                value={formData.id_number}
                onChange={e => setFormData({...formData, id_number: e.target.value})}
              />
            </div>
            {/* Age */}
            <div style={{...styles.inputGroup, flex: 1}}>
              <label style={styles.label}>Age</label>
              <input 
                style={styles.input}
                type="number"
                placeholder="00"
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
              />
            </div>
          </div>

          {/* Affected Side */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Affected Side</label>
            <select 
              style={{...styles.input, appearance: 'none', cursor: 'pointer'}}
              value={formData.affected_side}
              onChange={e => setFormData({...formData, affected_side: e.target.value})}
            >
              <option value="Right Hemiplegia">Right Hemiplegia</option>
              <option value="Left Hemiplegia">Left Hemiplegia</option>
              <option value="Bilateral">Bilateral / Other</option>
            </select>
          </div>

          {/* Observations */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Medical Observations</label>
            <textarea 
              style={{...styles.input, minHeight: '80px', resize: 'none', textAlign: 'left'}}
              placeholder="Patient's condition..."
              value={formData.condition}
              onChange={e => setFormData({...formData, condition: e.target.value})}
            />
          </div>

          <button type="submit" style={styles.submitButton}>
            CREATE CLINICAL FILE
          </button>
          
          <button type="button" onClick={onCancel} style={styles.cancelButton}>
            CANCEL AND GO BACK
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientFormModal;