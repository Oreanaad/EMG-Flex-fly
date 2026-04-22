import React from 'react';

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1100,
    backdropFilter: 'blur(8px)',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    padding: '40px',
    borderRadius: '28px',
    width: '100%',
    maxWidth: '500px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'left', // Ensures overall container text alignment
  },
  label: {
    display: 'block',
    fontSize: '12px',
    color: '#94a3b8',
    marginBottom: '5px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    textAlign: 'left', // Force labels to the left
  },
  dataBox: {
    width: '100%',
    padding: '12px 0',
    fontSize: '16px',
    color: '#ffffff',
    borderBottom: '1px solid #334155',
    marginBottom: '20px',
    textAlign: 'left', // Force data content to the left
  }
};

const PatientViewModal = ({ patient, onClose }) => {
  if (!patient) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={{color: 'white', textAlign: 'center', marginBottom: '30px'}}>Patient File</h2>
        
        <label style={styles.label}>Full Name</label>
        <div style={styles.dataBox}>{patient.name}</div>

        <div style={{display: 'flex', gap: '20px'}}>
          <div style={{flex: 1}}>
            <label style={styles.label}>ID Number</label>
            <div style={styles.dataBox}>{patient.id_number || 'N/A'}</div>
          </div>
          <div style={{flex: 1}}>
            <label style={styles.label}>Age</label>
            <div style={styles.dataBox}>{patient.age} years</div>
          </div>
        </div>

        <label style={styles.label}>Affected Side</label>
        <div style={styles.dataBox}>{patient.affected_side}</div>

        <label style={styles.label}>Medical Observations</label>
        <div style={{...styles.dataBox, borderBottom: 'none', color: '#cbd5e1', fontSize: '14px', lineHeight: '1.5', marginBottom: '10px'}}>
          {patient.condition}
        </div>

        <button 
          onClick={onClose} 
          style={{
            width: '100%', 
            padding: '14px', 
            borderRadius: '12px', 
            border: 'none', 
            backgroundColor: '#6d28d9', 
            color: 'white', 
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          CLOSE FILE
        </button>
      </div>
    </div>
  );
};

export default PatientViewModal;