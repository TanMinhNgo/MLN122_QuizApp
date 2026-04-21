// Enum tất cả sự kiện Socket.io

// CLIENT → SERVER (Host)
export enum HostEvent {
  JOIN_ROOM = 'host:join_room',
  KICK_PLAYER = 'host:kick_player',
  START_GAME = 'host:start_game',
  NEXT_QUESTION = 'host:next_question',
  REVEAL_ANSWER = 'host:reveal_answer',
  SHOW_LEADERBOARD = 'host:show_leaderboard',
  END_GAME = 'host:end_game',
}

// CLIENT → SERVER (Player)
export enum PlayerEvent {
  JOIN_ROOM = 'player:join_room',
  SUBMIT_ANSWER = 'player:submit_answer',
}

// SERVER → CLIENT (Room)
export enum RoomEvent {
  PLAYER_JOINED = 'room:player_joined',
  PLAYER_LEFT = 'room:player_left',
  ERROR = 'room:error',
  KICKED = 'room:kicked',
}

// SERVER → CLIENT (Game flow)
export enum GameEvent {
  STARTED = 'game:started',
  ENDED = 'game:ended',
}

// SERVER → CLIENT (Question)
export enum QuestionEvent {
  SHOW = 'question:show',
  TIME_TICK = 'question:time_tick',
  TIME_UP = 'question:time_up',
}

// SERVER → CLIENT (Answer)
export enum AnswerEvent {
  RECEIVED = 'answer:received',
  REVEAL = 'answer:reveal',
}

// SERVER → CLIENT (Leaderboard)
export enum LeaderboardEvent {
  SHOW = 'leaderboard:show',
}

// SERVER → HOST (Dashboard)
export enum DashboardEvent {
  UPDATE = 'dashboard:update',
}
