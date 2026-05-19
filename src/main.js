// Forza Horizon 6 Voice Swap
// Copyright (c) 2026 hj6hki123
// SPDX-License-Identifier: MIT
const invoke = window.__TAURI__?.core?.invoke;
if (!invoke) {
  document.body.innerHTML = '<div style="padding:40px;color:#ff6a00;font-family:monospace">Tauri bridge not available.</div>';
  throw new Error('Tauri not available');
}
const openGameExe = () => invoke('plugin:dialog|open', {
  options: {
    directory: false,
    multiple: false,
    filters: [{ name: 'Forza Horizon 6', extensions: ['exe'] }],
  },
});

// ============ i18n ============
const I18N = {
  en: {
    language_label: 'Language',
    path_not_detected: 'Game executable not detected',
    path_change: 'Select EXE',
    status_label: 'CURRENT STATUS',
    status_no_override: 'No override active — game is in original state',
    status_override_count: (n) => `${n} language${n>1?'s':''} currently overridden`,
    status_override_sub: 'These language files have been overwritten. When the game is set to one of these languages, you will hear that voice but see text from another language.',
    step_caption_title: 'Current Game Language',
    step_caption_sub: 'The language your game is currently set to',
    step_voice_title: 'Voice Target',
    step_voice_sub: 'The language to set in-game (this file will be overwritten)',
    dropdown_placeholder: 'Select…',
    tag_modified: 'OVERWRITTEN',
    tag_blocked: 'CANNOT USE',
    btn_execute: 'EXECUTE SWAP',
    backup_label: 'Backup Manager',
    backup_refresh: 'Refresh',
    backup_reset_all: 'Restore All',
    backup_empty: 'No backups — they appear automatically after a swap',
    backup_restore: 'Restore',
    backup_delete: 'Delete',
    modal_yes: 'Confirm',
    modal_no: 'Cancel',
    modal_swap_title: 'Confirm Swap',
    modal_swap_body: (d, v) => `Overwrite <b>${v.name}</b> with <b>${d.name}</b>'s text content.<br>In-game language must be set to <b>${v.name}</b> for this to take effect.<br><span style="color:var(--text-mute);font-size:12px">Original file is auto-backed up to ${v.code}.zip.bak</span>`,
    modal_restore_title: 'Restore Backup',
    modal_restore_body: (info) => `Restore <b>${info.name} (${info.code})</b> from backup. The backup file will be deleted afterward.`,
    modal_delete_title: 'Delete Backup',
    modal_delete_body: (code) => `Permanently delete <b>${code}.zip.bak</b>. <span style="color:var(--danger)">This cannot be undone.</span> The game file itself is not touched.`,
    modal_reset_title: 'Restore All',
    modal_reset_body: (n) => `Restore all <b>${n}</b> overwritten file${n>1?'s':''} from their backups, returning the game to original state.`,
    toast_swap_ok: (d, v) => `✓ Swapped · ${d} → ${v}`,
    toast_restore_ok: (c) => `✓ Restored ${c}`,
    toast_delete_ok: (c) => `✓ Deleted backup of ${c}`,
    toast_reset_ok: (n) => `✓ Restored ${n} file${n>1?'s':''}`,
    toast_err: (msg) => `Error: ${msg}`,
    warn_source_modified: 'This language file has been overwritten and cannot be used as a source. Restore it first.',
  },
  zh: {
    language_label: '語言',
    path_not_detected: '尚未偵測到遊戲執行檔',
    path_change: '選擇 EXE',
    status_label: '目前狀態',
    status_no_override: '目前沒有任何替換，遊戲為原始狀態',
    status_override_count: (n) => `${n} 個語言已被覆寫`,
    status_override_sub: '這些語言檔案已被覆寫；遊戲設定為下列語言時會聽到該語音，但看到的是其他語言的文字。',
    step_caption_title: '目前遊戲語言',
    step_caption_sub: '你目前遊戲內設定的語言',
    step_voice_title: '語音目標',
    step_voice_sub: '進遊戲要設定的語言（這個檔會被覆蓋）',
    dropdown_placeholder: '請選擇…',
    tag_modified: '已覆寫',
    tag_blocked: '不能選',
    btn_execute: '執行替換',
    backup_label: '備份管理',
    backup_refresh: '重新整理',
    backup_reset_all: '全部還原',
    backup_empty: '目前沒有任何備份 — 執行替換後會自動產生',
    backup_restore: '還原',
    backup_delete: '刪除',
    modal_yes: '確定',
    modal_no: '取消',
    modal_swap_title: '確認替換',
    modal_swap_body: (d, v) => `將以 <b>${d.name}</b> 的文字內容覆寫 <b>${v.name}</b> 的檔案。<br>進遊戲必須把語言設為 <b>${v.name}</b> 才會生效。<br><span style="color:var(--text-mute);font-size:12px">原始檔自動備份為 ${v.code}.zip.bak</span>`,
    modal_restore_title: '還原備份',
    modal_restore_body: (info) => `將以備份還原 <b>${info.name} (${info.code})</b>，還原後備份檔會被刪除。`,
    modal_delete_title: '刪除備份',
    modal_delete_body: (code) => `將永久刪除 <b>${code}.zip.bak</b>。<span style="color:var(--danger)">此操作無法復原</span>。遊戲檔案本身不會被動到。`,
    modal_reset_title: '全部還原',
    modal_reset_body: (n) => `將還原全部 <b>${n}</b> 個被覆寫的檔案，遊戲回到原始狀態。`,
    toast_swap_ok: (d, v) => `✓ 替換完成 · ${d} → ${v}`,
    toast_restore_ok: (c) => `✓ 已還原 ${c}`,
    toast_delete_ok: (c) => `✓ 已刪除 ${c} 的備份`,
    toast_reset_ok: (n) => `✓ 已還原 ${n} 個檔案`,
    toast_err: (msg) => `錯誤: ${msg}`,
    warn_source_modified: '這個語言檔已經被覆寫，不能當作來源。請先還原它。',
  },
  ja: {
    language_label: '言語',
    path_not_detected: 'ゲーム実行ファイルが見つかりません',
    path_change: 'EXE を選択',
    status_label: '現在の状態',
    status_no_override: '置換なし — ゲームは初期状態です',
    status_override_count: (n) => `${n} 言語が上書きされています`,
    status_override_sub: 'これらの言語ファイルは上書きされています。ゲームをこれらの言語に設定すると、その音声が流れますが、文字は別言語のものになります。',
    step_caption_title: '現在のゲーム言語',
    step_caption_sub: '現在ゲーム内で設定している言語',
    step_voice_title: '音声ターゲット',
    step_voice_sub: 'ゲーム内で設定する言語（このファイルが上書きされます）',
    dropdown_placeholder: '選択してください…',
    tag_modified: '上書き済',
    tag_blocked: '選択不可',
    btn_execute: '実行',
    backup_label: 'バックアップ管理',
    backup_refresh: '再読込',
    backup_reset_all: '全て復元',
    backup_empty: 'バックアップがありません — 置換後に自動生成されます',
    backup_restore: '復元',
    backup_delete: '削除',
    modal_yes: '確定',
    modal_no: 'キャンセル',
    modal_swap_title: '置換の確認',
    modal_swap_body: (d, v) => `<b>${v.name}</b> のファイルを <b>${d.name}</b> の文字内容で上書きします。<br>ゲーム内言語を <b>${v.name}</b> に設定する必要があります。<br><span style="color:var(--text-mute);font-size:12px">元のファイルは ${v.code}.zip.bak に自動バックアップされます</span>`,
    modal_restore_title: 'バックアップから復元',
    modal_restore_body: (info) => `<b>${info.name} (${info.code})</b> をバックアップから復元します。復元後バックアップは削除されます。`,
    modal_delete_title: 'バックアップ削除',
    modal_delete_body: (code) => `<b>${code}.zip.bak</b> を完全に削除します。<span style="color:var(--danger)">この操作は取り消せません</span>。ゲームファイル自体は変更されません。`,
    modal_reset_title: '全て復元',
    modal_reset_body: (n) => `上書きされた <b>${n}</b> ファイル全てを復元し、ゲームを初期状態に戻します。`,
    toast_swap_ok: (d, v) => `✓ 置換完了 · ${d} → ${v}`,
    toast_restore_ok: (c) => `✓ ${c} を復元しました`,
    toast_delete_ok: (c) => `✓ ${c} のバックアップを削除`,
    toast_reset_ok: (n) => `✓ ${n} ファイルを復元しました`,
    toast_err: (msg) => `エラー: ${msg}`,
    warn_source_modified: 'この言語ファイルは上書き済みのため、ソースとして使用できません。先に復元してください。',
  },
  es: {
    language_label: 'Idioma',
    path_not_detected: 'Ejecutable del juego no detectado',
    path_change: 'Elegir EXE',
    status_label: 'ESTADO ACTUAL',
    status_no_override: 'No hay reemplazos activos; el juego está en su estado original',
    status_override_count: (n) => `${n} idioma${n>1?'s':''} sobrescrito${n>1?'s':''}`,
    status_override_sub: 'Estos archivos de idioma fueron sobrescritos. Si configuras el juego en uno de estos idiomas, oirás esa voz pero verás texto de otro idioma.',
    step_caption_title: 'Idioma actual del juego',
    step_caption_sub: 'El idioma que tienes configurado actualmente en el juego',
    step_voice_title: 'Destino de voz',
    step_voice_sub: 'El idioma que debes seleccionar en el juego (este archivo será sobrescrito)',
    dropdown_placeholder: 'Seleccionar...',
    tag_modified: 'SOBRESCRITO',
    tag_blocked: 'NO DISPONIBLE',
    btn_execute: 'EJECUTAR CAMBIO',
    backup_label: 'Gestor de copias',
    backup_refresh: 'Actualizar',
    backup_reset_all: 'Restaurar todo',
    backup_empty: 'No hay copias; aparecerán automáticamente después de un cambio',
    backup_restore: 'Restaurar',
    backup_delete: 'Eliminar',
    modal_yes: 'Confirmar',
    modal_no: 'Cancelar',
    modal_swap_title: 'Confirmar cambio',
    modal_swap_body: (d, v) => `Sobrescribir <b>${v.name}</b> con el contenido de texto de <b>${d.name}</b>.<br>El idioma del juego debe estar configurado en <b>${v.name}</b> para que surta efecto.<br><span style="color:var(--text-mute);font-size:12px">El archivo original se guarda automáticamente como ${v.code}.zip.bak</span>`,
    modal_restore_title: 'Restaurar copia',
    modal_restore_body: (info) => `Restaurar <b>${info.name} (${info.code})</b> desde la copia. El archivo de copia se eliminará después.`,
    modal_delete_title: 'Eliminar copia',
    modal_delete_body: (code) => `Eliminar permanentemente <b>${code}.zip.bak</b>. <span style="color:var(--danger)">Esta acción no se puede deshacer.</span> El archivo del juego no se modifica.`,
    modal_reset_title: 'Restaurar todo',
    modal_reset_body: (n) => `Restaurar ${n} archivo${n>1?'s':''} sobrescrito${n>1?'s':''} desde sus copias y devolver el juego a su estado original.`,
    toast_swap_ok: (d, v) => `✓ Cambio completado · ${d} → ${v}`,
    toast_restore_ok: (c) => `✓ ${c} restaurado`,
    toast_delete_ok: (c) => `✓ Copia de ${c} eliminada`,
    toast_reset_ok: (n) => `✓ ${n} archivo${n>1?'s':''} restaurado${n>1?'s':''}`,
    toast_err: (msg) => `Error: ${msg}`,
    warn_source_modified: 'Este archivo de idioma fue sobrescrito y no puede usarse como fuente. Restáuralo primero.',
  },
  ko: {
    language_label: '언어',
    path_not_detected: '게임 실행 파일을 찾지 못했습니다',
    path_change: 'EXE 선택',
    status_label: '현재 상태',
    status_no_override: '활성화된 교체 없음 - 게임은 원본 상태입니다',
    status_override_count: (n) => `현재 ${n}개 언어가 덮어쓰기됨`,
    status_override_sub: '이 언어 파일들은 덮어쓰기되었습니다. 게임 언어를 해당 언어로 설정하면 그 음성이 재생되지만 텍스트는 다른 언어로 표시됩니다.',
    step_caption_title: '현재 게임 언어',
    step_caption_sub: '현재 게임 안에서 설정한 언어',
    step_voice_title: '음성 대상',
    step_voice_sub: '게임 안에서 설정할 언어(이 파일이 덮어쓰기됩니다)',
    dropdown_placeholder: '선택...',
    tag_modified: '덮어쓰기됨',
    tag_blocked: '사용 불가',
    btn_execute: '교체 실행',
    backup_label: '백업 관리자',
    backup_refresh: '새로고침',
    backup_reset_all: '모두 복원',
    backup_empty: '백업 없음 - 교체 후 자동으로 생성됩니다',
    backup_restore: '복원',
    backup_delete: '삭제',
    modal_yes: '확인',
    modal_no: '취소',
    modal_swap_title: '교체 확인',
    modal_swap_body: (d, v) => `<b>${v.name}</b> 파일을 <b>${d.name}</b>의 텍스트 내용으로 덮어씁니다.<br>적용하려면 게임 언어를 <b>${v.name}</b>로 설정해야 합니다.<br><span style="color:var(--text-mute);font-size:12px">원본 파일은 ${v.code}.zip.bak으로 자동 백업됩니다</span>`,
    modal_restore_title: '백업 복원',
    modal_restore_body: (info) => `<b>${info.name} (${info.code})</b>를 백업에서 복원합니다. 복원 후 백업 파일은 삭제됩니다.`,
    modal_delete_title: '백업 삭제',
    modal_delete_body: (code) => `<b>${code}.zip.bak</b>을 영구 삭제합니다. <span style="color:var(--danger)">이 작업은 되돌릴 수 없습니다.</span> 게임 파일 자체는 변경되지 않습니다.`,
    modal_reset_title: '모두 복원',
    modal_reset_body: (n) => `덮어쓰기된 파일 ${n}개를 모두 백업에서 복원하여 게임을 원본 상태로 되돌립니다.`,
    toast_swap_ok: (d, v) => `✓ 교체 완료 · ${d} → ${v}`,
    toast_restore_ok: (c) => `✓ ${c} 복원됨`,
    toast_delete_ok: (c) => `✓ ${c} 백업 삭제됨`,
    toast_reset_ok: (n) => `✓ 파일 ${n}개 복원됨`,
    toast_err: (msg) => `오류: ${msg}`,
    warn_source_modified: '이 언어 파일은 이미 덮어쓰기되어 원본으로 사용할 수 없습니다. 먼저 복원하세요.',
  },
};

