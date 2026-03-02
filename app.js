const container = document.querySelector('.inner');
const tabs = document.querySelectorAll('.tablinks');
const pages = ['One', 'Two', 'Three'];
let currentPage = 0;

function openCity(evt, cityName) {
  tabs.forEach(t => t.classList.remove('active'));
  evt.currentTarget.classList.add('active');
  currentPage = pages.indexOf(cityName);
  container.scrollTo({ left: window.innerWidth * currentPage, behavior: 'smooth' });
}

let isScrolling = false;

document.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (isScrolling) return;
  
  isScrolling = true;
  
  if (e.deltaY > 0 && currentPage < pages.length - 1) currentPage++;
  else if (e.deltaY < 0 && currentPage > 0) currentPage--;
  
  container.scrollTo({ left: 1000 * currentPage, behavior: 'smooth' });
  tabs.forEach(t => t.classList.remove('active'));
  tabs[currentPage].classList.add('active');

  setTimeout(() => { isScrolling = false; }, 600); // wait for scroll animation to finish
}, { passive: false });

document.addEventListener("DOMContentLoaded", () => {
  updateDateTime();
  setInterval(updateDateTime, 1000);
  renderAll()
});

function updateDateTime() {
  let date = new Date().toLocaleDateString();
  let time = new Date().toLocaleTimeString();
  document.getElementById("info").innerHTML = `${time} | ${date}`;
}

function openSettings(){
  document.getElementById("settings").classList.toggle("open");
  renderSettingsPanel();
}

const defaultData = {
  pages: {
    One:   { image: null, categories: [{ name: "Category 1", links: [] }, { name: "Category 2", links: [] }, { name: "Category 3", links: [] }] },
    Two:   { image: null, categories: [{ name: "Category 1", links: [] }, { name: "Category 2", links: [] }, { name: "Category 3", links: [] }] },
    Three: { image: null, categories: [{ name: "Category 1", links: [] }, { name: "Category 2", links: [] }, { name: "Category 3", links: [] }] }
  }
};

let data = JSON.parse(localStorage.getItem('tabtownData')) || defaultData;

function saveData() {
  localStorage.setItem('tabtownData', JSON.stringify(data));
}

function renderPage(pageId) {
  const page = data.pages[pageId];
  const container = document.getElementById(pageId);
  container.innerHTML = `
    <div class="page-image">
      ${page.image 
        ? `<img src="${page.image}" alt="Page image" />` 
        : `<div class="image-placeholder">No image</div>`}
    </div>
    <div class="page-categories">
      ${page.categories.map((cat, i) => `
        <div class="category">
          <h3>${cat.name}</h3>
          <ul>
            ${cat.links.map(link => `
              <li><a href="${link.url}" target="_blank">${link.label}</a></li>
            `).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  `;
}

function renderAll() {
  pages.forEach(p => renderPage(p));
}

function renderSettingsPanel() {
  const pageId = document.getElementById('settingsPageSelect').value;
  const categories = data.pages[pageId].categories;
  const settingsContainer = document.getElementById('settingsCategoryList');

  settingsContainer.innerHTML = `
    <div class="settings-image">
      <h3>Page Image</h3>
      ${data.pages[pageId].image 
        ? `<img src="${data.pages[pageId].image}" style="width:100%;margin-bottom:0px;border-radius:5px;" />` 
        : ''}
      <input type="file" accept="image/*" onchange="uploadImage('${pageId}', this)" />
      ${data.pages[pageId].image 
        ? `<button onclick="removeImage('${pageId}')">Remove Image</button>` 
        : ''}
    </div>
    ${categories.map((cat, i) => `
      <div class="settings-category">
        <input type="text" value="${cat.name}" onchange="renameCategory('${pageId}', ${i}, this.value)" />
        <ul>
          ${cat.links.map((link, j) => `
            <li>
              <span>${link.label}</span>
              <button onclick="removeLink('${pageId}', ${i}, ${j})">✕</button>
            </li>
          `).join('')}
        </ul>
        <input type="text" id="label-${pageId}-${i}" placeholder="Label" />
        <input type="text" id="url-${pageId}-${i}" placeholder="https://" />
        <button onclick="addLink('${pageId}', ${i})">Add Link</button>
      </div>
    `).join('')}
  `;
}

function renameCategory(pageId, catIndex, newName) {
  data.pages[pageId].categories[catIndex].name = newName;
  saveData();
  renderPage(pageId);
}

function addLink(pageId, catIndex) {
  const label = document.getElementById(`label-${pageId}-${catIndex}`).value.trim();
  const url = document.getElementById(`url-${pageId}-${catIndex}`).value.trim();
  if (!label || !url) return;
  data.pages[pageId].categories[catIndex].links.push({ label, url });
  saveData();
  renderPage(pageId);
  renderSettingsPanel();
}

function removeLink(pageId, catIndex, linkIndex) {
  data.pages[pageId].categories[catIndex].links.splice(linkIndex, 1);
  saveData();
  renderPage(pageId);
  renderSettingsPanel();
}

function uploadImage(pageId, input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    data.pages[pageId].image = e.target.result;
    saveData();
    renderPage(pageId);
    renderSettingsPanel();
  };
  reader.readAsDataURL(file);
}

function removeImage(pageId) {
  data.pages[pageId].image = null;
  saveData();
  renderPage(pageId);
  renderSettingsPanel();
}