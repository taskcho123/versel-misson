import express from 'express';

const app = express();
const PORT = 3000;

// json-server가 돌아가고 있는 주소 (db.json을 json-server로 제공)
const API_BASE = 'http://localhost:3001';

// 요청 본문 파싱 (폼 전송용)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * 1) GET /  -> 서버가 json-server로 GET 요청(fetch)해서 데이터를 받아와서 HTML로 렌더링
 */
app.get('/', async (req, res) => {
  try {
    // fetch GET 사용: posts 목록 가져오기
    const apiRes = await fetch(`${API_BASE}/posts`);
    if (!apiRes.ok) throw new Error(`API GET error: ${apiRes.status}`);
    const posts = await apiRes.json();

    // 간단한 HTML 렌더링 (서버사이드 렌더링)
    res.send(`
      <html>
        <head><meta charset="utf-8"><title>Posts</title></head>
        <body>
          <h1>Posts</h1>

          <ul>
            ${posts.map(p => `
              <li>
                <strong>[${p.id}] ${escapeHtml(p.title)}</strong><br/>
                ${escapeHtml(p.content || '')}<br/>
                <form style="display:inline" method="post" action="/posts/${p.id}/delete">
                  <button type="submit">삭제</button>
                </form>

                <!-- 간단한 수정 폼 (PUT/PATCH 대체) -->
                <form method="post" action="/posts/${p.id}/edit" style="display:inline;margin-left:8px;">
                  <input type="text" name="title" placeholder="제목" value="${escapeHtml(p.title)}" required/>
                  <input type="text" name="content" placeholder="내용" value="${escapeHtml(p.content || '')}" required/>
                  <button type="submit">수정</button>
                </form>
              </li>
            `).join('')}
          </ul>

          <h2>새 글 작성</h2>
          <form method="post" action="/posts">
            <input name="title" placeholder="제목" required/>
            <input name="content" placeholder="내용" required/>
            <button type="submit">작성</button>
          </form>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('서버 에러: 데이터를 불러오지 못했습니다.');
  }
});

/**
 * 2) POST /posts  -> 서버가 fetch로 json-server에 POST 요청 (새 리소스 생성)
 */
app.post('/posts', async (req, res) => {
  try {
    const { title, content } = req.body;
    // fetch POST 사용: Content-Type과 body(JSON) 전달
    const apiRes = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    });
    if (!apiRes.ok) throw new Error(`API POST error: ${apiRes.status}`);
    // 생성된 리소스를 받아올 수도 있음
    const newPost = await apiRes.json();
    console.log('Created post:', newPost);
    // 작성 후 리스트로 리다이렉트
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('새 글 생성 실패');
  }
});

/**
 * 3) POST /posts/:id/edit  -> 서버가 fetch로 PATCH (or PUT) 요청
 *    - HTML form은 PUT/PATCH를 직접 지원하지 않으므로 서버에서 처리합니다.
 */
app.post('/posts/:id/edit', async (req, res) => {
  try {
    const id = req.params.id;
    const { title, content } = req.body;

    // 여기서는 부분 수정이므로 PATCH 사용 (필요하면 PUT으로 바꾸세요)
    const apiRes = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    });
    if (!apiRes.ok) throw new Error(`API PATCH error: ${apiRes.status}`);
    const updated = await apiRes.json();
    console.log('Updated post:', updated);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('수정 실패');
  }
});

/**
 * 4) POST /posts/:id/delete  -> 서버가 fetch로 DELETE 요청
 */
app.post('/posts/:id/delete', async (req, res) => {
  try {
    const id = req.params.id;
    const apiRes = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'DELETE'
    });
    if (!apiRes.ok && apiRes.status !== 200 && apiRes.status !== 204) {
      throw new Error(`API DELETE error: ${apiRes.status}`);
    }
    console.log(`Deleted post ${id}`);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('삭제 실패');
  }
});

/** 
 * 안전한 간단한 HTML 이스케이프 (XSS 방지 최소화)
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Ensure json-server (db.json) runs at ${API_BASE} — e.g. npm run server`);
});