const LANGUAGE_OPTIONS = [
  ['en', 'English'],
  ['zh', '繁體中文'],
  ['ja', '日本語'],
  ['es', 'Español'],
  ['ko', '한국어'],
];

function detectLocale() {
  const stored = localStorage.getItem('fh6vs.locale');
  if (stored && I18N[stored]) return stored;
  const sys = (navigator.language || 'en').toLowerCase();
  if (sys.startsWith('zh')) return 'zh';
  if (sys.startsWith('ja')) return 'ja';
  if (sys.startsWith('es')) return 'es';
  if (sys.startsWith('ko')) return 'ko';
  return 'en';
}

let LOC = detectLocale();
const t = (key, ...args) => {
  const v = I18N[LOC]?.[key] ?? I18N.en[key] ?? key;
  return typeof v === 'function' ? v(...args) : v;
};

// Locale info for codes (language-display names, never translated)
const LOCALES = {
  BR:  { name: 'Português',  sub: 'Brasil' },
  CHS: { name: '简体中文',    sub: 'Simplified' },
  CHT: { name: '繁體中文',    sub: 'Traditional' },
  CZ:  { name: 'Čeština',    sub: 'Czech' },
  DE:  { name: 'Deutsch',    sub: 'German' },
  DK:  { name: 'Dansk',      sub: 'Danish' },
  EL:  { name: 'Ελληνικά',   sub: 'Greek' },
  EN:  { name: 'English',    sub: 'United States' },
  ES:  { name: 'Español',    sub: 'España' },
  FI:  { name: 'Suomi',      sub: 'Finnish' },
  FR:  { name: 'Français',   sub: 'French' },
  GB:  { name: 'English',    sub: 'United Kingdom' },
  HU:  { name: 'Magyar',     sub: 'Hungarian' },
  IT:  { name: 'Italiano',   sub: 'Italian' },
  JP:  { name: '日本語',     sub: 'Japanese' },
  KO:  { name: '한국어',     sub: 'Korean' },
  MX:  { name: 'Español',    sub: 'México' },
  NL:  { name: 'Nederlands', sub: 'Dutch' },
  NO:  { name: 'Norsk',      sub: 'Norwegian' },
  PL:  { name: 'Polski',     sub: 'Polish' },
  PT:  { name: 'Português',  sub: 'Portugal' },
  RU:  { name: 'Русский',    sub: 'Russian' },
  SV:  { name: 'Svenska',    sub: 'Swedish' },
  TR:  { name: 'Türkçe',     sub: 'Turkish' },
};
const localeInfo = (code) => LOCALES[code] || { name: code, sub: '—' };

