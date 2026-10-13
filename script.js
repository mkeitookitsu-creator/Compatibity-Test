const MBTI_TYPES = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"];

const LOVE_TYPES = [
  "ボス猫",
  "隠れベイビー",
  "主役体質",
  "ツンデレヤンキー",
  "憧れの先輩",
  "カリスマバランサー",
  "パーフェクトカメレオン",
  "キャプテンライオン",
  "ロマンスマジシャン",
  "ちゃっかりうさぎ",
  "恋愛モンスター",
  "忠犬ハチ公",
  "不思議生命体",
  "敏腕マネージャー",
  "デビル天使",
  "最後の恋人"
];


// あなたのGemini API Key
const GEMINI_API_KEY = "AQ.Ab8RN6JTnQo5BM9kMtUz-JA4iZ69FDGCJy7fj0rbcTj2aPYpsA";

let memberCount = 0;

function createMemberRow(id) {
  const div = document.createElement('div');
  div.className = 'member-row';
  div.id = `member-${id}`;

  const mbtiOptions = MBTI_TYPES.map(t => `<option value="${t}">${t}</option>`).join('');
  const loveOptions = LOVE_TYPES.map(t => `<option value="${t}">${t}</option>`).join('');

  div.innerHTML = `
    <div style="display: flex; gap: 6px;">
      <input type="text" class="member-name" placeholder="名前" style="flex: 2;">
      <input type="number" class="member-age" placeholder="年齢" style="flex: 1;" min="0" max="120">
      <select class="member-gender" style="flex: 1;">
        <option value="">性別</option>
        <option value="男性">男性</option>
        <option value="女性">女性</option>
        <option value="その他">その他</option>
      </select>
    </div>
    <div class="member-inputs" style="margin-top: 6px;">
      <select class="mbti-select">${mbtiOptions}</select>
      <select class="love-select">${loveOptions}</select>
    </div>
  `;

  return div;
}

function addMember() {
  if (memberCount >= 10) return;
  memberCount++;
  document.getElementById('member-count').textContent = memberCount;
  document.getElementById('members-list').appendChild(createMemberRow(memberCount));
}

function initUI() {
  const addBtn = document.getElementById('add-member-btn');

  if (!document.getElementById('diagnose-btn')) {
    const diagnoseBtn = document.createElement('button');
    diagnoseBtn.id = 'diagnose-btn';
    diagnoseBtn.className = 'btn';
    diagnoseBtn.style.cssText = 'background: linear-gradient(90deg, #ff4757, #f472b6); color: #fff; margin-top: 10px; font-size: 14px; width: 100%; font-weight: bold; padding: 12px; border-radius: 8px; border: none; cursor: pointer;';
    diagnoseBtn.textContent = '✨ AI相性診断を実行';
    diagnoseBtn.addEventListener('click', runAiDiagnosis);
    addBtn.parentNode.insertBefore(diagnoseBtn, addBtn.nextSibling);
  }
  resetResults();
}

function resetResults() {
  document.getElementById('total-score').textContent = '0%';
  document.getElementById('status-text').textContent = '情報を入力して診断ボタンを押してください';
  document.getElementById('profiles-container').innerHTML = '<p style="font-size: 11px; color: #94a3b8;">診断実行後に表示されます</p>';
  document.getElementById('pair-results').innerHTML = '<p style="font-size: 11px; color: #94a3b8;">診断実行後に表示されます</p>';
}

function getMembersData() {
  const rows = document.querySelectorAll('.member-row');
  const members = [];
  let isValid = true;

  rows.forEach(row => {
    const name = row.querySelector('.member-name').value.trim();
    const age = row.querySelector('.member-age').value.trim();
    const gender = row.querySelector('.member-gender').value;
    const mbti = row.querySelector('.mbti-select').value;
    const love = row.querySelector('.love-select').value;

    if (!name || !age || !gender) {
      isValid = false;
    }

    members.push({ name, age, gender, mbti, love });
  });

  return { members, isValid };
}

