// Global state
const contentEl = document.getElementById('content');
const spinner = document.getElementById('loading-spinner');

// 1. Build the Menu
async function buildMenu() {
  try {
    const res = await fetch('menu.json');
    if (!res.ok) throw new Error("Could not fetch menu.json");
    
    const menu = await res.json();
    const container = document.getElementById('menu');
    container.innerHTML = ''; // Clear existing

    // Loop through categories
    for (const [category, items] of Object.entries(menu)) {
      const item = document.createElement('div');
      item.className = 'accordion-item';

      // Header
      const header = document.createElement('div');
      header.className = 'accordion-header';
      header.innerHTML = `<span>${category}</span><span class="arrow">▶</span>`;
      
      // Submenu
      const ul = document.createElement('ul');
      ul.className = 'submenu';

      // Automatically expand if this category was previously open (optional)
      // For now, let's keep them closed by default.

      for (const [label, path] of Object.entries(items)) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = label;
        a.href = '#';
        
        a.addEventListener('click', async (e) => {
          e.preventDefault();
          // Highlight active link
          document.querySelectorAll('.submenu a').forEach(el => el.classList.remove('active'));
          a.classList.add('active');
          
          // Load content
          await loadContent(path);
        });

        li.appendChild(a);
        ul.appendChild(li);
      }

      item.appendChild(header);
      item.appendChild(ul);
      container.appendChild(item);

      // Accordion Toggle
      header.addEventListener('click', () => {
        const isExpanded = header.classList.toggle('expanded');
        ul.classList.toggle('open', isExpanded);
      });
    }
  } catch (error) {
    console.error(error);
    document.getElementById('menu').innerHTML = `<p style="color:red; padding:1rem;">Error loading menu.</p>`;
  }
}

// 2. Load Content (Markdown, PDF, HTML)
async function loadContent(path) {
  // Show Spinner
  spinner.classList.remove('hidden');
  contentEl.style.opacity = '0.5';

  try {
    // Case 1: PDF or HTML file -> Use Iframe
    if (/\.pdf$/i.test(path) || /\.html?$/i.test(path)) {
      contentEl.innerHTML = `<iframe src="${path}"></iframe>`;
    } 
    // Case 2: Markdown file -> Fetch and Render
    else {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`Failed to load ${path}`);
      
      const md = await res.text();
      
      // Convert Markdown to HTML using Marked.js
      contentEl.innerHTML = marked.parse(md);

      // Render MathJax equations
      if (window.MathJax && window.MathJax.typesetPromise) {
        await MathJax.typesetPromise([contentEl]);
      }
    }
  } catch (err) {
    contentEl.innerHTML = `
      <div style="color:#ef4444; padding: 2rem; border: 1px solid #fee2e2; background: #fef2f2; border-radius: 8px;">
        <h3>⚠️ Load Error</h3>
        <p>${err.message}</p>
      </div>
    `;
  } finally {
    // Hide Spinner
    spinner.classList.add('hidden');
    contentEl.style.opacity = '1';
    // Scroll to top
    document.getElementById('main-container').scrollTop = 0;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', buildMenu);