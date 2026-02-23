const designs = [
  { id: 'modern', name: 'Modern Blue', className: 'theme-modern', preview: 'linear-gradient(120deg,#99b2ff,#3056f5)' },
  { id: 'dark', name: 'Dark Ops', className: 'theme-dark', preview: 'linear-gradient(120deg,#2f3c5e,#11192f)' },
  { id: 'forest', name: 'Forest Green', className: 'theme-forest', preview: 'linear-gradient(120deg,#b6dfc1,#2b7a4b)' },
  { id: 'sunset', name: 'Sunset Orange', className: 'theme-sunset', preview: 'linear-gradient(120deg,#ffc2a8,#d8572a)' },
  { id: 'neon', name: 'Neon Purple', className: 'theme-neon', preview: 'linear-gradient(120deg,#ddb9ff,#8b38ff)' }
];

const app = document.getElementById('app');

const statusMap = {
  active: { text: '활성', cls: 'status-active' },
  inactive: { text: '비활성', cls: 'status-inactive' },
  pending: { text: '검토중', cls: 'status-pending' }
};

const seedData = [
  { id: 1, name: '김관리', role: '운영 매니저', status: 'active' },
  { id: 2, name: '이오퍼', role: 'CS 담당', status: 'pending' },
  { id: 3, name: '박관리', role: '정산 담당', status: 'inactive' }
];

function storageKey(designId) {
  return `admin-sample-${designId}`;
}

function getRecords(designId) {
  const raw = localStorage.getItem(storageKey(designId));
  if (!raw) return structuredClone(seedData);
  try {
    return JSON.parse(raw);
  } catch {
    return structuredClone(seedData);
  }
}

function setRecords(designId, records) {
  localStorage.setItem(storageKey(designId), JSON.stringify(records));
}

function route() {
  const hash = location.hash.replace('#', '');
  const design = designs.find((d) => d.id === hash);
  if (design) {
    renderCrud(design);
  } else {
    renderDesignList();
  }
}

function renderDesignList() {
  document.body.className = '';
  const template = document.getElementById('design-list-template').content.cloneNode(true);
  const grid = template.getElementById('design-grid');

  designs.forEach((design) => {
    const card = document.createElement('article');
    card.className = 'design-card';
    card.innerHTML = `
      <div class="preview" style="background:${design.preview}"></div>
      <h3>${design.name}</h3>
      <p>간단 CRUD 샘플 보기</p>
    `;
    card.addEventListener('click', () => {
      location.hash = design.id;
    });
    grid.appendChild(card);
  });

  app.replaceChildren(template);
}

function renderCrud(design) {
  document.body.className = design.className;
  const template = document.getElementById('crud-template').content.cloneNode(true);
  const backBtn = template.getElementById('back-btn');
  const title = template.getElementById('crud-title');
  const stats = template.getElementById('stats');
  const form = template.getElementById('crud-form');
  const recordBody = template.getElementById('record-body');
  const idField = template.getElementById('record-id');
  const nameField = template.getElementById('name');
  const roleField = template.getElementById('role');
  const statusField = template.getElementById('status');
  const submitBtn = template.getElementById('submit-btn');
  const resetBtn = template.getElementById('reset-btn');

  let records = getRecords(design.id);

  function drawTable() {
    const activeCount = records.filter((r) => r.status === 'active').length;
    stats.textContent = `총 ${records.length}건 · 활성 ${activeCount}건`;

    recordBody.innerHTML = '';
    records.forEach((record) => {
      const status = statusMap[record.status] || statusMap.pending;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${record.id}</td>
        <td>${record.name}</td>
        <td>${record.role}</td>
        <td><span class="status-chip ${status.cls}">${status.text}</span></td>
        <td>
          <div class="row-actions">
            <button type="button" class="secondary edit-btn">수정</button>
            <button type="button" class="danger delete-btn">삭제</button>
          </div>
        </td>
      `;

      tr.querySelector('.edit-btn').addEventListener('click', () => {
        idField.value = String(record.id);
        nameField.value = record.name;
        roleField.value = record.role;
        statusField.value = record.status;
        submitBtn.textContent = '저장';
      });

      tr.querySelector('.delete-btn').addEventListener('click', () => {
        records = records.filter((r) => r.id !== record.id);
        setRecords(design.id, records);
        drawTable();
      });

      recordBody.appendChild(tr);
    });
  }

  function resetForm() {
    idField.value = '';
    form.reset();
    statusField.value = 'active';
    submitBtn.textContent = '등록';
  }

  title.textContent = `${design.name} · CRUD Sample`;

  backBtn.addEventListener('click', () => {
    location.hash = '';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const payload = {
      name: nameField.value.trim(),
      role: roleField.value.trim(),
      status: statusField.value
    };
    if (!payload.name || !payload.role) return;

    const editingId = Number(idField.value);
    if (editingId) {
      records = records.map((r) => (r.id === editingId ? { ...r, ...payload } : r));
    } else {
      const nextId = records.length ? Math.max(...records.map((r) => r.id)) + 1 : 1;
      records = [...records, { id: nextId, ...payload }];
    }

    setRecords(design.id, records);
    drawTable();
    resetForm();
  });

  resetBtn.addEventListener('click', () => {
    resetForm();
  });

  app.replaceChildren(template);
  drawTable();
}

window.addEventListener('hashchange', route);
route();
