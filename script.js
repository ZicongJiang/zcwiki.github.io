// ═══════════════════════════════════════════════════════════════
// 1. 数学公式保护
//    原因：marked.js 会把 _ 转成 <em>，把 \ 转义，破坏 LaTeX。
//    方案：渲染前把 $...$ / $$...$$ 替换成不可见占位符，渲染后还原。
// ═══════════════════════════════════════════════════════════════
function protectMath(md) {
  const store = [];
  const token = i => `\x02MATH${i}\x03`; // \x02/\x03 是不可打印字符，marked 不会碰它们

  // 必须先匹配块级 $$...$$，再匹配行内 $...$
  md = md.replace(/\$\$([\s\S]*?)\$\$/g, match => {
    store.push(match);
    return token(store.length - 1);
  });
  md = md.replace(/\$([^\$\n]+?)\$/g, match => {
    store.push(match);
    return token(store.length - 1);
  });

  return { md, store };
}

function restoreMath(html, store) {
  return html.replace(/\x02MATH(\d+)\x03/g, (_, i) => store[Number(i)]);
}

// ═══════════════════════════════════════════════════════════════
// 2. GitHub 风格 heading slug（与 GitHub Pages / Obsidian 兼容）
//    原因：Markdown 内的目录链接 [text](#1-q-因子) 使用的 anchor
//          必须与渲染后 <h2 id="..."> 完全一致。
//    规则：小写 → 移除非字母/数字/连字符/CJK → 空格换连字符
// ═══════════════════════════════════════════════════════════════
function slugify(str) {
  // 去掉 heading 文字里可能带的 HTML 标签（如加粗/行内代码）
  str = str.replace(/<[^>]+>/g, '');
  return str
    .toLowerCase()
    // 保留：ASCII 字母数字、下划线(\w)、连字符、空格、CJK 统一汉字
    .replace(/[^\w\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff -]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// ═══════════════════════════════════════════════════════════════
// 3. 构建左侧手风琴菜单
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
// 4. 图片路径解析（保持原有逻辑不变）
// ═══════════════════════════════════════════════════════════════
function resolveImagePath(imgPath, mdPath) {
  const dir = mdPath.replace(/\/[^/]+$/, '/');
  const base = new URL(dir, window.location.href);
  return new URL(imgPath, base).pathname;
}

function preprocessObsidianImages(md, mdPath) {
  return md.replace(/!\[\[([^\]]+)\]\]/g, (_, imgPath) => {
    imgPath = imgPath.trim();
    const name = imgPath.split('/').pop();
    const resolved = imgPath.includes('/')
      ? resolveImagePath(imgPath, mdPath)
      : '/assets/' + encodeURI(imgPath);
    return `![${name}](${resolved})`;
  });
}

// ═══════════════════════════════════════════════════════════════
// 5. 侧边栏页内 TOC（利用 renderer 已设置好的 id，不再覆盖）
// ═══════════════════════════════════════════════════════════════
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
    // id 已由 renderer.heading 设置；若万一缺失才回退
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

// ═══════════════════════════════════════════════════════════════
// 6. 核心：加载并渲染内容
// ═══════════════════════════════════════════════════════════════
async function loadContent(path) {
  const contentEl = document.getElementById('content');

  // PDF / HTML：直接 iframe 嵌入
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

  // 处理 Obsidian 图片语法
  md = preprocessObsidianImages(md, path);

  // ── 步骤 A：保护数学公式（在 marked 渲染之前）──────────────
  const { md: safeMd, store } = protectMath(md);

  // ── 步骤 B：配置 marked 自定义渲染器 ───────────────────────
  const renderer = new marked.Renderer();

  // B-1: heading → 生成 GitHub 兼容的 id（使 Markdown 内目录链接可用）
  renderer.heading = function (token, level) {
    // marked v4+ 传入 token 对象；v3 传入 (text, level)
    const text  = typeof token === 'object' ? token.text  : token;
    const depth = typeof token === 'object' ? token.depth : level;
    const id = slugify(text);
    return `<h${depth} id="${id}">${text}</h${depth}>\n`;
  };

  // B-2: image → 解析相对路径
  renderer.image = (href, title, text) => {
    const src      = typeof href === 'object' ? href.href : href;
    const alt      = typeof href === 'object' ? href.text : text;
    const resolved = /^https?:\/\/|^\//.test(src) ? src : resolveImagePath(src, path);
    return `<img src="${resolved}" alt="${alt || ''}"${title ? ` title="${title}"` : ''} style="max-width:100%;height:auto;">`;
  };

  // ── 步骤 C：渲染 Markdown，再还原数学公式 ──────────────────
  contentEl.innerHTML = restoreMath(marked.parse(safeMd, { renderer }), store);

  // ── 步骤 D：拦截页内锚点链接（#xxx），改为平滑滚动 ─────────
  //    原因：单页应用中点击 #anchor 会让浏览器跳转 URL，导致页面重载。
  contentEl.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      // href 可能含 URL 编码的中文，需要 decode 后才能匹配 id
      const id     = decodeURIComponent(a.getAttribute('href').slice(1));
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── 步骤 E：触发 MathJax 渲染 ──────────────────────────────
  if (window.MathJax && window.MathJax.typesetPromise) {
    MathJax.typesetPromise([contentEl]).catch(err => console.error('MathJax error:', err));
  }

  // ── 步骤 F：构建侧边栏页内 TOC ─────────────────────────────
  buildTOC();
}

document.addEventListener('DOMContentLoaded', buildMenu);