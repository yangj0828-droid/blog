import { useState, useCallback } from 'react'
import './index.css'

// ─── 유틸 ───
function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// ─── 탭 버튼 ───
function Tab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 text-sm font-medium rounded-lg transition-all',
        active
          ? 'bg-indigo-500 text-white shadow-sm'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
      )}
    >
      {children}
    </button>
  )
}

// ─── 복사 버튼 ───
function CopyButton({ getText }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert('복사 실패: 브라우저에서 클립보드 접근을 허용해주세요.')
    }
  }
  return (
    <button
      onClick={handleCopy}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
        copied
          ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700'
          : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm'
      )}
    >
      {copied ? '✓ 복사됨!' : '📋 노션에 복사'}
    </button>
  )
}

// ═══════════════════════════════════════════════
//  1) 할일 목록
// ═══════════════════════════════════════════════
const PRIORITY_STYLE = {
  high:   'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  low:    'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
}
const PRIORITY_LABEL = { high: '🔴 높음', medium: '🟡 중간', low: '🟢 낮음' }

function TodoTab() {
  const [todos, setTodos] = useState([
    { id: 1, done: false, text: '기획안 작성하기',   category: '업무',   priority: 'high',   due: '' },
    { id: 2, done: false, text: '운동 30분',         category: '건강',   priority: 'medium', due: '' },
    { id: 3, done: false, text: '책 20페이지 읽기',  category: '자기계발', priority: 'low',  due: '' },
    { id: 4, done: false, text: '일일 회고 작성',    category: '습관',   priority: 'medium', due: '' },
  ])
  const [form, setForm] = useState({ text: '', category: '', priority: 'medium', due: '' })

  const addTodo = () => {
    if (!form.text.trim()) return
    setTodos(prev => [...prev, { id: Date.now(), done: false, ...form, text: form.text.trim() }])
    setForm(f => ({ ...f, text: '', due: '' }))
  }

  const toggle = id => setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const remove = id => setTodos(prev => prev.filter(t => t.id !== id))

  const toNotionText = useCallback(() => {
    const lines = ['## ✅ 할일 목록\n']
    const byCategory = {}
    todos.forEach(t => {
      const cat = t.category || '기타'
      if (!byCategory[cat]) byCategory[cat] = []
      byCategory[cat].push(t)
    })
    Object.entries(byCategory).forEach(([cat, items]) => {
      lines.push(`### ${cat}`)
      items.forEach(t => {
        const check = t.done ? '[x]' : '[ ]'
        const due   = t.due ? ` 📅 ${t.due}` : ''
        const pri   = t.priority === 'high' ? ' 🔴' : t.priority === 'medium' ? ' 🟡' : ' 🟢'
        lines.push(`- ${check} ${t.text}${pri}${due}`)
      })
      lines.push('')
    })
    return lines.join('\n')
  }, [todos])

  return (
    <div className="space-y-5">
      {/* 추가 폼 */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">할일 추가</p>
        <div className="flex gap-2 flex-wrap">
          <input
            value={form.text}
            onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
            placeholder="할일 입력..."
            className="flex-1 min-w-[180px] px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <input
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            placeholder="카테고리"
            className="w-28 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <select
            value={form.priority}
            onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          >
            <option value="high">🔴 높음</option>
            <option value="medium">🟡 중간</option>
            <option value="low">🟢 낮음</option>
          </select>
          <input
            type="date"
            value={form.due}
            onChange={e => setForm(f => ({ ...f, due: e.target.value }))}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            + 추가
          </button>
        </div>
      </div>

      {/* 목록 */}
      <div className="space-y-2">
        {todos.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-10">할일을 추가해 보세요</p>
        )}
        {todos.map(t => (
          <div
            key={t.id}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all',
              t.done
                ? 'bg-gray-50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800 opacity-60'
                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
            )}
          >
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggle(t.id)}
              className="w-4 h-4 accent-indigo-500 cursor-pointer shrink-0"
            />
            <span className={cn('flex-1 text-sm', t.done && 'line-through text-gray-400')}>
              {t.text}
            </span>
            {t.category && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                {t.category}
              </span>
            )}
            <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium shrink-0', PRIORITY_STYLE[t.priority])}>
              {PRIORITY_LABEL[t.priority]}
            </span>
            {t.due && (
              <span className="text-xs text-gray-400 shrink-0">📅 {t.due}</span>
            )}
            <button
              onClick={() => remove(t.id)}
              className="text-gray-300 dark:text-gray-600 hover:text-red-400 transition-colors text-sm shrink-0 ml-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* 노션 미리보기 */}
      <PreviewBox getText={toNotionText} />
    </div>
  )
}

