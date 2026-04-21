# 🎨 FRONTEND PROMPT — Kahoot Clone
> **Stack:** Next.js 16 · TypeScript · shadcn/ui · Tailwind CSS · Socket.io Client

---

## ROLE

You are a senior frontend developer. Build a complete, production-ready web application for a realtime quiz platform similar to Kahoot using Next.js 14 (App Router), TypeScript, shadcn/ui, Tailwind CSS, and Socket.io Client.

> All text displayed to users in the UI must be in **Vietnamese**.  
> All code (components, hooks, functions, variables) must be in **English**.

---

## OBJECTIVE

Build the frontend for a realtime quiz system with two distinct user flows:

**HOST FLOW:**
```
Login → Dashboard (manage quizzes) → Create/Edit Quiz →
Create Room (get PIN + QR) → Waiting Room →
Control Game (next question, reveal answers) →
View Live Dashboard → End Game → View Full Results
```

**PLAYER FLOW:**
```
Landing → Join via PIN input or QR scan → Enter Nickname →
Waiting Room → Answer Questions → See Results per Question →
See Leaderboard → Final Results
```

---

## PROJECT STRUCTURE

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (host)/
│   │   ├── layout.tsx                    # Auth guard wrapper
│   │   ├── dashboard/
│   │   │   └── page.tsx                  # Quiz list
│   │   ├── quiz/
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── chinh-sua/
│   │   │       │   └── page.tsx
│   │   │       └── ket-qua/
│   │   │           └── page.tsx
│   │   └── phong/
│   │       └── [sessionId]/
│   │           ├── cho/
│   │           │   └── page.tsx          # Waiting room with QR
│   │           ├── game/
│   │           │   └── page.tsx          # Game control + live dashboard
│   │           └── end/
│   │               └── page.tsx
│   ├── join/
│   │   └── page.tsx                      # PIN input / QR scanner
│   ├── phong/
│   │   └── [pin]/
│   │       ├── cho/
│   │       │   └── page.tsx              # Player waiting
│   │       ├── game/
│   │       │   └── page.tsx              # Player gameplay
│   │       └── end/
│   │           └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx                          # Landing page
│   └── globals.css
├── components/
│   ├── ui/                               # shadcn/ui auto-generated
│   ├── host/
│   │   ├── QuizCard.tsx
│   │   ├── QuizEditor.tsx                # Main quiz metadata form
│   │   ├── QuestionList.tsx              # Sidebar with drag & drop
│   │   ├── QuestionEditor.tsx            # Right panel question form
│   │   ├── OptionEditor.tsx              # Individual option row
│   │   ├── WaitingRoomHost.tsx           # QR + PIN + player list
│   │   ├── GameController.tsx            # Buttons: next, reveal, leaderboard
│   │   ├── LiveDashboard.tsx             # Real-time bar chart
│   │   ├── AnswerBar.tsx                 # Single animated bar
│   │   └── LeaderboardTable.tsx
│   ├── player/
│   │   ├── JoinForm.tsx                  # PIN + nickname input
│   │   ├── QRScanner.tsx                 # Camera QR scanner
│   │   ├── WaitingRoomPlayer.tsx
│   │   ├── QuestionDisplay.tsx           # Question text + image
│   │   ├── AnswerButton.tsx              # Colored option button
│   │   ├── CountdownRing.tsx             # Circular SVG countdown
│   │   ├── AnswerFeedback.tsx            # Correct/wrong flash screen
│   │   └── PlayerLeaderboard.tsx
│   └── shared/
│       ├── Navbar.tsx
│       ├── AnimatedNumber.tsx
│       ├── ConfettiOverlay.tsx
│       ├── LoadingScreen.tsx
│       └── ErrorBoundary.tsx
├── hooks/
│   ├── useSocket.ts
│   ├── useHostGame.ts
│   ├── usePlayerGame.ts
│   └── useCountdown.ts
├── lib/
│   ├── api.ts                            # Axios instance + interceptors
│   ├── socket.ts                         # Socket.io singleton
│   └── utils.ts
├── stores/
│   ├── authStore.ts                      # Zustand
│   ├── gameStore.ts
│   └── playerStore.ts
├── types/
│   └── index.ts
└── middleware.ts                         # Next.js route protection
```

---

## DESIGN SYSTEM

### Color Palette
```
Background gradient : #2d0061 → #0d003b   (dark purple)

