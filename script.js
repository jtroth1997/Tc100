const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.main-nav');

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

// Initial Tilers Community launch profiles. These will move to the member-managed directory when accounts launch.
const directory = [
  { name: '550 Interiors Limited', address: '20A Rabone Lane, Smethwick, B66 3JH', region: 'West Midlands', types: ['tiler', 'service'] },
  { name: 'A & L Tiling Ltd', address: 'United Kingdom', region: 'UK', types: ['tiler'] },
  { name: 'A & R Tiles Ltd', address: '2 Salisbury Road, Shaftesbury, Dorset, SP7 8BT', region: 'Dorset', types: ['retailer', 'tile', 'product'] },
  { name: 'A Andrews & Sons (Marbles & Tiles) Ltd – Glasgow', address: 'Unit 3, London Road Trade Park, Cambuslang, Glasgow, G32 8YQ', region: 'Glasgow', types: ['retailer', 'tile', 'product'] },
  { name: 'A Andrews Tiles – Leeds, Meanwood', address: '324–330 Meanwood Road, Leeds, LS7 2JE', region: 'Leeds', types: ['retailer', 'tile', 'product'] },
  { name: 'A Andrews Tiles – Leeds, Seacroft', address: 'Limewood Approach, Leeds, LS14 1NG', region: 'Leeds', types: ['retailer', 'tile', 'product'] },
  { name: 'A Andrews Tiles – Stockport', address: 'Unit 3, 25 Lingard Lane, Bredbury Park Industrial Estate, Stockport, SK6 2TG', region: 'Stockport', types: ['retailer', 'tile', 'product'] },
  { name: 'A De Cecco Ltd', address: '33 Weardale Lane, Queenslie Industrial Estate, Glasgow, G33 4JJ', region: 'Glasgow', types: ['retailer', 'tile', 'product'] },
  { name: 'A. Cumberlidge Ltd', address: 'Unit 2 Bentley Business Park, Church Lane, Dinnington, Sheffield, S25 2RG', region: 'Sheffield', types: ['service', 'product'] },
  { name: 'A&B Flooring Ltd', address: 'Unit 15, Access 4:20, New Hythe Business Park, Aylesford, Kent, ME20 7HP', region: 'Kent', types: ['tiler', 'service'] },
  { name: 'A1 Tiling Ltd', address: '9–10 Cross Street, Preston, PR1 3LT', region: 'Preston', types: ['tiler'] },
  { name: 'ABD Ceramics Ltd', address: 'Unit 12 Riverside, Bolton, BL2 4NA', region: 'Bolton', types: ['retailer', 'tile', 'product'] },
  { name: 'ADH Tiling Ltd', address: 'Profile contact details being confirmed', region: 'UK', types: ['tiler'] },
  { name: 'AGH Ceramics', address: 'Profile contact details being confirmed', region: 'UK', types: ['tiler', 'service'] },
  { name: 'Airey Tiling', address: 'Profile contact details being confirmed', region: 'UK', types: ['tiler'] }
];

const labels = { tiler: 'Tiler / contractor', retailer: 'Tile retailer', tile: 'Tile supplier', product: 'Product supplier', service: 'Specialist service' };
let finderType = 'tiler';
const results = document.querySelector('#directory-results');
const message = document.querySelector('#search-message');
const input = document.querySelector('#postcode');
const profileDialog = document.querySelector('#profile-dialog');
const profileContent = document.querySelector('#profile-content');

function renderResults(items, query, exactMatch) {
  results.innerHTML = '';
  results.classList.add('visible');
  const heading = document.createElement('div');
  heading.className = 'results-heading';
  heading.innerHTML = `<div><small>Directory results</small><strong>${items.length} ${items.length === 1 ? 'business' : 'businesses'} shown</strong></div><span>${labels[finderType]}</span>`;
  results.appendChild(heading);
  items.forEach((business) => {
    const card = document.createElement('article');
    card.className = 'result-card';
    card.innerHTML = `<div class="result-monogram" aria-hidden="true">${business.name.charAt(0)}</div><div class="result-copy"><span class="result-type">${business.types.map((type) => labels[type]).filter(Boolean).join(' · ')}</span><h3>${business.name}</h3><p>${business.address}</p><small>${business.region}</small></div><button class="profile-button" type="button">View profile →</button>`;
    card.querySelector('.profile-button').addEventListener('click', () => openProfile(business));
    results.appendChild(card);
  });
  message.textContent = exactMatch ? `Tilers Community profiles matching “${query}”.` : `No exact text match for “${query}”, so we’re showing relevant ${labels[finderType].toLowerCase()} profiles.`;
}

function openProfile(business) {
  profileContent.innerHTML = `<span class="result-type">Tilers Community profile</span><h2>${business.name}</h2><p class="profile-role">${business.types.map((type) => labels[type]).filter(Boolean).join(' · ')}</p><div class="profile-address"><small>Location</small><strong>${business.address}</strong><span>${business.region}</span></div><div class="profile-checklist"><h3>Before appointing any business</h3><ul><li>Ask for suitable insurance details</li><li>Review recent, relevant work and references</li><li>Get a written quotation and agreed scope</li><li>Confirm preparation, materials and timescales</li></ul></div><a class="button button-green" href="mailto:hello@tilerscommunity.co.uk?subject=Enquiry about ${encodeURIComponent(business.name)}">Request contact details <span>→</span></a>`;
  profileDialog.showModal();
}

document.querySelector('.dialog-close').addEventListener('click', () => profileDialog.close());
profileDialog.addEventListener('click', (event) => {
  if (event.target === profileDialog) profileDialog.close();
});

document.querySelectorAll('.finder-tabs button').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.finder-tabs button').forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  finderType = button.dataset.type;
  message.textContent = '';
  results.innerHTML = '';
  results.classList.remove('visible');
}));

document.querySelector('#finder-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const query = input.value.trim();
  const normalised = query.toLowerCase().replace(/\s+/g, ' ');
  const typeMatches = directory.filter((business) => business.types.includes(finderType));
  const exactMatches = typeMatches.filter((business) => `${business.name} ${business.address} ${business.region}`.toLowerCase().includes(normalised));
  renderResults((exactMatches.length ? exactMatches : typeMatches).slice(0, 8), query, exactMatches.length > 0);
  results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

document.querySelector('#year').textContent = new Date().getFullYear();
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
