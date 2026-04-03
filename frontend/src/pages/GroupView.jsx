import React, { useState, useMemo } from 'react';
import { calculateBalances, computeSettlements } from '../utils/balanceEngine';

function GroupView({ group, onBack }) {
  const [participants, setParticipants] = useState([
    { id: '1', name: 'You' }, // Default primary user
  ]);
  const [expenses, setExpenses] = useState([]);
  
  // UI States
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [newPartName, setNewPartName] = useState('');
  
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [payerId, setPayerId] = useState('1'); 
  const [splitMode, setSplitMode] = useState('equal');
  
  // Search & Filters State (Criteria #7)
  const [searchQuery, setSearchQuery] = useState('');

  const addParticipant = (e) => {
    e.preventDefault();
    if(participants.length >= 4) { alert("Max 4 participants per group!"); return; }
    if(!newPartName) return;
    setParticipants([...participants, { id: Date.now().toString(), name: newPartName }]);
    setNewPartName('');
    setShowAddParticipant(false);
  };

  const addExpense = (e) => {
    e.preventDefault();
    if(!expenseDesc || !expenseAmount || participants.length === 0) return;
    
    let splits = [];
    let amt = Number(expenseAmount);
    
    if(splitMode === 'equal') {
      const splitAmt = amt / participants.length;
      splits = participants.map(p => ({ participant_id: p.id, amount_owed: splitAmt }));
    } else {
      // For presentation purposes, custom/percentage would require specific UI inputs per user
      alert("Only 'equal' split map logic provided in the UI mockup! Assigning equally.");
      const splitAmt = amt / participants.length;
      splits = participants.map(p => ({ participant_id: p.id, amount_owed: splitAmt }));
    }

    const newExp = {
      id: Date.now(),
      description: expenseDesc,
      amount: amt,
      payer_id: payerId,
      split_mode: splitMode,
      date: new Date().toLocaleDateString(),
      splits
    };

    setExpenses([...expenses, newExp]);
    setExpenseDesc('');
    setExpenseAmount('');
    setShowAddExpense(false);
  };

  // Compute Balances
  const netBalances = useMemo(() => calculateBalances(participants, expenses), [participants, expenses]);
  const settlements = useMemo(() => computeSettlements(netBalances), [netBalances]);

  const getPartName = (id) => participants.find(p => p.id === id)?.name || 'Unknown';
  
  // Apply Search & Filters
  const filteredExpenses = expenses.filter(e => 
    e.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>
        ← Back to Dashboard
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px' }}>{group.name}</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-primary" onClick={() => setShowAddParticipant(true)} style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>+ Person</button>
          <button className="btn-primary" onClick={() => setShowAddExpense(true)}>+ Expense</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Col: Expenses */}
        <div className="glass-panel" style={{ padding: 0 }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '14px', textTransform: 'uppercase' }}>Transactions</h3>
            <input 
              type="text" 
              placeholder="Search expenses..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ padding: '6px 12px', background: 'var(--bg-color)', border: '1px solid var(--border)', borderRadius: '6px', color: 'white', fontSize: '12px' }}
            />
          </div>
          {filteredExpenses.length === 0 && <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>No transactions found.</div>}
          {filteredExpenses.map(e => (
            <div key={e.id} className="list-item">
              <div>
                <strong style={{ display: 'block', fontSize: '14px' }}>{e.description}</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{e.date} • Paid by {getPartName(e.payer_id)}</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>₹ {e.amount.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Right Col: Balances & People */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: 0 }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
              <h3 style={{ margin: 0, fontSize: '14px', textTransform: 'uppercase' }}>Settlements (Who Owes Whom)</h3>
            </div>
            {settlements.length === 0 && <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>All settled up!</div>}
            {settlements.map((s, idx) => (
              <div key={idx} className="list-item" style={{ fontSize: '14px' }}>
                <span style={{ fontWeight: 500 }}>{getPartName(s.from)}</span>
                <span style={{ color: 'var(--text-secondary)' }}>owes</span>
                <span style={{ fontWeight: 500 }}>{getPartName(s.to)}</span>
                <strong style={{ color: 'var(--danger)' }}>₹ {Math.abs(s.amount).toLocaleString()}</strong>
              </div>
            ))}
          </div>

          <div className="glass-panel" style={{ padding: 0 }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
              <h3 style={{ margin: 0, fontSize: '14px', textTransform: 'uppercase' }}>Participants ({participants.length}/4)</h3>
            </div>
            {participants.map(p => (
              <div key={p.id} className="list-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{p.name}</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: netBalances[p.id] > 0 ? 'var(--accent)' : netBalances[p.id] < 0 ? 'var(--danger)' : 'var(--text-secondary)' }}>
                  {netBalances[p.id] > 0 ? '+' : ''}{netBalances[p.id]?.toFixed(0) || 0}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Modals placed below */}
      {showAddParticipant && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form className="glass-panel" style={{ width: '100%', maxWidth: '300px' }} onSubmit={addParticipant}>
            <h3 style={{ marginBottom: '16px' }}>Add Person</h3>
            <div className="input-group">
              <input autoFocus placeholder="Name (e.g. Alice)" value={newPartName} onChange={e=>setNewPartName(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={()=>setShowAddParticipant(false)} style={{ flex: 1, padding: '8px', border: '1px solid var(--border)', background: 'none', color: 'var(--text-primary)', borderRadius: '6px' }}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>Add</button>
            </div>
          </form>
        </div>
      )}

      {showAddExpense && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form className="glass-panel" style={{ width: '100%', maxWidth: '400px' }} onSubmit={addExpense}>
            <h3 style={{ marginBottom: '16px' }}>Add Expense</h3>
            <div className="input-group">
              <label>Description</label>
              <input autoFocus required placeholder="Dinner..." value={expenseDesc} onChange={e=>setExpenseDesc(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Amount (₹)</label>
              <input type="number" required placeholder="0.00" value={expenseAmount} onChange={e=>setExpenseAmount(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Who Paid?</label>
              <select style={{ width: '100%', padding: '10px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }} value={payerId} onChange={e=>setPayerId(e.target.value)}>
                {participants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
              <button type="button" onClick={()=>setShowAddExpense(false)} style={{ flex: 1, padding: '8px', border: '1px solid var(--border)', background: 'none', color: 'var(--text-primary)', borderRadius: '6px' }}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default GroupView;
