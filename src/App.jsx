import { useState, useEffect, useCallback } from 'react'
import { BlurFade } from '@/components/ui/blur-fade'
import { DotPattern } from '@/components/ui/dot-pattern'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

// ===== 샘플 포스트 — 영화 포스터 테마 (9개) =====
const SAMPLE_POSTS = [
  {
    id: 1,
    title: 'INCEPTION',
    subtitle: '꿈 속의 꿈',
    body: '크리스토퍼 놀란 감독의 2010년작. 꿈이라는 공간을 배경으로 펼쳐지는 첩보 스릴러.\n\n꿈과 현실의 경계를 무너뜨리는 독창적인 세계관이 압도적입니다.\n\n> 당신은 꿈 속에 있다는 걸 어떻게 알 수 있는가?\n\n팽이가 멈추는지 멈추지 않는지, 그 마지막 장면이 오늘도 머릿속을 맴돕니다.',
    tags: ['SF', '스릴러'],
    date: '2025-01-10',
    cover: 'https://picsum.photos/id/1074/400/600',
    year: '2010',
    director: 'Christopher Nolan',
  },
  {
    id: 2,
    title: 'PARASITE',
    subtitle: '기생충',
    body: '봉준호 감독의 2019년 칸 황금종려상, 아카데미 작품상 수상작.\n\n두 가족의 충돌을 통해 계층과 불평등을 날카롭게 해부합니다.\n\n> 계획이 없는 게 계획이야.\n\n반지하 집의 계단 하나하나가 상징하는 수직적 사회구조. 볼 때마다 새로운 것이 보입니다.',
    tags: ['드라마', '스릴러'],
    date: '2025-01-18',
    cover: 'https://picsum.photos/id/137/400/600',
    year: '2019',
    director: 'Bong Joon-ho',
  },
  {
    id: 3,
    title: 'INTERSTELLAR',
    subtitle: '인터스텔라',
    body: '우주의 광대함과 시간의 상대성, 그리고 인간의 사랑이 교차하는 이야기.\n\n블랙홀 가르강튀아의 시각적 재현은 실제 물리학을 기반으로 제작되었습니다.\n\n> 우리는 답을 찾을 것이다. 늘 그래왔듯이.\n\n5차원 존재로서의 쿠퍼가 책장을 통해 메시지를 전달하는 장면은 볼 때마다 소름이 돋습니다.',
    tags: ['SF', '어드벤처'],
    date: '2025-02-01',
    cover: 'https://picsum.photos/id/1043/400/600',
    year: '2014',
    director: 'Christopher Nolan',
  },
  {
    id: 4,
    title: 'OLDBOY',
    subtitle: '올드보이',
    body: '박찬욱 감독의 복수 3부작 중 두 번째 작품. 2003년 칸 국제영화제 심사위원 대상.\n\n15년간 감금된 남자의 복수와 그 끝에 기다리는 충격적인 진실.\n\n> 웃어라, 온 세상이 너와 함께 웃을 것이다. 울어라, 너 혼자 울 것이다.\n\n복도 격투 장면의 원테이크 촬영은 한국 영화사의 명장면입니다.',
    tags: ['느와르', '스릴러'],
    date: '2025-02-14',
    cover: 'https://picsum.photos/id/577/400/600',
    year: '2003',
    director: '박찬욱',
  },
  {
    id: 5,
    title: 'BLADE RUNNER 2049',
    subtitle: '블레이드 러너 2049',
    body: '드니 빌뇌브 감독의 2017년 SF 걸작. 로저 디킨스의 촬영은 그 해 최고였습니다.\n\n인간이란 무엇인가, 기억이란 무엇인가에 대한 깊은 질문을 던집니다.\n\n> 기적은 기억이 없는 것들을 위한 것입니다.\n\n황량한 미래 도시의 비주얼은 한 장 한 장이 예술 작품입니다.',
    tags: ['SF', '느와르'],
    date: '2025-02-22',
    cover: 'https://picsum.photos/id/1023/400/600',
    year: '2017',
    director: 'Denis Villeneuve',
  },
  {
    id: 6,
    title: 'MOONLIGHT',
    subtitle: '문라이트',
    body: '배리 젠킨스 감독의 2016년 아카데미 작품상 수상작.\n\n한 흑인 남성의 유년기·청소년기·성인기를 통해 정체성과 사랑을 탐구합니다.\n\n> 달빛 아래서 흑인 소년은 파랗게 보인다.\n\n세 챕터로 나뉜 구성과 각 시기의 다른 배우 기용이 탁월한 연출입니다.',
    tags: ['드라마'],
    date: '2025-03-05',
    cover: 'https://picsum.photos/id/240/400/600',
    year: '2016',
    director: 'Barry Jenkins',
  },
  {
    id: 7,
    title: 'PORTRAIT OF A LADY ON FIRE',
    subtitle: '타오르는 여인의 초상',
    body: '셀린 시아마 감독의 2019년 칸 각본상 수상작.\n\n18세기 프랑스를 배경으로, 화가와 모델 사이의 금지된 사랑을 그립니다.\n\n> 뒤돌아보면 그녀를 잃는다. 뒤돌아보지 않으면 영원히 그리워한다.\n\n대사 없이 시선과 표정만으로 감정을 전달하는 연출이 경이롭습니다.',
    tags: ['드라마', '로맨스'],
    date: '2025-03-12',
    cover: 'https://picsum.photos/id/355/400/600',
    year: '2019',
    director: 'Céline Sciamma',
  },
  {
    id: 8,
    title: 'DRIVE MY CAR',
    subtitle: '드라이브 마이 카',
    body: '하마구치 류스케 감독의 2021년 아카데미 국제영화상 수상작.\n\n무라카미 하루키 단편을 원작으로, 상실과 소통에 대해 조용하게 이야기합니다.\n\n> 우리는 계속 살아가야 합니다.\n\n179분의 긴 러닝타임이 전혀 길게 느껴지지 않는, 흡입력 있는 작품입니다.',
    tags: ['드라마'],
    date: '2025-03-20',
    cover: 'https://picsum.photos/id/453/400/600',
    year: '2021',
    director: '濱口竜介',
  },
  {
    id: 9,
    title: 'THE ZONE OF INTEREST',
    subtitle: '관심 구역',
    body: '조나단 글레이저 감독의 2023년 칸 심사위원 대상 수상작.\n\n아우슈비츠 옆에서 평범한 일상을 보내는 나치 장교 가족의 이야기.\n\n> 악의 평범성이란 이런 것이다.\n\n스크린 밖에서 들려오는 소리만으로 공포를 만들어내는 연출이 충격적입니다.',
    tags: ['역사', '드라마'],
    date: '2025-04-01',
    cover: 'https://picsum.photos/id/718/400/600',
    year: '2023',
    director: 'Jonathan Glazer',
  },
]

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function getReadTime(body) {
  return Math.max(1, Math.ceil(body.length / 400))
}

