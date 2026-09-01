let allProducts = [];

function renderProducts(list) {
  const tbody = document.getElementById('productsBody');
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-note">No products found.</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(p => {
    const low = Number(p.Stock) <= Number(p.ReorderLevel);
    return `
      <tr>
        <td>${p.ID}</td>
        <td>${p.Name}</td>
        <td>${p.Brand}</td>
        <td>\u20B1${Number(p.Price).toLocaleString()}</td>
        <td>${p.Stock}</td>
        <td><span class="status-tag ${low ? 'status-low' : 'status-active'}">${low ? 'Low Stock' : 'Available'}</span></td>
      </tr>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = requireLogin();
  if (!user) return;
  renderNav('products', user);

  allProducts = await apiCall('getProducts', {});
  if (!Array.isArray(allProducts)) allProducts = [];
  renderProducts(allProducts);

  document.getElementById('searchBox').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    renderProducts(allProducts.filter(p =>
      p.Name.toLowerCase().includes(q) || p.Brand.toLowerCase().includes(q)
    ));
  });

  const modal = document.getElementById('productModal');
  document.getElementById('addProductBtn').addEventListener('click', () => modal.classList.add('open'));
  document.getElementById('cancelProductBtn').addEventListener('click', () => modal.classList.remove('open'));

  document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await apiCall('addProduct', {
      name: document.getElementById('pName').value,
      brand: document.getElementById('pBrand').value,
      category: document.getElementById('pCategory').value,
      price: document.getElementById('pPrice').value,
      cost: document.getElementById('pCost').value,
      stock: document.getElementById('pStock').value,
      reorderLevel: document.getElementById('pReorder').value
    });
    if (res.error) { alert('Error: ' + res.error); return; }
    modal.classList.remove('open');
    document.getElementById('productForm').reset();
    allProducts = await apiCall('getProducts', {});
    renderProducts(allProducts);
  });
});
