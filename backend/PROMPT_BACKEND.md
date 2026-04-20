# 🖥️ BACKEND PROMPT — Kahoot Clone
> **Stack:** Node.js · TypeScript · MVC · MongoDB · Socket.io

---

## ROLE

You are a senior backend developer. Build a complete REST API + WebSocket server for a realtime quiz application similar to Kahoot using Node.js TypeScript, MVC architecture, MongoDB, and Socket.io.

---

## OBJECTIVE

Build a backend system for a realtime quiz platform that allows:
- Hosts to create and manage quiz sets
- Players to join rooms via 6-digit PIN or QR Code scan
- Realtime synchronization: question broadcast, countdown timer, answer collection, live dashboard stats, leaderboard updates

> All UI-facing text/messages returned from the API and socket events must be in **Vietnamese**.  
> Internal code (variables, functions, classes) must be in **English**.

---

## PROJECT STRUCTURE

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # MongoDB connection
│   │   └── env.ts               # Environment variables
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── quiz.controller.ts
│   │   ├── session.controller.ts
│   │   └── player.controller.ts
│   ├── models/
│   │   ├── User.model.ts
│   │   ├── Quiz.model.ts
│   │   ├── Question.model.ts
│   │   ├── Session.model.ts
│   │   └── PlayerAnswer.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── quiz.routes.ts
│   │   └── session.routes.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── quiz.service.ts
│   │   ├── session.service.ts
│   │   └── qr.service.ts
│   ├── socket/
│   │   ├── index.ts             # Socket.io initialization
│   │   ├── handlers/
│   │   │   ├── host.handler.ts
│   │   │   └── player.handler.ts
│   │   └── events.ts            # Enum of all socket events
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   ├── utils/
│   │   ├── pinGenerator.ts      # Generate unique 6-digit PIN
│   │   ├── qrGenerator.ts       # Generate QR code as base64
│   │   └── response.ts          # Standardized API response format
│   ├── types/
│   │   └── index.d.ts
│   └── app.ts
├── .env.example
├── tsconfig.json
└── package.json
```

---

## MONGODB SCHEMAS

### User
```typescript
{
  _id: ObjectId,
  email: string,                    // unique
  password: string,                 // bcrypt hashed
  name: string,
  role: 'host' | 'admin',
  createdAt: Date,
  updatedAt: Date
}
```

### Quiz
```typescript
{
  _id: ObjectId,
  hostId: ObjectId,                 // ref: User
  title: string,
  description: string,
  thumbnail?: string,
  questions: ObjectId[],            // ref: Question
  isPublic: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Question
```typescript
{
  _id: ObjectId,
  quizId: ObjectId,
  content: string,
  type: 'single' | 'multiple' | 'true_false',
  options: [
    {
      id: string,                   // 'A' | 'B' | 'C' | 'D'
      text: string,
      isCorrect: boolean,
      color: string                 // hex color per option
    }
  ],
  timeLimit: number,                // 5 | 10 | 20 | 30 | 60 | 90 | 120
  points: number,                   // 1000 | 2000
  imageUrl?: string,
  order: number
}
```

### Session
```typescript
{
  _id: ObjectId,
  quizId: ObjectId,
  hostId: ObjectId,
  pin: string,                      // 6-digit unique
  qrCode: string,                   // base64 PNG
  status: 'waiting' | 'active' | 'question' | 'answer_reveal' | 'leaderboard' | 'ended',
  currentQuestionIndex: number,
  players: [
    {
      socketId: string,
      nickname: string,
      score: number,
      streak: number,
      joinedAt: Date
    }
  ],
  startedAt?: Date,
  endedAt?: Date
}
```

### PlayerAnswer
```typescript
{
  _id: ObjectId,
  sessionId: ObjectId,
  questionId: ObjectId,
  playerSocketId: string,
  nickname: string,
  selectedOptions: string[],        // option ids e.g. ['A', 'C']
  isCorrect: boolean,
  responseTime: number,             // milliseconds
  pointsEarned: number,
  answeredAt: Date
}
```

---

## REST API ENDPOINTS

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | `{ name, email, password }` |
| POST | `/api/auth/login` | `{ email, password }` |
| POST | `/api/auth/logout` | Clear refresh token cookie |
| GET | `/api/auth/me` | Get current user (protected) |
| POST | `/api/auth/refresh` | Refresh access token |

### Quiz _(all protected, host only)_
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quizzes` | Paginated list of host's quizzes |
| POST | `/api/quizzes` | Create new quiz |
| GET | `/api/quizzes/:id` | Get quiz with populated questions |
| PUT | `/api/quizzes/:id` | Update quiz metadata |
| DELETE | `/api/quizzes/:id` | Soft delete quiz |
| POST | `/api/quizzes/:id/questions` | Add a question |
| PUT | `/api/quizzes/:id/questions/:qId` | Update a question |
| DELETE | `/api/quizzes/:id/questions/:qId` | Delete a question |
| PUT | `/api/quizzes/:id/questions/reorder` | `{ orderedIds: string[] }` |

### Session
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions` | Host creates room → returns `{ pin, qrCode, sessionId }` |
| GET | `/api/sessions/:pin` | Get session info by PIN (public) |
| GET | `/api/sessions/:id/results` | Full results after game (host only) |

---

## SOCKET.IO EVENTS

### Connection & Lobby

```
CLIENT → SERVER:
  host:join_room        { sessionId, token }     // host authenticates via JWT
  player:join_room      { pin, nickname }
  host:kick_player      { sessionId, socketId }

SERVER → CLIENT:
  room:player_joined    { players: Player[] }
  room:player_left      { players: Player[] }
  room:error            { message: string }       // message in Vietnamese
  room:kicked           {}                        // sent to kicked player
```

### Game Flow _(host-controlled)_

```
CLIENT → SERVER:
  host:start_game         { sessionId }
  host:next_question      { sessionId }
  host:reveal_answer      { sessionId }
  host:show_leaderboard   { sessionId }
  host:end_game           { sessionId }

SERVER → CLIENT:
  game:started            {}
  question:show           {
                            index: number,
                            total: number,
                            content: string,
                            type: string,
                            options: { id, text, color }[],   // NO isCorrect field
                            timeLimit: number,
                            points: number,
                            imageUrl?: string
                          }
  question:time_tick      { timeLeft: number }
  question:time_up        {}
  answer:reveal           {
                            correctOptions: string[],
                            stats: { optionId, count, percentage }[]
                          }
  leaderboard:show        { rankings: { rank, nickname, score, delta }[] }
  game:ended              { finalRankings: { rank, nickname, score }[] }
```

### Player Answer

```
CLIENT → SERVER:
  player:submit_answer    {
                            sessionId: string,
                            questionId: string,
                            selectedOptions: string[],
                            responseTime: number            // ms
                          }

SERVER → PLAYER:
  answer:received         { pointsEarned: number, isCorrect: boolean, streak: number }
```

### Host Dashboard _(real-time answer tracking)_

```
SERVER → HOST ONLY (emit to host socket directly):
  dashboard:update        {
                            questionId: string,
                            totalAnswered: number,
                            totalPlayers: number,
                            optionStats: [
                              { optionId, text, count, percentage, color }
                            ]
                          }
```

---

## TECHNICAL REQUIREMENTS

### 1. Authentication
- JWT: access token **(15 min)** + refresh token **(7 days)**
- Store refresh token in **httpOnly cookie**
- Socket auth: validate JWT token from handshake `auth` header for host connections

### 2. Validation
- Use **Zod** schemas for all request bodies
- Custom Zod error formatter returning **Vietnamese** messages

### 3. Error Handling
- Global error middleware
- Custom `AppError` class with `statusCode` and `isOperational` flag
- All user-facing error messages must be in Vietnamese

### 4. PIN Generation
- Generate unique 6-digit numeric PIN
- Check uniqueness against currently **active** sessions in DB

### 5. QR Code
- Use `qrcode` npm package, return base64 PNG
- QR content: `${FRONTEND_URL}/tham-gia?pin=XXXXXX`

### 6. Scoring Algorithm
```
basePoints  = question.points  (1000 or 2000)
timeFactor  = (timeLimit - responseTime / 1000) / timeLimit
streakBonus = streak >= 3 ? 1.2 : 1.0
pointsEarned = Math.round(basePoints * timeFactor * streakBonus)
```

### 7. Socket Rooms
- Host joins room: `host:{sessionId}`
- Players join room: `game:{pin}`
- Dashboard updates emitted **only** to host socket id

### 8. Server-side Timer
- Use `setInterval` to broadcast `question:time_tick` every second
- Auto-trigger `question:time_up` when countdown reaches 0
- Store interval reference in in-memory `Map` keyed by `sessionId`

### 9. Session State Management
- Use in-memory `Map<sessionId, SessionState>` for fast access during game
- Persist final state to MongoDB at game end

### 10. CORS
- Allow origin from `FRONTEND_URL` env variable
- `credentials: true`

---

## SCORING & STREAK RULES

- Streak increments on consecutive correct answers
- Streak resets to `0` on any wrong or missed answer
- Streak bonus: >= 3 correct in a row → multiply score by **1.2×**
- Player who doesn't answer within `timeLimit` gets **0 points** (no penalty)

---

## DEPENDENCIES

```json
{
  "dependencies": {
    "express": "^4.18",
    "mongoose": "^8",
    "socket.io": "^4.7",
    "jsonwebtoken": "^9",
    "bcryptjs": "^2.4",
    "zod": "^3",
    "qrcode": "^1.5",
    "dotenv": "^16",
    "cors": "^2.8",
    "helmet": "^7",
    "morgan": "^1.10",
    "cookie-parser": "^1.4"
  },
  "devDependencies": {
    "typescript": "^5",
    "ts-node-dev": "^2",
    "@types/express": "*",
    "@types/jsonwebtoken": "*",
    "@types/bcryptjs": "*",
    "@types/morgan": "*",
    "@types/cookie-parser": "*",
    "@types/qrcode": "*",
    "@types/node": "*"
  }
}
```

---

## CODING RULES

- Write **complete, production-ready** code — never use `// TODO` or `// implement later`
- Every file must have full imports and exports
- Variable and function names in **English**
- Comments explaining complex logic in **Vietnamese**
- All user-facing strings (API responses, socket messages, error messages) in **Vietnamese**
- Use `async/await` throughout, no raw callbacks
- Separate business logic into **services**, keep controllers thin
- Use TypeScript strictly — **no `any` types**
