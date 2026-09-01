function showMsg(text, type) {
  document.getElementById('msgBox').innerHTML = `<div class="msg msg-${type}">${text}</div>`;
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = requireLogin();
  if (!user) return;
  renderNav('stock-out', user);

  const products = await apiCall('getProducts', {});
  document.getElementById('soProduct').innerHTML = products.map(p => `<option value="${p.ID}">${p.Name} (${p.Brand}) - Stock: ${p.Stock}</option>`).join('');

  document.getElementById('stockOutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await apiCall('stockOut', {
      productId: document.getElementById('soProduct').value,
      quantity: document.getElementById('soQty').value,
      sellingPrice: document.getElementById('soPrice').value,
      customerName: document.getElementById('soCustomer').value,
      referenceNo: document.getElementById('soRef').value
    });
    if (res.error) {
      const messages = { insufficient_stock: 'Not enough stock available.' };
      showMsg('Error: ' + (messages[res.error] || res.error), 'error');
      return;
    }
    showMsg('Stock out recorded successfully.', 'ok');
    document.getElementById('stockOutForm').reset();
  });
});