// ============ State ============
const state = {
  dir: '',
  files: [],     // [{ code, filename, size }]
  backups: [],   // [{ code, filename, backup_size, modified }]
  modifiedSet: new Set(),  // codes that currently have a .bak
  selectedDisplay: null,
  selectedVoice: null,
};

// ============ DOM ============
const $ = (id) => document.getElementById(id);
const pathDot = $('pathDot');
const pathText = $('pathText');
const executeBtn = $('executeBtn');
const refreshBackupBtn = $('refreshBackupBtn');
const resetAllBtn = $('resetAllBtn');
const browseBtn = $('browseBtn');
const backupList = $('backupList');
const toast = $('toast');
const swapEmpty = $('swapEmpty');
const swapActive = $('swapActive');
const ddDisplay = $('ddDisplay');
const ddVoice = $('ddVoice');
const localeSelect = $('localeSelect');

// ============ helpers ============
const fmtBytes = (n) => {
  if (n == null) return '—';
  if (n < 1024) return n + ' B';
  if (n < 1024*1024) return (n/1024).toFixed(1) + ' KB';
  return (n/1024/1024).toFixed(2) + ' MB';
};
const fmtDate = (ts) => ts ? new Date(ts * 1000).toLocaleString() : '—';

function showToast(msg, kind = '') {
  toast.textContent = msg;
  toast.className = 'toast show ' + kind;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { toast.className = 'toast ' + kind; }, 3000);
}

