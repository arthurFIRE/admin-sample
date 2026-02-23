const menus = [
  { id: 'users', name: '회원 관리' },
  { id: 'orders', name: '주문 관리' },
  { id: 'products', name: '상품 관리' },
  { id: 'settlement', name: '정산 관리' },
  { id: 'notice', name: '공지 관리' }
];

const app = document.getElementById('app');

const seedData = [
  { id: 1001, name: '김도윤', email: 'doyun.kim@sample.com', role: '관리자', status: '활성', createdAt: '2026-01-20' },
  { id: 1002, name: '이하늘', email: 'haneul.lee@sample.com', role: '운영', status: '비활성', createdAt: '2026-01-21' },
  { id: 1003, name: '박서준', email: 'seojun.park@sample.com', role: '정산', status: '활성', createdAt: '2026-01-22' },
  { id: 1004, name: '최민지', email: 'minji.choi@sample.com', role: 'CS', status: '대기', createdAt: '2026-01-23' },
  { id: 1005, name: '장우진', email: 'woojin.jang@sample.com', role: '운영', status: '활성', createdAt: '2026-01-24' },
  { id: 1006, name: '정유진', email: 'yujin.jung@sample.com', role: 'CS', status: '활성', createdAt: '2026-01-24' },
  { id: 1007, name: '한지민', email: 'jimin.han@sample.com', role: 'MD', status: '비활성', createdAt: '2026-01-25' },
  { id: 1008, name: '신준호', email: 'junho.shin@sample.com', role: '정산', status: '활성', createdAt: '2026-01-25' },
  { id: 1009, name: '윤다은', email: 'daeun.yoon@sample.com', role: '운영', status: '대기', createdAt: '2026-01-26' },
  { id: 1010, name: '오지훈', email: 'jihoon.oh@sample.com', role: '관리자', status: '활성', createdAt: '2026-01-27' },
  { id: 1011, name: '강나래', email: 'narae.kang@sample.com', role: 'MD', status: '활성', createdAt: '2026-01-28' },
  { id: 1012, name: '임현우', email: 'hyunwoo.lim@sample.com', role: 'CS', status: '비활성', createdAt: '2026-01-29' }
];

const state = {
  activeMenuId: menus[0].id,
  view: 'list',
  query: '',
  status: 'all',
  page: 1,
  pageSize: 5,
  records: structuredClone(seedData)
};

function filteredRecords() {
  return state.records.filter((row) => {
    const queryMatched =
      !state.query ||
      row.name.toLowerCase().includes(state.query.toLowerCase()) ||
      row.email.toLowerCase().includes(state.query.toLowerCase());
    const statusMatched = state.status === 'all' || row.status === state.status;
    return queryMatched && statusMatched;
  });
}

function pagedRecords(rows) {
  const start = (state.page - 1) * state.pageSize;
  return rows.slice(start, start + state.pageSize);
}

function statusClass(status) {
  if (status === '활성') return 'badge success';
  if (status === '비활성') return 'badge danger';
  return 'badge waiting';
}

function layout(content) {
  const menuButtons = menus
    .map(
      (menu) => `
      <button class="menu-item ${menu.id === state.activeMenuId ? 'active' : ''}" data-menu-id="${menu.id}">
        ${menu.name}
      </button>
    `
    )
    .join('');

  app.innerHTML = `
    <aside class="sidebar">
      <div class="brand">Admin Portal</div>
      <nav class="menu-list">${menuButtons}</nav>
    </aside>

    <main class="content-area">
      <header class="topbar">
        <div></div>
        <div class="user-card">
          <div class="avatar">AD</div>
          <div>
            <p class="user-name">관리자 홍길동</p>
            <p class="user-meta">admin@sample.com</p>
          </div>
        </div>
      </header>
      ${content}
    </main>
  `;

  app.querySelectorAll('[data-menu-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.activeMenuId = btn.dataset.menuId;
      state.view = 'list';
      state.page = 1;
      render();
    });
  });
}

