import React, { useState } from 'react';

function Dashboard({ onSelectGroup }) {
  const [groups, setGroups] = useState([
    { id: 1, name: 'Goa Trip 🏖️', participants: 4, balance: -1200 },
    { id: 2, name: 'Dinner at Rajs 🍕', participants: 3, balance: 450 }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    
    const newGroup = {
      id: Date.now(),
      name: newGroupName,
      participants: 1,
      balance: 0
    };
    
    setGroups([newGroup, ...groups]);
    setNewGroupName('');
    setShowModal(false);
  };

  const deleteGroup = (id, e) => {
    e.stopPropagation();
    setGroups(groups.filter(g => g.id !== id));
  };

  return (
    <div>
      <div className="cards-grid" style={{ marginBottom: '3rem' }}>
        <div className="stat-card primary">
          <h3>Total Spent</h3>
          <div className="value">₹ 4,500</div>
        </div>
        <div className="stat-card accent">
          <h3>You are owed</h3>
          <div className="value">₹ 450</div>
        </div>
        <div className="stat-card danger">
          <h3>You owe</h3>
          <div className="value">₹ 1,200</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px' }}>Your Groups</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)} style={{ width: 'auto', padding: '8px 16px', fontSize: '13px' }}>+ New Group</button>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '16px' }}>Create New Group</h3>
            <form onSubmit={handleCreateGroup}>
              <div className="input-group">
                <label>Group Name</label>
                <input 
                  type="text" 
                  value={newGroupName} 
                  onChange={e => setNewGroupName(e.target.value)} 
                  placeholder="e.g. Weekend Getaway" 
                  autoFocus
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        {groups.map(g => (
          <div 
            key={g.id} 
            onClick={() => onSelectGroup(g)}
            className="list-item" 
            style={{ transition: 'background 0.15s ease', cursor: 'pointer' }} 
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'} 
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '15px' }}>{g.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>{g.participants} participants</p>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <p style={{ margin: 0, fontWeight: 500, fontSize: '14px', color: g.balance >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
                {g.balance >= 0 ? 'Gets back' : 'Owes'}: ₹ {Math.abs(g.balance).toLocaleString()}
              </p>
              <button 
                onClick={(e) => deleteGroup(g.id, e)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '18px' }}
                title="Delete Group"
              >
                ×
              </button>
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No groups yet. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