function confirmDialog(title, body) {
  return new Promise((resolve) => {
    $('modalTitle').textContent = title;
    $('modalBody').innerHTML = body;
    const modal = $('modal');
    modal.hidden = false;
    const yes = $('modalYes');
    const no = $('modalNo');
    const done = (v) => { modal.hidden = true; yes.onclick = null; no.onclick = null; resolve(v); };
    yes.onclick = () => done(true);
    no.onclick = () => done(false);
  });
}

// ============ i18n apply ============
function applyI18n() {
  document.documentElement.lang = LOC;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const v = I18N[LOC]?.[key];
    if (typeof v === 'string') el.textContent = v;
  });
  localeSelect.value = LOC;
  // Re-render dynamic parts.
  renderDropdowns();
  renderBackups();
  renderOverride();
}

for (const [code, label] of LANGUAGE_OPTIONS) {
  const option = document.createElement('option');
  option.value = code;
  option.textContent = label;
  localeSelect.appendChild(option);
}

localeSelect.addEventListener('change', () => {
  LOC = localeSelect.value;
  localStorage.setItem('fh6vs.locale', LOC);
  applyI18n();
});

// ============ Dropdown component ============
function setupDropdown(dd) {
  const trigger = dd.querySelector('.dd-trigger');
  const menu = dd.querySelector('.dd-menu');
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.dropdown.open').forEach(d => { if (d !== dd) d.classList.remove('open'); });
    dd.classList.toggle('open');
  });
  menu.addEventListener('click', (e) => e.stopPropagation());
}
document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
});