function listView() {
  const menuName = menus.find((menu) => menu.id === state.activeMenuId)?.name || '';
  const filtered = filteredRecords();
  const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
  state.page = Math.min(state.page, totalPages);
  const rows = pagedRecords(filtered);

  const tableRows =
    rows.length > 0
      ? rows
          .map(
            (row) => `
      <tr>
        <td>${row.id}</td>
        <td>${row.name}</td>
        <td>${row.email}</td>
        <td>${row.role}</td>
        <td><span class="${statusClass(row.status)}">${row.status}</span></td>
        <td>${row.createdAt}</td>
      </tr>
    `
          )
          .join('')
      : '<tr><td colspan="6" class="empty">조회 결과가 없습니다.</td></tr>';

  const pageButtons = Array.from({ length: totalPages }, (_, idx) => idx + 1)
    .map(
      (num) => `
      <button class="page-btn ${num === state.page ? 'active' : ''}" data-page="${num}">${num}</button>
    `
    )
    .join('');

  return `
    <section class="panel">
      <div class="panel-head">
        <h1>${menuName}</h1>
        <button id="create-btn">등록</button>
      </div>

      <div class="search-box">
        <label>
          검색어
          <input id="query-input" placeholder="이름 또는 이메일 입력" value="${state.query}" />
        </label>

        <label>
          상태
          <select id="status-filter">
            <option value="all" ${state.status === 'all' ? 'selected' : ''}>전체</option>
            <option value="활성" ${state.status === '활성' ? 'selected' : ''}>활성</option>
            <option value="비활성" ${state.status === '비활성' ? 'selected' : ''}>비활성</option>
            <option value="대기" ${state.status === '대기' ? 'selected' : ''}>대기</option>
          </select>
        </label>

        <button id="search-btn" class="secondary">조회</button>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>이메일</th>
              <th>권한</th>
              <th>상태</th>
              <th>등록일</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>

      <div class="pagination">
        <button id="prev-page" class="secondary" ${state.page === 1 ? 'disabled' : ''}>이전</button>
        ${pageButtons}
        <button id="next-page" class="secondary" ${state.page === totalPages ? 'disabled' : ''}>다음</button>
      </div>
    </section>
  `;
}

function formView() {
  const menuName = menus.find((menu) => menu.id === state.activeMenuId)?.name || '';

  return `
    <section class="panel form-panel">
      <div class="panel-head">
        <h1>${menuName} 등록</h1>
        <button id="list-btn" class="secondary">목록으로</button>
      </div>

      <form id="create-form" class="create-form">
        <label>이름<input name="name" required /></label>
        <label>이메일<input type="email" name="email" required /></label>
        <label>전화번호<input type="tel" name="phone" placeholder="010-0000-0000" /></label>
        <label>권한
          <select name="role">
            <option>관리자</option>
            <option>운영</option>
            <option>MD</option>
            <option>CS</option>
            <option>정산</option>
          </select>
        </label>
        <label>상태
          <select name="status">
            <option>활성</option>
            <option>비활성</option>
            <option>대기</option>
          </select>
        </label>
        <label>입사일<input type="date" name="joinDate" /></label>
        <label class="full">메모<textarea name="memo" rows="4" placeholder="추가 정보를 입력하세요."></textarea></label>

        <div class="checkboxes full">
          <label><input type="checkbox" name="sms" checked /> SMS 수신 동의</label>
          <label><input type="checkbox" name="emailAgree" checked /> 이메일 수신 동의</label>
        </div>

        <div class="form-actions full">
          <button type="button" id="cancel-btn" class="secondary">취소</button>
          <button type="submit">등록 완료</button>
        </div>
      </form>
    </section>
  `;
}

function bindListEvents() {
  document.getElementById('create-btn').addEventListener('click', () => {
    state.view = 'form';
    render();
  });

  document.getElementById('search-btn').addEventListener('click', () => {
    state.query = document.getElementById('query-input').value.trim();
    state.status = document.getElementById('status-filter').value;
    state.page = 1;
    render();
  });

  document.getElementById('prev-page').addEventListener('click', () => {
    if (state.page > 1) {
      state.page -= 1;
      render();
    }
  });

  document.getElementById('next-page').addEventListener('click', () => {
    const totalPages = Math.max(1, Math.ceil(filteredRecords().length / state.pageSize));
    if (state.page < totalPages) {
      state.page += 1;
      render();
    }
  });

  document.querySelectorAll('[data-page]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.page = Number(btn.dataset.page);
      render();
    });
  });
}

function bindFormEvents() {
  document.getElementById('list-btn').addEventListener('click', () => {
    state.view = 'list';
    render();
  });

  document.getElementById('cancel-btn').addEventListener('click', () => {
    state.view = 'list';
    render();
  });

  document.getElementById('create-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextId = Math.max(...state.records.map((row) => row.id)) + 1;

    state.records = [
      {
        id: nextId,
        name: formData.get('name'),
        email: formData.get('email'),
        role: formData.get('role'),
        status: formData.get('status'),
        createdAt: new Date().toISOString().slice(0, 10)
      },
      ...state.records
    ];

    state.view = 'list';
    state.page = 1;
    render();
  });
}

function bindEvents() {
  if (state.view === 'list') {
    bindListEvents();
  } else {
    bindFormEvents();
  }
}

function render() {
  const content = state.view === 'list' ? listView() : formView();
  layout(content);
  bindEvents();
}

render();
