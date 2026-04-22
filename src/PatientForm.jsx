import React, { useState } from 'react';

const PatientForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    id_number: '',
    age: '',
    affected_side: 'Derecho',
    condition: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '15px',
      width: '100%',
      maxWidth: '500px',
      color: '#1e293b'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#0f172a' }}>Registrar Paciente</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold' }}>Nombre Completo</label>
          <input 
            type="text" 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold' }}>Cédula / ID</label>
            <input 
              type="text" 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              onChange={(e) => setFormData({...formData, id_number: e.target.value})}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold' }}>Edad</label>
            <input 
              type="number" 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
            />
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold' }}>Lado Afectado</label>
          <select 
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            onChange={(e) => setFormData({...formData, affected_side: e.target.value})}
          >
            <option value="Derecho">Derecho</option>
            <option value="Izquierdo">Izquierdo</option>
            <option value="Bilateral">Bilateral</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold' }}>Diagnóstico / Notas</label>
          <textarea 
            rows="3" 
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            onChange={(e) => setFormData({...formData, condition: e.target.value})}
          ></textarea>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ flex: 1, backgroundColor: '#6d28d9', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            Guardar Paciente
          </button>
          <button type="button" onClick={onCancel} style={{ flex: 1, backgroundColor: '#f1f5f9', color: '#64748b', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;