setupDropdown(ddDisplay);
setupDropdown(ddVoice);

function renderDropdown(dd, selected, role, onSelect) {
  const trigger = dd.querySelector('.dd-trigger');
  const menu = dd.querySelector('.dd-menu');

  // Trigger text
  trigger.innerHTML = '';
  const left = document.createElement('span');
  if (selected) {
    left.className = 'dd-selected';
    const info = localeInfo(selected);
    left.innerHTML = `<span class="sel-code">${selected}</span><span class="sel-name">${info.name} <span style="color:var(--text-mute);font-size:11px">· ${info.sub}</span></span>`;
  } else {
    left.className = 'dd-placeholder';
    left.textContent = t('dropdown_placeholder');
  }
  const chev = document.createElement('span');
  chev.className = 'dd-chevron';
  chev.textContent = '▾';
  trigger.appendChild(left);
  trigger.appendChild(chev);

  // Menu items
  menu.innerHTML = '';
  for (const f of state.files) {
    const info = localeInfo(f.code);
    const isModified = state.modifiedSet.has(f.code);
    const item = document.createElement('div');
    item.className = 'dd-item';
    if (selected === f.code) item.classList.add('selected');
    if (role === 'display' && isModified) {
      item.classList.add('disabled');
      item.title = t('warn_source_modified');
    } else if (role === 'voice' && isModified) {
      item.classList.add('modified');
    }
    const tagText = (role === 'display' && isModified) ? t('tag_blocked')
                  : (role === 'voice' && isModified)   ? t('tag_modified')
                  : '';
    item.innerHTML = `
      <span class="item-code">${f.code}</span>
      <span class="item-name">${info.name} <span class="item-sub">· ${info.sub}</span></span>
      ${tagText ? `<span class="item-tag">${tagText}</span>` : ''}
    `;
    if (!(role === 'display' && isModified)) {
      item.addEventListener('click', () => {
        onSelect(f.code);
        dd.classList.remove('open');
      });
    }
    menu.appendChild(item);
  }
}

