import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const BASE = 'chibi, 2D vector, white background'

const SECTIONS = [
  {
    id: 'gender',
    label: '성별',
    icon: '👤',
    multi: false,
    accent: '#f9c6d0',
    border: '#e89aaa',
    options: [
      { label: '여성 선생님', value: 'female teacher' },
      { label: '남성 선생님', value: 'male teacher' },
    ],
  },
  {
    id: 'hair',
    label: '헤어스타일',
    icon: '💇',
    multi: false,
    accent: '#d8c8f0',
    border: '#a88ed4',
    options: [
      { label: '단발머리',     value: 'short bob hair' },
      { label: '긴 직모',     value: 'long straight hair' },
      { label: '포니테일',    value: 'high ponytail' },
      { label: '올림머리',    value: 'bun hairstyle' },
      { label: '웨이브 긴머리', value: 'wavy long hair' },
      { label: '짧은 곱슬',  value: 'short curly hair' },
      { label: '양갈래',     value: 'pigtails' },
    ],
  },
  {
    id: 'outfit',
    label: '의상',
    icon: '👔',
    multi: false,
    accent: '#fde2c8',
    border: '#e8aa7a',
    options: [
      { label: '비즈니스 캐주얼',  value: 'business casual outfit' },
      { label: '흰 가운',         value: 'white lab coat' },
      { label: '정장',            value: 'formal suit' },
      { label: '스마트 캐주얼',   value: 'smart casual wear' },
      { label: '한복',            value: 'traditional hanbok' },
      { label: '니트 & 스커트',   value: 'cozy sweater and skirt' },
      { label: '파스텔 블라우스', value: 'pastel blouse and trousers' },
    ],
  },
  {
    id: 'props',
    label: '과목 소품',
    icon: '📚',
    multi: true,
    accent: '#c2ece4',
    border: '#6ecabb',
    hint: '복수 선택 가능',
    options: [
      { label: '수학 (자·계산기)',    value: 'holding a ruler and calculator' },
      { label: '과학 (현미경·플라스크)', value: 'holding a microscope and flask' },
      { label: '국어·영어 (책·펜)',   value: 'holding a book and pen' },
      { label: '미술 (팔레트·붓)',    value: 'holding a palette and paintbrush' },
      { label: '음악 (악보·지휘봉)',  value: 'holding a music sheet and baton' },
      { label: '체육 (호루라기·공)',  value: 'holding a whistle and sports ball' },
      { label: '역사 (지구본·두루마리)', value: 'holding a globe and scroll' },
      { label: '컴퓨터 (노트북)',     value: 'holding a laptop' },
      { label: '포인터 막대',        value: 'holding a pointer stick' },
    ],
  },
  {
    id: 'personality',
    label: '성격·분위기',
    icon: '✨',
    multi: true,
    accent: '#fdf3c2',
    border: '#d4c04a',
    hint: '복수 선택 가능',
    options: [
      { label: '밝고 명랑한',      value: 'cheerful expression' },
      { label: '엄격하고 당당한',  value: 'strict and confident expression' },
      { label: '온화하고 따뜻한',  value: 'gentle and warm smile' },
      { label: '활기차고 생동감',  value: 'energetic and lively pose' },
      { label: '차분하고 지혜로운', value: 'calm and wise expression' },
      { label: '창의적이고 독특한', value: 'creative and quirky pose' },
      { label: '친근하고 다가가기 쉬운', value: 'friendly and approachable smile' },
      { label: '쿨하고 세련된',    value: 'cool and stylish pose' },
    ],
  },
]

function buildPrompt(state) {
  const parts = []
  SECTIONS.forEach(({ id, multi }) => {
    if (multi) {
      state[id].forEach(v => parts.push(v))
    } else if (state[id]) {
      parts.push(state[id])
    }
  })
  parts.push(BASE)
  return parts.join(', ')
}

function initState() {
  const s = {}
  SECTIONS.forEach(({ id, multi }) => {
    s[id] = multi ? new Set() : null
  })
  return s
}