function getExcerpt(body) {
  return body.replace(/^>\s.+$/gm, '').replace(/\n+/g, ' ').trim().slice(0, 110)
}

function renderBody(body) {
  return body.split('\n').map((line, i) => {
    if (line.startsWith('> '))
      return <blockquote key={i} className="border-l-4 border-primary pl-4 py-1 my-3 bg-accent/30 rounded-r-md italic text-muted-foreground">{line.slice(2)}</blockquote>
    if (line === '---')
      return <hr key={i} className="my-4 border-border" />
    if (line.trim() === '')
      return <div key={i} className="h-3" />
    return <p key={i} className="mb-2">{line}</p>
  })
}

// ===== 태그 배지 =====
function TagBadge({ tag, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1 rounded-full text-xs font-medium transition-all border',
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-secondary text-secondary-foreground border-border hover:border-primary hover:text-primary'
      )}
    >
      {tag}
    </button>
  )
}

// ===== 필름 스프로킷 홀 행 =====
function SprocketRow() {
  return (
    <div className="flex items-center bg-neutral-900 px-1 py-[3px] gap-[5px]">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="w-[7px] h-[5px] rounded-[2px] bg-neutral-700 flex-shrink-0" />
      ))}
    </div>
  )
}

// ===== 필름 포스터 카드 =====
function PostCard({ post, onClick, index }) {
  return (
    <BlurFade delay={0.05 + index * 0.06} inView>
      <div
        onClick={onClick}
        className="group cursor-pointer"
        style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.35))' }}
      >
        {/* 필름 스트립 래퍼 */}
        <div className="rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 transition-transform duration-300 group-hover:-translate-y-2">

          {/* 상단 스프로킷 */}
          <SprocketRow />

          {/* 포스터 이미지 */}
          <div className="relative overflow-hidden aspect-[2/3]">
            <img
              src={post.cover}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ filter: 'contrast(1.08) brightness(0.88) saturate(0.85)' }}
            />

            {/* 그레인 오버레이 */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
                backgroundSize: '128px 128px',
                mixBlendMode: 'overlay',
                opacity: 0.55,
              }}
            />

            {/* 비네트 */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)' }}
            />

            {/* 하단 그라디언트 + 텍스트 */}
            <div className="absolute bottom-0 left-0 right-0 px-3 pt-10 pb-3"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)' }}>
              <p className="text-[9px] tracking-[0.2em] text-neutral-400 uppercase mb-0.5">
                {post.year} · {post.director}
              </p>
              <h2 className="text-white font-black text-sm tracking-widest leading-tight uppercase">
                {post.title}
              </h2>
              {post.subtitle && (
                <p className="text-neutral-300 text-[10px] mt-0.5 font-light tracking-wide">{post.subtitle}</p>
              )}
              <div className="flex gap-1 mt-1.5 flex-wrap">
                {post.tags.map(t => (
                  <span key={t} className="text-[8px] px-1.5 py-0.5 rounded border border-white/25 text-white/70 tracking-wider uppercase">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 하단 스프로킷 */}
          <SprocketRow />
        </div>
      </div>
    </BlurFade>
  )
}

