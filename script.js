(function () {
  const docs = window.WC_DOCS || [];
  const byId = {};
  docs.forEach((d) => (byId[d.id] = d));

  // Group by part, preserving first-seen order
  const partOrder = [];
  const partMap = {};
  docs.forEach((d) => {
    if (!partMap[d.part]) {
      partMap[d.part] = { title: d.partTitle, docs: [] };
      partOrder.push(d.part);
    }
    partMap[d.part].docs.push(d);
  });

  const sidebar = document.getElementById("sidebar");
  const contentEl = document.getElementById("content");
  const searchInput = document.getElementById("search");
  const menuToggle = document.getElementById("menu-toggle");

  function renderSidebar(filterText) {
    sidebar.querySelectorAll(".part-group").forEach((n) => n.remove());
    const filter = (filterText || "").trim().toLowerCase();
    let anyMatch = false;

    partOrder.forEach((partKey) => {
      const part = partMap[partKey];
      const matchingDocs = filter
        ? part.docs.filter(
            (d) =>
              d.title.toLowerCase().includes(filter) ||
              d.path.toLowerCase().includes(filter) ||
              part.title.toLowerCase().includes(filter)
          )
        : part.docs;
      if (filter && matchingDocs.length === 0) return;
      anyMatch = true;

      const group = document.createElement("div");
      group.className = "part-group" + (filter ? " open" : "");
      group.dataset.part = partKey;

      const header = document.createElement("button");
      header.className = "part-header";
      header.innerHTML = `<span>${part.title}</span><span class="chev">&#9656;</span>`;
      header.addEventListener("click", () => group.classList.toggle("open"));

      const fileList = document.createElement("div");
      fileList.className = "part-files";

      matchingDocs.forEach((d) => {
        const btn = document.createElement("button");
        btn.className = "file-link";
        btn.textContent = d.title;
        btn.dataset.id = d.id;
        btn.addEventListener("click", () => {
          location.hash = d.id;
        });
        fileList.appendChild(btn);
      });

      group.appendChild(header);
      group.appendChild(fileList);
      sidebar.appendChild(group);
    });

    if (!anyMatch) {
      const empty = document.createElement("div");
      empty.className = "no-results part-group open";
      empty.textContent = "No sections match your search.";
      sidebar.appendChild(empty);
    }

    highlightActive();
  }

  function highlightActive() {
    const currentId = location.hash.replace(/^#/, "");
    sidebar.querySelectorAll(".file-link").forEach((el) => {
      el.classList.toggle("active", el.dataset.id === currentId);
    });
  }

  function renderWelcome() {
    const totalParts = partOrder.length;
    contentEl.innerHTML = `
      <div class="doc welcome">
        <h1>The World Constitution — Royal Edition</h1>
        <p>A unified constitution for one global state, drafted by Lion and Claude. ${docs.length} sections across ${totalParts} Parts — foundational rights, government structure and eligibility testing, the penal code, and dedicated law for animals, plants, the environment, media, and society.</p>
        <div>
          <div class="stat"><b>${docs.length}</b><span>sections</span></div>
          <div class="stat"><b>${totalParts}</b><span>parts</span></div>
        </div>
        <p>Use the sidebar to browse by Part, or search by title. Start with the <button class="file-link" style="display:inline;padding:0;color:var(--seal);text-decoration:underline;cursor:pointer;" data-inline="README">README</button> for how this edition was assembled.</p>
      </div>
    `;
    const inlineBtn = contentEl.querySelector('[data-inline="README"]');
    if (inlineBtn) {
      inlineBtn.addEventListener("click", () => {
        location.hash = "README";
      });
    }
  }

  function renderDoc(id) {
    const doc = byId[id];
    if (!doc) {
      renderWelcome();
      return;
    }
    const html = window.marked.parse(doc.md);
    const idx = partMap[doc.part].docs.findIndex((d) => d.id === id);
    const prev = idx > 0 ? partMap[doc.part].docs[idx - 1] : null;
    const next = idx < partMap[doc.part].docs.length - 1 ? partMap[doc.part].docs[idx + 1] : null;

    contentEl.innerHTML = `
      <article class="doc">
        <div class="crumb">${doc.partTitle}</div>
        ${html}
        <div class="nav-footer">
          <button ${prev ? "" : "disabled"} data-nav="${prev ? prev.id : ""}">&larr; Previous</button>
          <button ${next ? "" : "disabled"} data-nav="${next ? next.id : ""}">Next &rarr;</button>
        </div>
      </article>
    `;

    contentEl.querySelectorAll("[data-nav]").forEach((btn) => {
      const targetId = btn.getAttribute("data-nav");
      if (targetId) {
        btn.addEventListener("click", () => (location.hash = targetId));
      }
    });

    contentEl.scrollTop = 0;
    // open the relevant sidebar group
    const group = sidebar.querySelector(`.part-group[data-part="${doc.part}"]`);
    if (group) group.classList.add("open");
  }

  function route() {
    const id = location.hash.replace(/^#/, "");
    if (id) {
      renderDoc(id);
    } else {
      renderWelcome();
    }
    highlightActive();
    sidebar.classList.remove("open");
  }

  window.addEventListener("hashchange", route);
  searchInput.addEventListener("input", (e) => renderSidebar(e.target.value));
  menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));

  renderSidebar("");
  route();
})();