export default function SDPromptGenerator() {
  const navigate = useNavigate()
  const [state, setState] = useState(initState)
  const [copied, setCopied] = useState(false)

  const toggle = useCallback((sectionId, value, multi) => {
    setState(prev => {
      const next = { ...prev }
      if (multi) {
        const set = new Set(prev[sectionId])
        set.has(value) ? set.delete(value) : set.add(value)
        next[sectionId] = set
      } else {
        next[sectionId] = prev[sectionId] === value ? null : value
      }
      return next
    })
  }, [])

  const reset = useCallback(() => setState(initState()), [])

  const prompt = buildPrompt(state)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = prompt
      ta.style.cssText = 'position:fixed;opacity:0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');

        .sdpg-root { font-family: 'Nunito', 'Apple SD Gothic Neo', sans-serif; }

        .sdpg-chip {
          padding: 8px 16px;
          border-radius: 99px;
          font-size: 0.87rem;
          font-weight: 700;
          cursor: pointer;
          border: 2px solid transparent;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
          user-select: none;
          background: #f0ecf8;
          color: #4a4063;
          outline: none;
        }
        .sdpg-chip:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(120,100,160,0.18);
        }
        .sdpg-chip:focus-visible {
          box-shadow: 0 0 0 3px rgba(120,100,160,0.35);
        }

        .sdpg-copy-btn {
          padding: 11px 28px;
          border-radius: 99px;
          background: linear-gradient(135deg, #c27fe0, #6fa9f0);
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-size: 0.93rem;
          font-weight: 800;
          border: none;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          box-shadow: 0 4px 14px rgba(120,100,200,0.28);
        }
        .sdpg-copy-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(120,100,200,0.38); }
        .sdpg-copy-btn:active { transform: translateY(0); }

        .sdpg-reset-btn {
          padding: 11px 22px;
          border-radius: 99px;
          background: #f0ecf8;
          color: #8a7fa0;
          font-family: 'Nunito', sans-serif;
          font-size: 0.87rem;
          font-weight: 700;
          border: 2px solid #e8dff5;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .sdpg-reset-btn:hover { background: #e8e0f5; }

        .sdpg-back-btn {
          padding: 8px 20px;
          border-radius: 99px;
          background: rgba(255,255,255,0.7);
          color: #8a7fa0;
          font-family: 'Nunito', sans-serif;
          font-size: 0.84rem;
          font-weight: 700;
          border: 2px solid #e8dff5;
          cursor: pointer;
          transition: background 0.15s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .sdpg-back-btn:hover { background: #fff; }

        .sdpg-feedback {
          font-size: 0.84rem;
          font-weight: 700;
          color: #6ecabb;
          transition: opacity 0.3s ease;
        }

        @media (max-width: 600px) {
          .sdpg-title { font-size: 1.35rem !important; }
          .sdpg-card  { padding: 16px !important; }
        }
      `}</style>

      <div className="sdpg-root" style={styles.inner}>
        {/* Header */}
        <header style={styles.header}>
          <button className="sdpg-back-btn" onClick={() => navigate(-1)}>
            ← 뒤로가기
          </button>
          <h1 className="sdpg-title" style={styles.title}>
            🎨 <span style={styles.gradient}>SD 캐릭터 프롬프트 생성기</span>
          </h1>
          <p style={styles.subtitle}>
            선생님 캐릭터를 클릭으로 조합하고, 영어 프롬프트를 바로 복사하세요!
          </p>
        </header>

        {/* Sections */}
        <div style={styles.sections}>
          {SECTIONS.map(section => {
            const count = section.multi
              ? state[section.id].size
              : state[section.id] ? 1 : 0

            return (
              <div key={section.id} className="sdpg-card" style={styles.card}>
                <div style={styles.sectionTitle}>
                  <span style={{ fontSize: '1.05rem' }}>{section.icon}</span>
                  <span>{section.label}</span>
                  {count > 0 && (
                    <span style={styles.badge}>{count}</span>
                  )}
                </div>

                <div style={styles.chips}>
                  {section.options.map(opt => {
                    const isActive = section.multi
                      ? state[section.id].has(opt.value)
                      : state[section.id] === opt.value

                    return (
                      <button
                        key={opt.value}
                        className="sdpg-chip"
                        style={isActive
                          ? { background: section.accent, borderColor: section.border }
                          : {}
                        }
                        onClick={() => toggle(section.id, opt.value, section.multi)}
                        aria-pressed={isActive}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>

                {section.hint && (
                  <p style={styles.hint}>{section.hint}</p>
                )}
              </div>
            )
          })}
        </div>

        {/* Prompt Output */}
        <div className="sdpg-card" style={{ ...styles.card, marginTop: 8 }}>
          <div style={styles.sectionTitle}>
            <span style={{ fontSize: '1.05rem' }}>⚡</span>
            <span>생성된 프롬프트</span>
          </div>

          <div style={styles.promptBox}>
            {prompt}
          </div>

          <div style={styles.actions}>
            <button className="sdpg-copy-btn" onClick={handleCopy}>
              📋 복사하기
            </button>
            <button className="sdpg-reset-btn" onClick={reset}>
              🔄 초기화
            </button>
            <span
              className="sdpg-feedback"
              style={{ opacity: copied ? 1 : 0 }}
            >
              ✅ 클립보드에 복사됐어요!
            </span>
          </div>
        </div>

        <footer style={styles.footer}>
          기본 포함 키워드: <strong>chibi, 2D vector, white background</strong>
        </footer>
      </div>
    </div>
  )
}

const styles = {
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #fdf7f0 0%, #f5f0ff 50%, #f0f8ff 100%)',
    overflowY: 'auto',
    padding: '32px 16px 60px',
  },
  inner: {
    maxWidth: 860,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  header: {
    textAlign: 'center',
    marginBottom: 32,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#4a4063',
    letterSpacing: '-0.5px',
    margin: 0,
  },
  gradient: {
    background: 'linear-gradient(135deg, #c27fe0, #6fa9f0)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '0.92rem',
    color: '#8a7fa0',
    margin: 0,
  },
  sections: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    marginBottom: 20,
  },
  card: {
    background: '#ffffff',
    borderRadius: 14,
    padding: '20px 22px',
    boxShadow: '0 4px 18px rgba(120,100,160,0.10)',
    border: '1px solid #e8dff5',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: '0.8rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#8a7fa0',
    marginBottom: 14,
  },
  badge: {
    background: 'linear-gradient(135deg, #c27fe0, #6fa9f0)',
    color: '#fff',
    borderRadius: 99,
    fontSize: '0.7rem',
    fontWeight: 800,
    padding: '1px 7px',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
  },
  hint: {
    fontSize: '0.76rem',
    color: '#b0a8c0',
    margin: '10px 0 0',
  },
  promptBox: {
    background: 'linear-gradient(135deg, #f7f2ff, #f0f8ff)',
    border: '1.5px solid #e8dff5',
    borderRadius: 10,
    padding: '15px 18px',
    fontSize: '0.88rem',
    lineHeight: 1.75,
    color: '#3d3456',
    wordBreak: 'break-all',
    minHeight: 70,
    fontFamily: "'Courier New', 'Consolas', monospace",
    letterSpacing: '0.3px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  footer: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: '0.78rem',
    color: '#c0b8d0',
  },
}