function renderDropdowns() {
  renderDropdown(ddDisplay, state.selectedDisplay, 'display', (code) => {
    state.selectedDisplay = code;
    renderDropdowns();
    refreshExecuteState();
  });
  renderDropdown(ddVoice, state.selectedVoice, 'voice', (code) => {
    state.selectedVoice = code;
    renderDropdowns();
    refreshExecuteState();
  });
}

function refreshExecuteState() {
  const ok = state.dir
    && state.selectedDisplay && state.selectedVoice
    && state.selectedDisplay !== state.selectedVoice
    && !state.modifiedSet.has(state.selectedDisplay);
  executeBtn.disabled = !ok;
}

// ============ Render status + backups ============
function renderOverride() {
  if (state.backups.length === 0) {
    swapEmpty.hidden = false;
    swapActive.hidden = true;
    return;
  }
  swapEmpty.hidden = true;
  swapActive.hidden = false;
  $('swapHeadCount').textContent = t('status_override_count', state.backups.length);
  const chips = $('swapActiveChips');
  chips.innerHTML = '';
  for (const b of state.backups) {
    const info = localeInfo(b.code);
    const el = document.createElement('div');
    el.className = 'override-chip';
    el.innerHTML = `<span class="oc-code">${b.code}</span><span>${info.name} · ${info.sub}</span>`;
    chips.appendChild(el);
  }
}

function renderBackups() {
  resetAllBtn.hidden = state.backups.length === 0;
  if (state.backups.length === 0) {
    backupList.innerHTML = `<div class="backup-empty">${t('backup_empty')}</div>`;
    return;
  }
  backupList.innerHTML = '';
  for (const b of state.backups) {
    const info = localeInfo(b.code);
    const row = document.createElement('div');
    row.className = 'backup-row';
    row.innerHTML = `
      <div class="backup-code">${b.code}</div>
      <div class="backup-info">
        <div class="bi-name">${info.name} <span style="color:var(--text-mute)">· ${info.sub}</span></div>
        <div class="bi-meta">${b.filename}.bak · ${fmtBytes(b.backup_size)} · ${fmtDate(b.modified)}</div>
      </div>
      <div class="backup-actions">
        <button class="primary-btn" data-action="restore" data-code="${b.code}">${t('backup_restore')}</button>
        <button class="danger-btn" data-action="delete" data-code="${b.code}">${t('backup_delete')}</button>
      </div>
    `;
    backupList.appendChild(row);
  }
  backupList.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.code;
      if (btn.dataset.action === 'restore') doRestore(code);
      else doDeleteBackup(code);
    });
  });
}

