(function () {
  'use strict';

  // Safe data ingestion and validation
  const rawDocs = Array.isArray(window.WC_DOCS) ? window.WC_DOCS : [];

  const byId = Object.create(null);
  const partOrder = [];
  const partMap = Object.create(null);

  // Pre-process and index docs for fast lookup and 60fps search filtering
  const docs = rawDocs.map((d) => {
    const item = {
      id: String(d.id || ''),
      part: String(d.part || 'general'),
      partTitle: String(d.partTitle || d.part || 'General'),
      title: String(d.title || 'Untitled'),
      path: String(d.path || ''),
      md: String(d.md || ''),
      _searchStr: `${d.title || ''} ${d.path || ''} ${d.partTitle || ''} ${d.id || ''}`.toLowerCase()
    };

    byId[item.id] = item;

    if (!partMap[item.part]) {
      partMap[item.part] = { title: item.partTitle, docs: [] };
      partOrder.push(item.part);
    }
    partMap[item.part].docs.push(item);

    return item;
  });

  // Core DOM node references
  const sidebar = document.getElementById('sidebar');
  const contentEl = document.getElementById('content');
  const searchInput = document.getElementById('search');
  const menuToggle = document.getElementById('menu-toggle');

  if (!sidebar || !contentEl) return;

  const baseTitle = document.title || 'The World Constitution';
  let searchDebounceTimer = null;

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Render Sidebar using DocumentFragment for minimal layout reflows
  function renderSidebar(filterText) {
    const filter = (filterText || '').trim().toLowerCase();

    // Clean existing groups
    const existing = sidebar.querySelectorAll('.part-group');
    for (let i = 0; i < existing.length; i++) {
      existing[i].remove();
    }

    const fragment = document.createDocumentFragment();
    let anyMatch = false;

    for (let i = 0; i < partOrder.length; i++) {
      const partKey = partOrder[i];
      const part = partMap[partKey];
      if (!part) continue;

      let matchingDocs = part.docs;
      if (filter) {
        matchingDocs = part.docs.filter((d) => d._searchStr.includes(filter));
        if (matchingDocs.length === 0) continue;
      }

      anyMatch = true;

      const group = document.createElement('div');
      group.className = 'part-group' + (filter ? ' open' : '');
      group.dataset.part = partKey;

      const header = document.createElement('button');
      header.type = 'button';
      header.className = 'part-header';
      header.setAttribute('aria-expanded', filter ? 'true' : 'false');
      header.innerHTML = `<span>${escapeHTML(part.title)}</span><span class="chev" aria-hidden="true">&#9656;</span>`;

      const fileList = document.createElement('div');
      fileList.className = 'part-files';

      for (let j = 0; j < matchingDocs.length; j++) {
        const d = matchingDocs[j];
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'file-link';
        btn.textContent = d.title;
        btn.dataset.id = d.id;
        fileList.appendChild(btn);
      }

      group.appendChild(header);
      group.appendChild(fileList);
      fragment.appendChild(group);
    }

    if (!anyMatch && filter) {
      const empty = document.createElement('div');
      empty.className = 'no-results part-group open';
      empty.textContent = 'No sections match your search.';
      fragment.appendChild(empty);
    }

    sidebar.appendChild(fragment);
    highlightActive();
  }

  // Synchronize and auto-scroll active navigation link
  function highlightActive() {
    const currentId = decodeURIComponent(location.hash.replace(/^#/, ''));
    const fileLinks = sidebar.querySelectorAll('.file-link');
    let activeElement = null;

    for (let i = 0; i < fileLinks.length; i++) {
      const el = fileLinks[i];
      const isActive = el.dataset.id === currentId;
      el.classList.toggle('active', isActive);
      if (isActive) {
        activeElement = el;
      }
    }

    if (activeElement) {
      const parentGroup = activeElement.closest('.part-group');
      if (parentGroup && !parentGroup.classList.contains('open')) {
        parentGroup.classList.add('open');
        const header = parentGroup.querySelector('.part-header');
        if (header) header.setAttribute('aria-expanded', 'true');
      }

      // Smoothly bring active item into viewport without jumping the whole window
      activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  function renderWelcome() {
    const totalParts = partOrder.length;
    document.title = baseTitle;

    contentEl.innerHTML = `
      <div class="doc welcome">
        <h1>The World Constitution — Royal Edition</h1>
        <p>A unified constitution for one global state, drafted by Lion and Claude. ${docs.length} sections across ${totalParts} Parts — foundational rights, government structure and eligibility testing, the penal code, and dedicated law for animals, plants, the environment, media, and society.</p>
        <div>
          <div class="stat"><b>${docs.length}</b><span>sections</span></div>
          <div class="stat"><b>${totalParts}</b><span>parts</span></div>
        </div>
        <p>Use the sidebar to browse by Part, or search by title. Start with the <button class="file-link" style="display:inline;padding:0;color:var(--link,#0070f3);text-decoration:underline;cursor:pointer;background:transparent;border:none;" data-inline="README">README</button> for how this edition was assembled.</p>
      </div>
    `;

    contentEl.scrollTop = 0;
  }

  function renderDoc(id) {
    const doc = byId[id];
    if (!doc) {
      renderWelcome();
      return;
    }

    document.title = `${doc.title} — ${baseTitle}`;

    let parsedHtml = '';
    if (window.marked && typeof window.marked.parse === 'function') {
      try {
        parsedHtml = window.marked.parse(doc.md);
      } catch (err) {
        parsedHtml = `<p>${escapeHTML(doc.md)}</p>`;
      }
    } else {
      parsedHtml = `<pre><code>${escapeHTML(doc.md)}</code></pre>`;
    }

    const partDocs = (partMap[doc.part] && partMap[doc.part].docs) || [];
    const idx = partDocs.findIndex((d) => d.id === id);
    const prev = idx > 0 ? partDocs[idx - 1] : null;
    const next = idx >= 0 && idx < partDocs.length - 1 ? partDocs[idx + 1] : null;

    contentEl.innerHTML = `
      <article class="doc">
        <div class="crumb">${escapeHTML(doc.partTitle)}</div>
        ${parsedHtml}
        <div class="nav-footer">
          <button type="button" ${prev ? '' : 'disabled'} data-nav="${prev ? escapeHTML(prev.id) : ''}">&larr; Previous</button>
          <button type="button" ${next ? '' : 'disabled'} data-nav="${next ? escapeHTML(next.id) : ''}">Next &rarr;</button>
        </div>
      </article>
    `;

    contentEl.scrollTop = 0;

    const safePartSelector = CSS.escape ? CSS.escape(doc.part) : doc.part.replace(/["\\]/g, '\\$&');
    const group = sidebar.querySelector(`.part-group[data-part="${safePartSelector}"]`);
    if (group && !group.classList.contains('open')) {
      group.classList.add('open');
      const header = group.querySelector('.part-header');
      if (header) header.setAttribute('aria-expanded', 'true');
    }
  }

  function route() {
    const id = decodeURIComponent(location.hash.replace(/^#/, ''));
    if (id) {
      renderDoc(id);
    } else {
      renderWelcome();
    }
    highlightActive();
    if (sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
    }
  }

  // Delegated Event Handlers for Sidebar (Accordion + Link Navigation)
  sidebar.addEventListener('click', (e) => {
    const header = e.target.closest('.part-header');
    if (header) {
      const group = header.closest('.part-group');
      if (group) {
        const isOpen = group.classList.toggle('open');
        header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
      return;
    }

    const link = e.target.closest('.file-link');
    if (link && link.dataset.id) {
      location.hash = link.dataset.id;
    }
  });

  // Delegated Event Handlers for Content area (Pagination & In-Doc Links)
  contentEl.addEventListener('click', (e) => {
    const navBtn = e.target.closest('[data-nav]');
    if (navBtn) {
      const targetId = navBtn.getAttribute('data-nav');
      if (targetId) location.hash = targetId;
      return;
    }

    const inlineBtn = e.target.closest('[data-inline]');
    if (inlineBtn) {
      const targetId = inlineBtn.getAttribute('data-inline');
      if (targetId) location.hash = targetId;
    }
  });

  // Debounced Search Input for high performance
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounceTimer);
      const val = e.target.value;
      searchDebounceTimer = setTimeout(() => {
        renderSidebar(val);
      }, 100);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchInput.value) {
        searchInput.value = '';
        renderSidebar('');
      }
    });
  }

  // Mobile Menu Interaction
  if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
    });
  }

  // Dismiss mobile drawer on outside touch/click
  document.addEventListener('click', (e) => {
    if (
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      (!menuToggle || !menuToggle.contains(e.target))
    ) {
      sidebar.classList.remove('open');
    }
  });

  // Accessibility keyboard shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
    }
  });

  // Hash Navigation Listener
  window.addEventListener('hashchange', route, { passive: true });

  // Initialize
  renderSidebar('');
  route();
})();