Answer options (consistent across host & player views):
  Option A : #e21b3c  (red)     icon: ▲ triangle
  Option B : #1368ce  (blue)    icon: ◆ diamond
  Option C : #d89e00  (yellow)  icon: ● circle
  Option D : #26890c  (green)   icon: ■ square

Accent  : #ff3355
Surface : rgba(255,255,255,0.08)   glassmorphism card bg
Border  : rgba(255,255,255,0.15)
```

### Typography
- Font family: **"Be Vietnam Pro"** (primary), fallback: Inter, sans-serif
- Load via `next/font/google`
- PIN display: `font-mono`, `text-6xl`, `letter-spacing: 0.3em`

### Animation Principles
- Use **framer-motion** for all transitions
- Page transitions: fade + slide up (300ms ease-out)
- Bar chart updates: spring animation on height
- Player join: slide-in from right
- Answer feedback: full-screen color flash (200ms) then fade
- Leaderboard entries: staggered list animation

---

## PAGE SPECIFICATIONS

### Landing Page (`/`)
- Full-screen gradient background with animated floating shapes (CSS keyframes)
- Logo + tagline: **"Học vui - Chơi thật - Cùng nhau!"**
- Two CTA buttons:
  - `"Tạo Quiz Ngay"` → `/dang-nhap` (or `/dashboard` if already logged in)
  - `"Tham Gia Ngay"` → `/tham-gia`
- Feature highlights section with 3 icon cards

---

### Auth Pages (`/dang-nhap`, `/dang-ky`)
- Centered glassmorphism card on gradient background
- `react-hook-form` + `zod` validation
- Realtime inline field errors displayed in Vietnamese
- Password strength indicator on register page
- Redirect to `/dashboard` on success

---

### Dashboard (`/dashboard`)
- Navbar with user info + logout button
- `"Tạo Quiz Mới"` button top-right
- Responsive grid of `QuizCard` (2 cols mobile, 3 cols desktop)
- **QuizCard** shows: thumbnail, title, question count, last updated date
- Card actions: `"Chỉnh sửa"` | `"Tạo Phòng"` | `"Xóa"` (with confirm dialog)
- Empty state illustration when no quizzes exist
- Skeleton loading on initial fetch

---

### Quiz Editor (`/quiz/[id]/chinh-sua`)

**Layout:** Two-panel split — sidebar 280px fixed + main panel fills rest

**Sidebar (`QuestionList`):**
- Quiz title (editable inline)
- Scrollable drag-and-drop question list (`@dnd-kit`)
- Each item: question number + first 30 chars of content
- `"Thêm câu hỏi"` button at bottom
- Active question highlighted with accent color

**Main Panel (`QuestionEditor`):**
- Question type selector: `Một đáp án` / `Nhiều đáp án` / `Đúng-Sai`
- Large textarea for question content
- Image upload button with inline preview
- Time limit selector: pill buttons `[5s, 10s, 20s, 30s, 60s, 90s, 120s]`
- Points selector: `[1000, 2000]`
- 4 option rows (2×2 grid), each with:
  - Colored left border
  - Shape icon
  - Text input
  - Correct answer checkbox
- For `true_false` type: show only 2 options (`"Đúng"` / `"Sai"`)

**Floating save button** (bottom-right, shadcn Button + save icon)

---

### Waiting Room — Host (`/phong/[sessionId]/cho`)

**Two-column layout:**

| Left | Right |
|------|-------|
| Large QR code (256px centered) | `"Người chơi đã tham gia (X)"` header |
| PIN display: massive mono font, spaced digits e.g. `"123 456"` | Scrollable grid of player chips |
| Join URL displayed below | Each chip: random avatar color + nickname |
| `"Chia sẻ"` button to copy link | New players slide in via framer-motion |

**Bottom:** `"Bắt Đầu Game"` button — disabled if 0 players, active otherwise

---

### Game Control — Host (`/phong/[sessionId]/game`)

**Top bar:**
- Current question label: `"Câu X / Y"`
- Question content (large text, white)
- Optional question image
- Countdown timer (large number)

**Main area (`LiveDashboard`):**
- 4 answer bars side by side, each containing:
  - Colored background matching option color
  - Shape icon at top
  - Option text
  - **Animated bar height** (spring animation from 0% → actual %)
  - Count + percentage below bar
- `"X / Y người đã trả lời"` progress indicator
- Progress bar showing overall answer completion

**Bottom controls (state-dependent):**

| Game State | Button shown |
|---|---|
| `'question'` | `"Xem Đáp Án"` |
| `'answer_reveal'` | `"Bảng Xếp Hạng"` |
| `'leaderboard'` | `"Câu Tiếp Theo"` or `"Kết Thúc"` |

**Answer reveal state:**
- Correct option bars: bright border + checkmark overlay
- Wrong option bars: desaturated / grayed out
- Correct option text turns green

**Leaderboard panel:** slides in from right with staggered entry animation
- Top 5 rankings: rank, nickname, score, delta `(▲ +X điểm)`

---

### Player Join (`/tham-gia`)
- **Tab 1 — Nhập Mã PIN:**
  - 6-digit input with auto-space formatting (`XXX XXX`)
  - Large numeric input optimized for mobile
  - `"Tiếp Tục"` button
- **Tab 2 — Quét Mã QR:**
  - Camera preview via `html5-qrcode`
  - Permission request UI
  - On success → auto redirect with PIN
- After valid PIN: slide transition to nickname form
  - Input: `"Tên hiển thị của bạn"`
  - `"Vào Phòng"` button

---

### Player Waiting Room (`/phong/[pin]/cho`)
- Centered layout, gradient background
- `"Bạn đã vào phòng!"` confirmation message
- Nickname displayed prominently
- Pulsing dots waiting animation
- `"Đang chờ host bắt đầu..."` text

---

### Player Game (`/phong/[pin]/game`)

**Question phase:**
- Question text (large, centered, white)
- Optional question image
- **`CountdownRing`** — circular SVG progress ring:
  - `> 50%` remaining → green
  - `20–50%` remaining → yellow
  - `< 20%` remaining → red (pulsing)
  - Time remaining number centered inside ring
- **4 `AnswerButton`s** (2×2 grid, full width):
  - Colored background + shape icon + option text
  - On tap: immediate optimistic lock (no wait for server)
  - After submit: all buttons disabled, selected shows spinner then `✓`

**Answer feedback phase:**
- Full-screen color flash: green (correct) or red (incorrect) — 400ms
- Result card:
  - `"Chính xác! 🎉"` or `"Sai rồi 😔"`
  - `"+X điểm"` with animated number counter
  - `"🔥 x3 streak!"` badge if applicable
  - Correct answer shown if player answered wrong

**Leaderboard phase:**
- Player's own rank (highlighted card): `"Bạn đang ở hạng #X"`
- Top 5 leaderboard list

---

### Final Results

**Player view** (`/phong/[pin]/ket-thuc`)**:**
- Confetti overlay for top 3 players (`react-confetti`)
- Podium: 2nd (left), 1st (center elevated), 3rd (right)
- Each podium position: avatar circle, nickname, score
- Full leaderboard table below
- Buttons: `"Chơi Lại"` + `"Về Trang Chủ"`

**Host view** (`/phong/[sessionId]/ket-thuc`)**:**
- Same podium + leaderboard layout
- Additional buttons: `"Tải Kết Quả"` + `"Về Dashboard"`

---

## HOOKS SPECIFICATION

### `useSocket.ts`
```typescript
// Creates and manages a singleton Socket.io connection
// Accepts optional JWT token for host authentication
// Handles reconnection with exponential backoff
// Returns: { socket, isConnected, connectionError }
// Cleans up on unmount
```

### `useHostGame.ts`
```typescript
// Manages all host-side socket events for a game session
//
// Emits:
//   host:join_room, host:start_game, host:next_question,
//   host:reveal_answer, host:show_leaderboard, host:end_game
//
// Listens:
//   room:player_joined, room:player_left,
//   question:show, question:time_tick, question:time_up,
//   dashboard:update, answer:reveal, leaderboard:show, game:ended
//
// Returns: {
//   players, gameStatus, currentQuestion, timeLeft,
//   answerStats, leaderboard, totalAnswered,
//   startGame, nextQuestion, revealAnswer, showLeaderboard, endGame
// }
```

### `usePlayerGame.ts`
```typescript
// Manages all player-side socket events
//
// Emits:
//   player:join_room, player:submit_answer
//
// Listens:
//   room:player_joined, room:error, room:kicked,
//   game:started, question:show, question:time_tick,
//   question:time_up, answer:received, answer:reveal,
//   leaderboard:show, game:ended
//
// Returns: {
//   gameStatus, currentQuestion, timeLeft, hasAnswered,
//   lastAnswerResult, myScore, myRank, leaderboard,
//   joinRoom, submitAnswer
// }
```

### `useCountdown.ts`
```typescript
// Accepts: initialTime (seconds), isRunning (boolean)
// Returns: { timeLeft, percentLeft, colorClass }
// colorClass values: 'text-green-400' | 'text-yellow-400' | 'text-red-400'
```

---

## ZUSTAND STORES

### `authStore.ts`
```typescript
interface AuthStore {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  hydrate: () => Promise<void>    // call on app load to restore session
}
```

### `gameStore.ts` _(Host)_
```typescript
interface GameStore {
  session: Session | null
  players: Player[]
  currentQuestion: Question | null
  answerStats: OptionStat[]
  totalAnswered: number
  leaderboard: Ranking[]
  gameStatus: GameStatus
  // setters
  setSession: (s: Session) => void
  setPlayers: (p: Player[]) => void
  updateAnswerStats: (stats: OptionStat[], total: number) => void
  setCurrentQuestion: (q: Question) => void
  setLeaderboard: (r: Ranking[]) => void
  setGameStatus: (s: GameStatus) => void
  reset: () => void
}
```

### `playerStore.ts`
```typescript
interface PlayerStore {
  pin: string
  nickname: string
  score: number
  rank: number
  streak: number
  hasAnswered: boolean
  lastAnswerResult: {
    isCorrect: boolean
    pointsEarned: number
    streak: number
  } | null
  setPin: (pin: string) => void
  setNickname: (name: string) => void
  updateScore: (score: number, rank: number) => void
  setLastResult: (result: AnswerResult) => void
  setHasAnswered: (v: boolean) => void
  reset: () => void
}
```

---

## TYPE DEFINITIONS (`types/index.ts`)

```typescript
export type GameStatus =
  | 'idle'
  | 'waiting'
  | 'starting'
  | 'question'
  | 'answer_reveal'
  | 'leaderboard'
  | 'ended'