async function runAiDiagnosis() {
  if (!GEMINI_API_KEY) {
    alert('GEMINI_API_KEYが設定されていません。');
    return;
  }

  const { members, isValid } = getMembersData();
  if (members.length < 2) {
    alert('診断には2人以上のメンバーが必要です！');
    return;
  }
  if (!isValid) {
    alert('全員の「名前」「年齢」「性別」をすべて入力してください！');
    return;
  }

  const isGroup = members.length >= 3;

  const diagnoseBtn = document.getElementById('diagnose-btn');
  diagnoseBtn.disabled = true;
  diagnoseBtn.textContent = '🤖 AIが関係性を深く分析中...';
  document.getElementById('pair-results').innerHTML = '<p style="font-size: 12px; color: #f472b6;">AIが分析中です。数秒お待ちください...</p>';

    // 人数に応じた出力指示の分岐
  const dynamicInstruction = isGroup 
    ? `【重要：3人以上のグループ診断】
ペアごとの相性分析は行わないでください。その分「グループ全体の化学反応・相性分析」「グループの空気感や会話のノリ」「グループ内の力関係」を非常に詳しく、ボリューミーに分析してください。

1. 🏆 異性からのモテランキング ＆ 【閲覧注意】辛口モテ毒舌評価
   - 全員の順位とそれぞれの魅力を解説した上で、それぞれの「モテへの痛い勘違い」「容赦ない辛口毒舌コメント」を必ずセットで記載してください。

2. 🧩 グループ内の役割分担と立ち位置
   - 各メンバーの役割（リーダー、盛り上げ役、まとめ役、愛されキャラなど）を記述。

3. 🔥 【超詳細】グループ全体の相性・空気感・化学反応
   - この3人以上が集まった時の独特な空気感、テンション、会話のノリ、力関係、相性の良さをたっぷり深く分析してください。

4. 🎈 グループ全員で遊びに行く時のおすすめスポット
   - 全員で出かけると一番盛り上がる遊び場・旅行先・アクティビティの候補と理由。

5. ⚠️ 【閲覧注意】「辛口・厳し目」トラブル＆崩壊シナリオ
   - 意見が割れるポイント、ノリのズレ、グループ崩壊の引き金。

6. 🛑 グループの平和を保つための絶対ルール
   - 全員が心掛けるべきルール。`
    : `【2人専用の相性診断】
1. 🏆 2人のモテ度比較・魅力解剖 ＆ 【閲覧注意】辛口モテ毒舌評価
   - 2人のモテ度を比較し、それぞれの魅力だけでなく「ぶっちゃけここが惜しい・痛い」という容赦ない辛口毒舌評価を必ず追加してください。

2. 🧩 2人の相性と役割分担

3. 👥 2人のペア詳細分析
   - 相性度（%）、どんな相性か、今後の展望、破滅パターン。

4. 📍 2人のおすすめデートスポット・旅行先

5. ⚠️ 【閲覧注意】「辛口・厳し目」トラブルシナリオ

6. 🛑 2人が関係を長続きさせるための絶対ルール`;


  const prompt = `
以下のメンバー情報をもとに相性診断を行ってください。

【メンバー情報】
${JSON.stringify(members, null, 2)}

【出力指定】
HTMLタグ（<div>, <p>, <strong>, <ul>, <li>など）のみを使用して出力してください（\`\`\`htmlの囲みは不要）。

${dynamicInstruction}
`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 8192
        }
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const aiResponseText = data.candidates[0].content.parts[0].text;

    // スコア抽出
    const scoreMatch = aiResponseText.match(/(\d+)%/);
    const displayScore = scoreMatch ? scoreMatch[1] + '%' : '88%';

    document.getElementById('total-score').textContent = displayScore;
    document.getElementById('status-text').textContent = 'Gemini AI分析が完了しました';

    // プロフィール表示
    let profileHtml = '';
    members.forEach(m => {
      profileHtml += `
        <div style="margin-bottom:6px; font-size:12px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:4px;">
          📌 <strong>${m.name}</strong> (${m.age}歳 / ${m.gender}): ${m.mbti} / ${m.love}
        </div>
      `;
    });
    document.getElementById('profiles-container').innerHTML = profileHtml;

    // AIの生成本文を反映
    document.getElementById('pair-results').innerHTML = aiResponseText.replace(/```html|```/g, '');

  } catch (error) {
    alert('エラーが発生しました: ' + error.message);
    document.getElementById('pair-results').innerHTML = '<p style="color:#f87171;">生成に失敗しました。キーを確認してください。</p>';
  } finally {
    diagnoseBtn.disabled = false;
    diagnoseBtn.textContent = '✨ AI相性診断を実行';
  }
}

// イベント設定
document.getElementById('add-member-btn').addEventListener('click', addMember);
document.getElementById('reset-btn').addEventListener('click', () => {
  document.getElementById('members-list').innerHTML = '';
  memberCount = 0;
  addMember();
  addMember();
  resetResults();
});

// 初期起動
addMember();
addMember();
initUI();
