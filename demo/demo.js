const container = document.querySelector('.inner');
const tabs = document.querySelectorAll('.tablinks');
const pages = ['One', 'Two', 'Three'];
let currentPage = 0;

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const data = {
  pages: {
    One: { image: "images/One.jpg",
      categories: [
        { name: "Media", links: [
          { label: "YouTube", url: "https://youtube.com" },
          { label: "AniList", url: "https://anilist.co" },
          { label: "MyAnimeList", url: "https://myanimelist.net" },
          { label: "Last.fm", url: "https://www.last.fm/" },
          { label: "DoubleDouble", url: "https://us.doubledouble.top/" },
        ]},
        { name: "Socials", links: [
          { label: "Reddit", url: "https://reddit.com" },
          { label: "Tumblr", url: "https://tumblr.com" },
          { label: "Neocities", url: "https://neocities.org" },
          { label: "Nekoweb", url: "https://nekoweb.org" }
        ]},
        { name: "General", links: [
          { label: "NeoSearch", url: "https://neosearch.site/" },
          { label: "ProtonMail", url: "https://proton.me" },
          { label: "Calendar", url: "https://proton.me/calendar" }
        ]}
      ]},
    Two: { image: "images/Two.jpg",
      categories: [
        { name: "Dev", links: [
          { label: "GitHub", url: "https://github.com" },
          { label: "Netlify", url: "https://netlify.com" },
          { label: "Cloudflare", url: "https://cloudflare.com" },
          { label: "W3Schools", url: "https://www.w3schools.com/" },
          { label: "MDN", url: "https://developer.mozilla.org" }
        ]},
        { name: "Tools", links: [
          { label: "PDF24 Tools", url: "https://tools.pdf24.org/en/" },
          { label: "Dither It!", url: "https://ditherit.com/" },
          { label: "Ray.so", url: "https://ray.so" },
          { label: "Color Hunt", url: "https://colorhunt.co" }
        ]},
        { name: "Games", links: [
          { label: "Chess", url: "https://www.chess.com/home" },
          { label: "NYT Games", url: "https://www.nytimes.com/crosswords" },
          { label: "Sudoku", url: "https://sudoku.coach/" }
        ]}
      ]},
    Three: { image: "images/Three.jpg",
      categories: [
        { name: "Reading", links: [
          { label: "ZLibrary", url: "https://www.reddit.com/r/zlibrary/" },
          { label: "Bookfinder", url: "https://www.bookfinder.com/" },
          { label: "Libby", url: "https://libbyapp.com" }
        ]},
        { name: "Creative", links: [
          { label: "Pixilart", url: "https://www.pixilart.com/" },
          { label: "Pinterest", url: "https://pinterest.com" },
          { label: "Photopea", url: "https://www.photopea.com/" },
          { label: "Upset.Dev Fonts", url: "https://upset.dev/fonts" }
        ]},
        { name: "Misc", links: [
          { label: "Wikipedia", url: "https://www.wikipedia.org/" },
          { label: "Wayback Machine", url: "https://web.archive.org" }
        ]}
      ]}
  }
};

function renderPage(pageId) {
  const page = data.pages[pageId];
  const el = document.getElementById(pageId);
  el.innerHTML = `
    <div class="page-image">
      ${page.image ? `<img src="${page.image}" alt="Page image" />` : `<div class="image-placeholder">No image</div>`}
    </div>
    <div class="page-categories">
      ${page.categories.map(cat => `
        <div class="category">
          <h3>${escapeHtml(cat.name)}</h3>
          <ul>
            ${cat.links.map(link => `
              <li><a href="${escapeHtml(link.url)}" target="_blank">${escapeHtml(link.label)}</a></li>
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

function updateDateTime() {
  let date = new Date().toLocaleDateString();
  let time = new Date().toLocaleTimeString();
  document.getElementById("info").innerHTML = `${time} | ${date}`;
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
  setTimeout(() => { isScrolling = false; }, 600);
}, { passive: false });

document.addEventListener("DOMContentLoaded", () => {
  updateDateTime();
  setInterval(updateDateTime, 1000);
  renderAll();
  tabs[0].addEventListener('click', (e) => openCity(e, 'One'));
  tabs[1].addEventListener('click', (e) => openCity(e, 'Two'));
  tabs[2].addEventListener('click', (e) => openCity(e, 'Three'));
});

function openCity(evt, cityName) {
  tabs.forEach(t => t.classList.remove('active'));
  evt.currentTarget.classList.add('active');
  currentPage = pages.indexOf(cityName);
  container.scrollTo({ left: 1000 * currentPage, behavior: 'smooth' });
}