// ============ Actions ============
function setPath(p, ok) {
  state.dir = p;
  pathText.textContent = p || t('path_not_detected');
  pathDot.className = 'dot ' + (p ? (ok ? 'ok' : 'err') : '');
}

async function detectPath() {
  try {
    const p = await invoke('detect_default_path');
    if (p) await loadFolder(p);
    else setPath('', false);
  } catch {
    setPath('', false);
  }
}

async function loadFolder(p) {
  try {
    const data = await invoke('scan_folder', { dir: p });
    state.dir = p;
    state.files = data.files;
    state.backups = data.backups;
    state.modifiedSet = new Set(data.backups.map(b => b.code));
    // Reset selection if it became invalid
    if (state.selectedDisplay && state.modifiedSet.has(state.selectedDisplay)) {
      state.selectedDisplay = null;
    }
    setPath(p, true);
    renderDropdowns();
    renderBackups();
    renderOverride();
    refreshExecuteState();
  } catch (e) {
    setPath(p, false);
    showToast(t('toast_err', String(e)), 'error');
  }
}

async function refreshFolder() {
  if (state.dir) await loadFolder(state.dir);
}

browseBtn.addEventListener('click', async () => {
  try {
    const sel = await openGameExe();
    if (sel) await loadFolder(await invoke('resolve_game_exe', { exePath: sel }));
  } catch (e) {
    showToast(t('toast_err', String(e)), 'error');
  }
});

refreshBackupBtn.addEventListener('click', refreshFolder);

executeBtn.addEventListener('click', async () => {
  const d = state.selectedDisplay, v = state.selectedVoice;
  if (!d || !v) return;
  if (state.modifiedSet.has(d)) {
    showToast(t('warn_source_modified'), 'error');
    return;
  }
  const di = { code: d, name: localeInfo(d).name };
  const vi = { code: v, name: localeInfo(v).name };
  if (!await confirmDialog(t('modal_swap_title'), t('modal_swap_body', di, vi))) return;
  try {
    await invoke('do_swap', { dir: state.dir, displayCode: d, voiceCode: v });
    showToast(t('toast_swap_ok', d, v), 'success');
    await refreshFolder();
  } catch (e) {
    showToast(t('toast_err', String(e)), 'error');
  }
});

async function doRestore(code) {
  const info = { ...localeInfo(code), code };
  if (!await confirmDialog(t('modal_restore_title'), t('modal_restore_body', info))) return;
  try {
    await invoke('do_restore', { dir: state.dir, code });
    showToast(t('toast_restore_ok', code), 'success');
    await refreshFolder();
  } catch (e) {
    showToast(t('toast_err', String(e)), 'error');
  }
}

async function doDeleteBackup(code) {
  if (!await confirmDialog(t('modal_delete_title'), t('modal_delete_body', code))) return;
  try {
    await invoke('delete_backup', { dir: state.dir, code });
    showToast(t('toast_delete_ok', code), 'success');
    await refreshFolder();
  } catch (e) {
    showToast(t('toast_err', String(e)), 'error');
  }
}

resetAllBtn.addEventListener('click', async () => {
  const n = state.backups.length;
  if (!await confirmDialog(t('modal_reset_title'), t('modal_reset_body', n))) return;
  try {
    const restored = await invoke('reset_all', { dir: state.dir });
    showToast(t('toast_reset_ok', restored), 'success');
    await refreshFolder();
  } catch (e) {
    showToast(t('toast_err', String(e)), 'error');
  }
});

// ============ Init ============
applyI18n();
detectPath();
