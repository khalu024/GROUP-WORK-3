const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const addButton = document.getElementById('add-transaction');
const clearButton = document.getElementById('clear-transactions');
const transactionTable = document.getElementById('transaction-table');
const totalIncome = document.getElementById('total-income');
const totalExpenses = document.getElementById('total-expenses');
const balance = document.getElementById('balance');

// Load transactions from local storage
const storedTransactions = localStorage.getItem('transactions');
if (storedTransactions) {
  const transactions = JSON.parse(storedTransactions);
  displayTransactions(transactions);
  calculateTotals(transactions);
}

// Add transaction
addButton.addEventListener('click', () => {
  const description = descriptionInput.value;
  const amount = parseFloat(amountInput.value);
  const type = typeSelect.value;

  if (description && amount) {
    const transaction = { description, amount, type };
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    displayTransactions(transactions);
    calculateTotals(transactions);

    descriptionInput.value = '';
    amountInput.value = '';
  }
});

// Clear all transactions
clearButton.addEventListener('click', () => {
  localStorage.removeItem('transactions');
  transactionTable.innerHTML = `
    <thead>
      <tr>
        <th>Description</th>
        <th>Amount</th>
        <th>Type</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  totalIncome.textContent = '$0.00';
  totalExpenses.textContent = '$0.00';
  balance.textContent = '$0.00';
});

// Display transactions in the table
function displayTransactions(transactions) {
  transactionTable.innerHTML = `
    <thead>
      <tr>
        <th>Description</th>
        <th>Amount</th>
        <th>Type</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      ${transactions.map((transaction, index) => `
        <tr>
          <td>${transaction.description}</td>
          <td>${transaction.amount.toFixed(2)}</td>
          <td>${transaction.type}</td>
          <td><button class="delete-button" data-index="${index}">Delete</button></td>
        </tr>
      `).join('')}
    </tbody>
  `;

  // Add event listeners for delete buttons
  const deleteButtons = document.querySelectorAll('.delete-button');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = button.dataset.index;
      const transactions = JSON.parse(localStorage.getItem('transactions'));
      transactions.splice(index, 1);
      localStorage.setItem('transactions', JSON.stringify(transactions));
      displayTransactions(transactions);
      calculateTotals(transactions);
    });
  });
}

// Calculate and display total income, expenses, and balance
function calculateTotals(transactions) {
  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netBalance = income - expenses;

  totalIncome.textContent = `$${income.toFixed(2)}`;
  totalExpenses.textContent = `$${expenses.toFixed(2)}`;
  balance.textContent = `$${netBalance.toFixed(2)}`;
}