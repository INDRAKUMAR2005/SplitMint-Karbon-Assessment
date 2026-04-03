export function calculateBalances(participants, expenses) {
  const netBalances = {};
  participants.forEach(p => netBalances[p.id] = 0);

  expenses.forEach(exp => {
    // Payer gets credited (+)
    if(netBalances[exp.payer_id] !== undefined) {
      netBalances[exp.payer_id] += Number(exp.amount);
    }
    // Split debtors get debited (-)
    if (exp.splits) {
      exp.splits.forEach(split => {
        if(netBalances[split.participant_id] !== undefined) {
            netBalances[split.participant_id] -= Number(split.amount_owed);
        }
      });
    }
  });

  return netBalances;
}

export function computeSettlements(netBalances) {
  let debtors = [];
  let creditors = [];
  
  Object.keys(netBalances).forEach(id => {
    const val = netBalances[id];
    if (val > 0.01) creditors.push({ id, amount: val });
    else if (val < -0.01) debtors.push({ id, amount: -val });
  });

  // Sort by largest amounts first to minimize transactions
  debtors.sort((a,b) => b.amount - a.amount);
  creditors.sort((a,b) => b.amount - a.amount);

  const settlements = [];
  let d = 0, c = 0;
  
  while (d < debtors.length && c < creditors.length) {
    let debtor = debtors[d];
    let creditor = creditors[c];
    let min = Math.min(debtor.amount, creditor.amount);
    
    // Create settlement instruction
    settlements.push({ 
      from: debtor.id, 
      to: creditor.id, 
      amount: parseFloat(min.toFixed(2)) 
    });
    
    debtor.amount -= min;
    creditor.amount -= min;
    
    if (debtor.amount < 0.01) d++;
    if (creditor.amount < 0.01) c++;
  }

  return settlements;
}