// ===== 메인 앱 =====
export default function App() {
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('blog_posts')
      if (saved) {
        const parsed = JSON.parse(saved)
        // cover 필드 없으면 구버전 데이터 → SAMPLE_POSTS로 초기화
        if (!parsed[0]?.cover) {
          localStorage.removeItem('blog_posts')
          return SAMPLE_POSTS
        }
        return parsed
      }
      return SAMPLE_POSTS
    } catch {
      return SAMPLE_POSTS
    }
  })
  const [view, setView] = useState('list') // 'list' | 'post' | 'editor' | 'about'
  const [selectedId, setSelectedId] = useState(null)
  const [activeTag, setActiveTag] = useState(null)
  const [search, setSearch] = useState('')
  const [theme, setTheme] = useState(() => localStorage.getItem('blog_theme') || 'light')
  const [form, setForm] = useState({ title: '', tags: '', body: '' })

  // 테마 적용
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('blog_theme', theme)
  }, [theme])

  // 포스트 저장
  useEffect(() => {
    localStorage.setItem('blog_posts', JSON.stringify(posts))
  }, [posts])

  const allTags = [...new Set(posts.flatMap(p => p.tags))]

  const filtered = posts
    .filter(p => {
      const matchTag = !activeTag || p.tags.includes(activeTag)
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.body.toLowerCase().includes(search.toLowerCase())
      return matchTag && matchSearch
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const selectedPost = posts.find(p => p.id === selectedId)

  const goList = useCallback(() => {
    setView('list')
    setSelectedId(null)
  }, [])

  const handleSave = () => {
    if (!form.title.trim()) return alert('제목을 입력해주세요.')
    if (!form.body.trim()) return alert('내용을 입력해주세요.')
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
    const newPost = {
      id: Date.now(),
      title: form.title.trim(),
      body: form.body.trim(),
      tags,
      date: new Date().toISOString().split('T')[0],
    }
    setPosts(prev => [...prev, newPost])
    setForm({ title: '', tags: '', body: '' })
    goList()
  }

  const handleDelete = (id) => {
    if (!confirm('이 글을 삭제하시겠습니까?')) return
    setPosts(prev => prev.filter(p => p.id !== id))
    goList()
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
          <button
            onClick={goList}
            className="text-lg font-bold text-primary hover:opacity-80 transition-opacity"
          >
            MAGAZINE
          </button>
          <nav className="flex items-center gap-2">
            <button onClick={goList} className="hidden sm:block text-sm text-muted-foreground hover:text-primary transition-colors px-2">홈</button>
            <button onClick={() => setView('about')} className="hidden sm:block text-sm text-muted-foreground hover:text-primary transition-colors px-2">소개</button>
            <Button size="sm" onClick={() => { setForm({ title: '', tags: '', body: '' }); setView('editor') }}>
              + 새 글쓰기
            </Button>
            <button
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 rounded-full border border-border bg-secondary flex items-center justify-center text-sm hover:bg-accent transition-colors"
              aria-label="테마 전환"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-5 py-8">

        {/* ─── 목록 뷰 ─── */}
        {view === 'list' && (
          <div className="relative">
            <DotPattern className={cn("[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]", "opacity-40")} />
            <div className="relative z-10">
              <BlurFade inView>
                <h1 className="text-3xl font-bold mb-1">기록 목록</h1>
                <p className="text-muted-foreground text-sm mb-6">일상과 배움을 기록하는 공간입니다.</p>
              </BlurFade>

              {/* 검색 */}
              <BlurFade delay={0.1} inView>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="글 검색..."
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-ring transition"
                />
              </BlurFade>

              {/* 태그 필터 */}
              {allTags.length > 0 && (
                <BlurFade delay={0.15} inView>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <TagBadge tag="전체" active={activeTag === null} onClick={() => setActiveTag(null)} />
                    {allTags.map(tag => (
                      <TagBadge key={tag} tag={tag} active={activeTag === tag} onClick={() => setActiveTag(tag)} />
                    ))}
                  </div>
                </BlurFade>
              )}

                      {/* 포스트 목록 — 3×3 앨범 그리드 (항상 9칸) */}
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => {
                  const post = filtered[i]
                  if (post) {
                    return (
                      <PostCard
                        key={post.id}
                        post={post}
                        index={i}
                        onClick={() => { setSelectedId(post.id); setView('post') }}
                      />
                    )
                  }
                  return (
                    <BlurFade key={`empty-${i}`} delay={0.05 + i * 0.06} inView>
                      <button
                        onClick={() => { setForm({ title: '', tags: '', body: '' }); setView('editor') }}
                        className="group w-full rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900 hover:-translate-y-1 transition-transform duration-300"
                        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
                      >
                        <SprocketRow />
                        <div className="aspect-[2/3] flex flex-col items-center justify-center gap-2 border-y border-neutral-800 bg-neutral-950">
                          <span className="text-3xl text-neutral-600 group-hover:text-neutral-400 transition-colors">+</span>
                          <span className="text-[10px] tracking-widest text-neutral-600 group-hover:text-neutral-400 uppercase transition-colors">New Post</span>
                        </div>
                        <SprocketRow />
                      </button>
                    </BlurFade>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─── 글 읽기 뷰 ─── */}
        {view === 'post' && selectedPost && (
          <div>
            <button
              onClick={goList}
              className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
            >
              <span className="text-base leading-none">←</span>
              목록으로
            </button>
            <BlurFade inView>
              <article className="bg-card border border-border rounded-xl p-6 sm:p-8">
                <h1 className="text-2xl font-bold mb-2">{selectedPost.title}</h1>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span>{formatDate(selectedPost.date)}</span>
                  <span>⏱ 약 {getReadTime(selectedPost.body)}분</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {selectedPost.tags.map(t => (
                    <span key={t} className="bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full text-xs font-medium">{t}</span>
                  ))}
                </div>
                <div className="text-sm leading-relaxed">
                  {renderBody(selectedPost.body)}
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(selectedPost.id)}>
                    글 삭제
                  </Button>
                </div>
              </article>
            </BlurFade>
          </div>
        )}

        {/* ─── 에디터 뷰 ─── */}
        {view === 'editor' && (
          <BlurFade inView>
            <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
              <h2 className="text-xl font-bold mb-5">새 글쓰기</h2>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="제목을 입력하세요"
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
              <input
                type="text"
                value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder="태그 (쉼표로 구분, 예: 일상, 개발)"
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
              <Textarea
                value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                placeholder="내용을 입력하세요. '> '로 시작하면 인용문이 됩니다."
                className="min-h-[280px] mb-4 text-sm"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={goList}>취소</Button>
                <Button onClick={handleSave}>저장</Button>
              </div>
            </div>
          </BlurFade>
        )}

        {/* ─── 소개 뷰 ─── */}
        {view === 'about' && (
          <BlurFade inView>
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <div className="text-5xl mb-4">✍️</div>
              <h2 className="text-2xl font-bold mb-3">안녕하세요!</h2>
              <p className="text-muted-foreground mb-2">이 블로그는 일상, 배움, 생각을 기록하는 공간입니다.</p>
              <p className="text-muted-foreground mb-6">꾸준히 작성하며 성장해 나가겠습니다.</p>
              <hr className="border-border mb-6" />
              <p className="font-semibold text-left mb-3">사용 방법</p>
              <ul className="text-sm text-muted-foreground text-left space-y-2 mb-6">
                <li>• 상단의 <strong className="text-foreground">+ 새 글쓰기</strong> 버튼으로 글을 작성할 수 있습니다.</li>
                <li>• 태그를 클릭해 원하는 주제의 글을 필터링하세요.</li>
                <li>• 검색창에 키워드를 입력해 글을 찾아보세요.</li>
                <li>• 작성된 글은 브라우저에 자동 저장됩니다.</li>
              </ul>
              <Button onClick={goList}>홈으로 돌아가기</Button>
            </div>
          </BlurFade>
        )}

      </main>

      <footer className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} 나의 기록 블로그
      </footer>
    </div>
  )
}
