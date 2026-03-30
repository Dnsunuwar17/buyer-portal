const token = localStorage.getItem('token');

if (!token) window.location.href = '/login.html';

document.getElementById('user-name').textContent = localStorage.getItem('name') || '';
document.getElementById('user-role').textContent = localStorage.getItem('role') || '';

document.getElementById('logout-btn').addEventListener('click', function () {
    localStorage.clear();
    window.location.href = '/login.html';
});

function showError(message) {
    const banner = document.getElementById('error-banner');
    banner.textContent = message;
    banner.style.display = 'block';
    setTimeout(() => { banner.style.display = 'none'; }, 4000);
}

// Displays properties
async function loadProperties() {
    try {
        const res = await fetch('/api/favourites/properties', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        // Auth error handling: if token is invalid/expired
        if (res.status === 401 || res.status === 403) {
            localStorage.clear();
            window.location.href = '/login.html';
            return;
        }

        const properties = await res.json();
        renderAllProperties(properties);
        renderMyFavourites(properties.filter(p => p.is_favourited));

    } catch (err) {
        document.getElementById('all-properties').innerHTML =
            '<p>Failed to load properties.</p>';
    }
}

function formatPrice(price) {
    return 'Rs ' + price.toLocaleString('ne-NP');
}

function renderAllProperties(properties) {
    const grid = document.getElementById('all-properties');

    if (properties.length === 0) {
        grid.innerHTML = '<p>No properties available.</p>';
        return;
    }

    grid.innerHTML = properties.map(p => `
        <div class="property-card" id="card-${p.id}">
          <h3>${p.title}</h3>
          <p class="address">${p.address}</p>
          <p class="price">${formatPrice(p.price)}</p>
          <button
            class="fav-btn ${p.is_favourited ? 'remove' : 'add'}"
            data-id="${p.id}"
            data-favourited="${p.is_favourited}">
            ${p.is_favourited ? 'Remove from favourites' : 'Add to favourites'}
          </button>
        </div>
      `).join('');

    grid.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', async function () {
            const propertyId = parseInt(this.dataset.id);
            const isFavourited = parseInt(this.dataset.favourited);

            this.disabled = true;
            this.textContent = 'Updating...';

            await toggleFavourite(propertyId, isFavourited, this);
        });
    });
}

function renderMyFavourites(favourites) {
    const grid = document.getElementById('my-favourites');
    if (favourites.length === 0) {
        grid.innerHTML = '<p style="color:#888;">You have no favourites yet. Add some above!</p>';
        return;
    }
    grid.innerHTML = favourites.map(p => `
        <div class="property-card">
          <h3>${p.title}</h3>
          <p class="address">${p.address}</p>
          <p class="price">${formatPrice(p.price)}</p>
        </div>
      `).join('');
}

async function toggleFavourite(propertyId, isFavourited, btn) {
    const method = isFavourited ? 'DELETE' : 'POST';

    try {
        const res = await fetch(`/api/favourites/${propertyId}`, {
            method,
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            const nowFavourited = isFavourited ? 0 : 1;

            // Update button state
            btn.dataset.favourited = nowFavourited;
            btn.className = `fav-btn ${nowFavourited ? 'remove' : 'add'}`;
            btn.textContent = nowFavourited ? 'Remove from favourites' : 'Add to favourites';
            btn.disabled = false;

            // Refresh only the My Favourites section
            const allCards = document.querySelectorAll('[data-favourited]');
            const favourited = [];
            allCards.forEach(b => {
                if (parseInt(b.dataset.favourited)) {
                    const card = b.closest('.property-card');
                    favourited.push({
                        title: card.querySelector('h3').textContent,
                        address: card.querySelector('.address').textContent,
                        price: card.querySelector('.price').textContent,
                    });
                }
            });

            const favGrid = document.getElementById('my-favourites');
            if (favourited.length === 0) {
                favGrid.innerHTML = '<p style="color:#888;">You have no favourites yet. Add some above!</p>';
            } else {
                favGrid.innerHTML = favourited.map(p => `
              <div class="property-card">
                <h3>${p.title}</h3>
                <p class="address">${p.address}</p>
                <p class="price">${p.price}</p>
              </div>
            `).join('');
            }

        } else {
            const data = await res.json();
            showError(data.error || 'Something went wrong.');
            btn.disabled = false;
            btn.textContent = isFavourited ? 'Remove from favourites' : 'Add to favourites';
        }

    } catch (err) {
        showError('Could not connect to server. Please try again.');
        btn.disabled = false;
        btn.textContent = isFavourited ? 'Remove from favourites' : 'Add to favourites';
    }
}

loadProperties();