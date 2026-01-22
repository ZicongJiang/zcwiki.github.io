// 动态生成手风琴菜单
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

    // header
    const header = document.createElement('div');
    header.className = 'accordion-header';
    header.innerHTML = `<span>${category}</span><span class="arrow">▶</span>`;
    item.appendChild(header);

    // 子菜单
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
        // 高亮当前
        container.querySelectorAll('a').forEach(x => x.classList.remove('active'));
        a.classList.add('active');
      });
      li.appendChild(a);
      ul.appendChild(li);
    }
    item.appendChild(ul);
    container.appendChild(item);

    // 手风琴切换逻辑
    header.addEventListener('click', () => {
      const expanded = header.classList.toggle('expanded');
      ul.classList.toggle('open', expanded);
    });
  }
}

// 加载内容：Markdown 渲染或 PDF/HTML 嵌入
// script.js

async function loadContent(path) {
  const contentEl = document.getElementById('content');
  if (/.pdf$/i.test(path) || /.html?$/i.test(path)) {
    contentEl.innerHTML = `<iframe src="${path}"></iframe>`;
    return;
  }
  const res = await fetch(path);
  if (!res.ok) {
    contentEl.innerHTML = `<p style="color:red">加载失败：${path}</p>`;
    return;
  }
  const md = await res.text();
  
  // 1. Convert Markdown to HTML
  contentEl.innerHTML = marked.parse(md);

  // 2. NEW: Tell MathJax to render the math in the new content
  if (window.MathJax && window.MathJax.typesetPromise) {
    MathJax.typesetPromise([contentEl]).catch(err => console.log('MathJax error:', err));
  }
}

document.addEventListener('DOMContentLoaded', buildMenu);
