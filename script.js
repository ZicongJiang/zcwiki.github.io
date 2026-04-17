// Build accordion menu from menu.json
async function buildMenu() {
  const res = await fetch('menu.json');
  if (!res.ok) {
    document.getElementById('menu').textContent = '目录加载失败';
    return;
  }
  const menu = await res.json();
  const container = document.getElementById('menu');

  for (const [category, items] of Object.entries(menu)) {
    const item = document.createElement('div');
    item.className = 'accordion-item';

    const header = document.createElement('div');
    header.className = 'accordion-header';
    header.innerHTML = `<span>${category}</span><span class="arrow">▶</span>`;
    item.appendChild(header);

    const ul = document.createElement('ul');
    ul.className = 'submenu';
    for (const [label, path] of Object.entries(items)) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = label;
      a.href = '#';
      a.addEventListener('click', e => {
        e.preventDefault();
        loadContent(path);
        container.querySelectorAll('a').forEach(x => x.classList.remove('active'));
        a.classList.add('active');
      });
      li.appendChild(a);
      ul.appendChild(li);
    }
    item.appendChild(ul);
    container.appendChild(item);

    header.addEventListener('click', () => {
      const expanded = header.classList.toggle('expanded');
      ul.classList.toggle('open', expanded);
    });
  }
}

// Resolve an image path against the markdown file's directory.
// Returns a root-relative path starting with / to avoid double-resolution.
function resolveImagePath(imgPath, mdPath) {
  const dir = mdPath.replace(/\/[^/]+$/, '/'); // "content/math/"
  const base = new URL(dir, window.location.href);
  return new URL(imgPath, base).pathname; // e.g. /image%2020260417164726.png
}

// Pre-process Obsidian wikilink images: ![[path]] → ![name](/resolved)
// If the wikilink has no path separator, treat it as vault-root relative.
function preprocessObsidianImages(md, mdPath) {
  return md.replace(/!\[\[([^\]]+)\]\]/g, (_, imgPath) => {
    imgPath = imgPath.trim();
    const name = imgPath.split('/').pop();
    // No path separators → Obsidian bare filename, look in /assets/
    const resolved = imgPath.includes('/')
      ? resolveImagePath(imgPath, mdPath)
      : '/assets/' + encodeURI(imgPath);
    return `![${name}](${resolved})`;
  });
}

// Generate in-page TOC from rendered headings and inject into sidebar
function buildTOC() {
  const toc = document.getElementById('toc');
  toc.innerHTML = '';

  const headings = document.querySelectorAll('#content h1, #content h2, #content h3');
  if (headings.length === 0) {
    toc.style.display = 'none';
    return;
  }

  toc.style.display = 'block';
  const label = document.createElement('div');
  label.className = 'toc-label';
  label.textContent = 'On this page';
  toc.appendChild(label);

  const ul = document.createElement('ul');
  headings.forEach((h, i) => {
    // Add anchor id so we can scroll to it
    if (!h.id) h.id = `heading-${i}`;

    const li = document.createElement('li');
    li.className = `toc-${h.tagName.toLowerCase()}`;
    const a = document.createElement('a');
    a.textContent = h.textContent;
    a.href = `#${h.id}`;
    a.addEventListener('click', e => {
      e.preventDefault();
      h.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    li.appendChild(a);
    ul.appendChild(li);
  });
  toc.appendChild(ul);
}

// Load content: render Markdown or embed PDF/HTML
async function loadContent(path) {
  const contentEl = document.getElementById('content');

  if (/.pdf$/i.test(path) || /.html?$/i.test(path)) {
    contentEl.innerHTML = `<iframe src="${path}"></iframe>`;
    document.getElementById('toc').style.display = 'none';
    return;
  }

  const res = await fetch(path);
  if (!res.ok) {
    contentEl.innerHTML = `<p style="color:red">加载失败：${path}</p>`;
    return;
  }
  let md = await res.text();

  // Fix Obsidian image syntax and resolve relative image paths
  md = preprocessObsidianImages(md, path);

  // Custom marked renderer: resolve relative image paths, but skip paths
  // that are already absolute or root-relative (pre-processed Obsidian images).
  const renderer = new marked.Renderer();
  renderer.image = (href, title, text) => {
    const src = typeof href === 'object' ? href.href : href;
    const alt = typeof href === 'object' ? href.text : text;
    const resolved = /^https?:\/\/|^\//.test(src) ? src : resolveImagePath(src, path);
    return `<img src="${resolved}" alt="${alt || ''}"${title ? ` title="${title}"` : ''} style="max-width:100%;height:auto;">`;
  };

  contentEl.innerHTML = marked.parse(md, { renderer });

  if (window.MathJax && window.MathJax.typesetPromise) {
    MathJax.typesetPromise([contentEl]).catch(err => console.log('MathJax error:', err));
  }

  buildTOC();
}

document.addEventListener('DOMContentLoaded', buildMenu);