export interface User {
  _id: string
  name: string
  email: string
  role: string
}

export interface Quiz {
  _id: string
  title: string
  description: string
  thumbnail?: string
  questions: Question[]
  createdAt: string
}

export interface Question {
  _id: string
  content: string
  type: 'single' | 'multiple' | 'true_false'
  options: Option[]
  timeLimit: number
  points: number
  imageUrl?: string
  order: number
}

export interface Option {
  id: string
  text: string
  isCorrect?: boolean         // only present in host/editor views
  color: string
}

export interface Player {
  socketId: string
  nickname: string
  score: number
  streak: number
}

export interface OptionStat {
  optionId: string
  text: string
  count: number
  percentage: number
  color: string
}

export interface Ranking {
  rank: number
  nickname: string
  score: number
  delta?: number
}

export interface Session {
  _id: string
  pin: string
  qrCode: string
  status: GameStatus
  quizId: string
}
```

---

## TECHNICAL REQUIREMENTS

### 1. App Router Only
- No Pages Router. All routes use the `app/` directory
- Use `loading.tsx` and `error.tsx` per route segment where appropriate

### 2. Server vs Client Components
| Type | Use for |
|---|---|
| **Server Components** | layout files, static pages (landing, auth, dashboard list) |
| **Client Components** (`'use client'`) | anything with socket, state, animations, interactive forms |

### 3. Route Protection (`middleware.ts`)
- Protect all `/dashboard`, `/quiz/*`, `/phong/[sessionId]/*` routes
- Redirect to `/dang-nhap` if no valid token in cookie
- Allow public: `/`, `/dang-nhap`, `/dang-ky`, `/tham-gia`, `/phong/[pin]/*`

### 4. API Layer (`lib/api.ts`)
- Axios instance with `baseURL` from `NEXT_PUBLIC_API_URL`
- Request interceptor: attach `Authorization` header from `authStore`
- Response interceptor: auto refresh token on 401, retry original request once
- On refresh failure: redirect to `/dang-nhap`

### 5. Socket Singleton (`lib/socket.ts`)
- Single socket instance for entire app lifecycle
- Connect with `auth: { token }` in handshake for host connections
- Export `connect(token?)`, `disconnect`, `getSocket` functions

### 6. Mobile-first Responsive
- Player game pages: optimized for 375px+ mobile screens
- Host game pages: optimized for 1024px+ (tablet / desktop)
- Answer buttons: `min-height: 80px`, large touch targets

### 7. Optimistic UI
- Player answer: lock all buttons **immediately** on tap before server response

### 8. Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 9. Error Handling
- `ErrorBoundary` wrapper on all socket pages
- Toast notifications (shadcn **Sonner**) for errors and success actions
- Network disconnection → show reconnecting banner

### 10. Loading States
- Skeleton on quiz list and quiz editor
- Spinner on all form submit buttons
- Full-screen loading overlay between game phase transitions

---

## DEPENDENCIES

```json
{
  "dependencies": {
    "next": "14",
    "react": "^18",
    "typescript": "^5",
    "tailwindcss": "^3",
    "socket.io-client": "^4.7",
    "zustand": "^4",
    "axios": "^1.6",
    "react-hook-form": "^7",
    "@hookform/resolvers": "^3",
    "zod": "^3",
    "framer-motion": "^11",
    "html5-qrcode": "^2.3",
    "qrcode.react": "^3",
    "recharts": "^2",
    "@dnd-kit/core": "^6",
    "@dnd-kit/sortable": "^8",
    "react-confetti": "^6",
    "sonner": "^1",
    "lucide-react": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest"
  }
}
```

**shadcn/ui components to install:**
```
button, card, input, textarea, dialog, badge, tabs, progress,
skeleton, toast, sonner, separator, avatar, tooltip, select,
switch, checkbox, label, scroll-area
```

---

## CODING RULES

- Write **complete, production-ready** code for every file — never skip with placeholder comments
- Every component must handle: **loading state**, **error state**, **empty state**
- All user-visible strings (labels, buttons, messages, errors, placeholders) in **Vietnamese**
- All code identifiers (variables, functions, components, hooks) in **English**
- Use TypeScript strictly — **no `any` types**
- Prefer **named exports** for components
- Co-locate types with their usage when only used in one file
- Use `cn()` utility from `lib/utils.ts` for conditional `className` merging
- Comments explaining complex logic in **Vietnamese**