// ═══════════════════════════════════════════════
//  2) 주간 스케줄표
// ═══════════════════════════════════════════════
const DAYS = ['월', '화', '수', '목', '금', '토', '일']
const DEFAULT_SLOTS = ['오전', '점심', '오후', '저녁']

function WeeklyTab() {
  const [title, setTitle] = useState('주간 스케줄')
  const [slots, setSlots] = useState(DEFAULT_SLOTS)
  const [newSlot, setNewSlot] = useState('')
  const [cells, setCells] = useState(() => {
    const obj = {}
    DEFAULT_SLOTS.forEach(s => DAYS.forEach(d => { obj[`${s}|${d}`] = '' }))
    return obj
  })

  const setCell = (s, d, val) => setCells(prev => ({ ...prev, [`${s}|${d}`]: val }))

  const addSlot = () => {
    const s = newSlot.trim()
    if (!s || slots.includes(s)) return
    setSlots(prev => [...prev, s])
    DAYS.forEach(d => setCells(prev => ({ ...prev, [`${s}|${d}`]: '' })))
    setNewSlot('')
  }

  const removeSlot = s => {
    setSlots(prev => prev.filter(x => x !== s))
    setCells(prev => {
      const next = { ...prev }
      DAYS.forEach(d => delete next[`${s}|${d}`])
      return next
    })
  }

  const toNotionText = useCallback(() => {
    const lines = [`## 📅 ${title}\n`]
    lines.push(`| 시간대 | ${DAYS.join(' | ')} |`)
    lines.push(`| :---: | ${DAYS.map(() => ':---:').join(' | ')} |`)
    slots.forEach(s => {
      const row = DAYS.map(d => cells[`${s}|${d}`] || ' ').join(' | ')
      lines.push(`| **${s}** | ${row} |`)
    })
    return lines.join('\n')
  }, [title, slots, cells])

  return (
    <div className="space-y-5">
      <div className="flex gap-3 items-center flex-wrap">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="flex-1 min-w-[160px] px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          placeholder="스케줄 제목"
        />
        <div className="flex gap-2">
          <input
            value={newSlot}
            onChange={e => setNewSlot(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addSlot()}
            placeholder="시간대 추가 (예: 새벽)"
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition w-44"
          />
          <button
            onClick={addSlot}
            className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            + 추가
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 w-20 border-b border-gray-200 dark:border-gray-700">시간대</th>
              {DAYS.map(d => (
                <th key={d} className={cn(
                  'px-2 py-2.5 text-center text-xs font-semibold border-b border-gray-200 dark:border-gray-700 min-w-[90px]',
                  d === '토' || d === '일' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
                )}>
                  {d}
                </th>
              ))}
              <th className="w-8 border-b border-gray-200 dark:border-gray-700" />
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, si) => (
              <tr key={slot} className={cn(
                'border-b border-gray-100 dark:border-gray-800 last:border-b-0',
                si % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/30'
              )}>
                <td className="px-3 py-1.5 font-medium text-xs text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 whitespace-nowrap">
                  {slot}
                </td>
                {DAYS.map(day => (
                  <td key={day} className="px-1 py-1 border-r border-gray-100 dark:border-gray-800 last:border-r-0">
                    <input
                      value={cells[`${slot}|${day}`]}
                      onChange={e => setCell(slot, day, e.target.value)}
                      className="w-full px-2 py-1.5 rounded text-xs bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-900/20 focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:outline-none focus:ring-1 focus:ring-indigo-300 dark:focus:ring-indigo-600 transition-colors text-center"
                      placeholder="—"
                    />
                  </td>
                ))}
                <td className="px-2 py-1 text-center">
                  <button onClick={() => removeSlot(slot)} className="text-gray-300 dark:text-gray-600 hover:text-red-400 text-xs">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PreviewBox getText={toNotionText} />
    </div>
  )
}

// ═══════════════════════════════════════════════
//  3) 일간 타임테이블
// ═══════════════════════════════════════════════
const HOURS = Array.from({ length: 18 }, (_, i) => {
  const h = i + 6
  const ampm = h < 12 ? '오전' : h === 12 ? '정오' : '오후'
  const display = h <= 12 ? h : h - 12
  return { h, label: `${ampm} ${display}:00` }
})

function DailyTab() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [schedule, setSchedule] = useState(() => Object.fromEntries(HOURS.map(({ h }) => [h, ''])))
  const [memo, setMemo] = useState('')

  const toNotionText = useCallback(() => {
    const lines = [`## 🗓 ${date} 일간 타임테이블\n`]
    lines.push('| 시간 | 일정 |', '| :---: | :--- |')
    HOURS.forEach(({ h, label }) => {
      lines.push(`| **${label}** | ${schedule[h] || ' '} |`)
    })
    if (memo.trim()) {
      lines.push('', '### 📝 오늘의 메모', memo)
    }
    return lines.join('\n')
  }, [date, schedule, memo])

  return (
    <div className="space-y-5">
      <div className="flex gap-3 items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">날짜</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 w-32 border-b border-gray-200 dark:border-gray-700">시간</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 border-b border-gray-200 dark:border-gray-700">일정</th>
            </tr>
          </thead>
          <tbody>
            {HOURS.map(({ h, label }, i) => (
              <tr key={h} className={cn(
                'border-b border-gray-100 dark:border-gray-800 last:border-b-0',
                i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/30'
              )}>
                <td className={cn(
                  'px-4 py-1.5 text-xs font-semibold whitespace-nowrap border-r border-gray-200 dark:border-gray-700',
                  h >= 18 ? 'text-purple-500' : h >= 12 ? 'text-orange-500' : 'text-blue-500'
                )}>
                  {label}
                </td>
                <td className="px-2 py-1">
                  <input
                    value={schedule[h]}
                    onChange={e => setSchedule(prev => ({ ...prev, [h]: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded text-sm bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-900/20 focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:outline-none focus:ring-1 focus:ring-indigo-300 dark:focus:ring-indigo-600 transition-colors"
                    placeholder="일정을 입력하세요..."
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">오늘의 메모</label>
        <textarea
          value={memo}
          onChange={e => setMemo(e.target.value)}
          placeholder="오늘의 메모를 입력하세요..."
          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none min-h-[80px]"
        />
      </div>

      <PreviewBox getText={toNotionText} />
    </div>
  )
}

// ─── 노션 미리보기 공통 박스 ───
function PreviewBox({ getText }) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">노션 붙여넣기 미리보기</span>
        <CopyButton getText={getText} />
      </div>
      <pre className="p-4 text-xs text-gray-500 dark:text-gray-400 whitespace-pre-wrap leading-relaxed overflow-x-auto font-mono bg-white dark:bg-gray-900">
        {getText()}
      </pre>
    </div>
  )
}

// ═══════════════════════════════════════════════
//  메인 앱
// ═══════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState('todo')
  const [dark, setDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        {/* 헤더 */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-4xl mx-auto px-5 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">📝 노션 템플릿 생성기</h1>
              <p className="text-xs text-gray-400">작성 후 복사 버튼으로 노션에 바로 붙여넣기</p>
            </div>
            <button
              onClick={() => setDark(d => !d)}
              className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="다크모드 전환"
            >
              {dark ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-5 py-8 space-y-6">
          {/* 탭 */}
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
            <Tab active={tab === 'todo'}   onClick={() => setTab('todo')}>  ✅ 할일 목록</Tab>
            <Tab active={tab === 'weekly'} onClick={() => setTab('weekly')}>📅 주간 스케줄</Tab>
            <Tab active={tab === 'daily'}  onClick={() => setTab('daily')}> 🗓 일간 타임테이블</Tab>
          </div>

          {/* 안내 */}
          <div className="flex items-start gap-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl px-4 py-3">
            <span className="text-indigo-500 text-sm mt-0.5">💡</span>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 leading-relaxed">
              내용을 작성하고 <strong>📋 노션에 복사</strong> 버튼을 누른 후, 노션 페이지에서 <kbd className="px-1 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-[10px]">Ctrl+V</kbd> (Mac: <kbd className="px-1 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-[10px]">⌘+V</kbd>) 로 붙여넣으세요. 표와 체크박스가 자동으로 만들어집니다!
            </p>
          </div>

          {/* 컨텐츠 */}
          <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            {tab === 'todo'   && <TodoTab />}
            {tab === 'weekly' && <WeeklyTab />}
            {tab === 'daily'  && <DailyTab />}
          </div>
        </main>

        <footer className="border-t border-gray-200 dark:border-gray-800 py-4 text-center text-xs text-gray-400">
          노션 템플릿 생성기 — 작성 후 바로 복사해서 사용하세요
        </footer>
      </div>
    </div>
  )
}
