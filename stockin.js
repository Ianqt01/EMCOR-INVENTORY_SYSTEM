function showMsg(text, type) {
  document.getElementById('msgBox').innerHTML = `<div class="msg msg-${type}">${text}</div>`;
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = requireLogin();
  if (!user) return;
  renderNav('stock-in', user);

  const [products, suppliers] = await Promise.all([
    apiCall('getProducts', {}),
    apiCall('getSuppliers', {})
  ]);

  document.getElementById('siProduct').innerHTML = products.map(p => `<option value="${p.ID}">${p.Name} (${p.Brand})</option>`).join('');
  document.getElementById('siSupplier').innerHTML = suppliers.map(s => `<option value="${s.ID}">${s.Name}</option>`).join('');

  document.getElementById('stockInForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await apiCall('stockIn', {
      productId: document.getElementById('siProduct').value,
      supplierId: document.getElementById('siSupplier').value,
      quantity: document.getElementById('siQty').value,
      costPrice: document.getElementById('siCost').value,
      referenceNo: document.getElementById('siRef').value
    });
    if (res.error) { showMsg('Error: ' + res.error, 'error'); return; }
    showMsg('Stock in recorded successfully.', 'ok');
    document.getElementById('stockInForm').reset();
  });
});
