'use client';

import { useEffect, useRef } from 'react';

import { useGameStore } from '@/stores/gameStore';
import { useSocket } from '@/hooks/useSocket';
import { GameStatus, OptionStat, Player, Question, Ranking } from '@/types';

interface UseHostGameResult {
  players: Player[];
  gameStatus: GameStatus;
  currentQuestion: Question | null;
  timeLeft: number;
  answerStats: OptionStat[];
  leaderboard: Ranking[];
  totalAnswered: number;
  startGame: () => void;
  nextQuestion: () => void;
  revealAnswer: () => void;
  showLeaderboard: () => void;
  endGame: () => void;
}

export function useHostGame(sessionId: string): UseHostGameResult {
  const token =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('accessToken')
      : null;
  const { socket } = useSocket(token || undefined);
  const {
    players,
    gameStatus,
    currentQuestion,
    answerStats,
    leaderboard,
    totalAnswered,
    setPlayers,
    setCurrentQuestion,
    setGameStatus,
    updateAnswerStats,
    setLeaderboard,
    reset,
  } = useGameStore();

  // Guard: only join room once per socket connection
  const joinedRef = useRef(false);

  // Reset store when switching to a different session
  useEffect(() => {
    if (!sessionId) {
      return;
    }
    reset();
    joinedRef.current = false;
  }, [sessionId, reset]);

  // Join room effect — only runs when socket or sessionId changes
  useEffect(() => {
    if (!socket || !sessionId) return;
    joinedRef.current = false;
  }, [socket, sessionId]);

  useEffect(() => {
    if (!socket || !sessionId) return;
    if (!joinedRef.current) {
      joinedRef.current = true;
      const authToken = window.localStorage.getItem('accessToken') || '';
      socket.emit('host:join_room', { sessionId, token: authToken });
    }

    socket.on(
      'room:player_joined',
      ({ players: nextPlayers }: { players: Player[] }) =>
        setPlayers(nextPlayers),
    );
    socket.on(
      'room:player_left',
      ({ players: nextPlayers }: { players: Player[] }) =>
        setPlayers(nextPlayers),
    );
    socket.on('game:started', () => setGameStatus('starting'));
    socket.on('question:show', (question: Question) => {
      setCurrentQuestion(question); // also resets answerStats + totalAnswered in store
      setGameStatus('question');
    });
    socket.on(
      'dashboard:update',
      (payload: { optionStats: OptionStat[]; totalAnswered: number }) => {
        updateAnswerStats(payload.optionStats, payload.totalAnswered);
      },
    );
    socket.on('answer:reveal', (payload: { stats: OptionStat[] }) => {
      // Read current totalAnswered directly from store to avoid stale closure
      const currentTotal = useGameStore.getState().totalAnswered;
      updateAnswerStats(payload.stats, currentTotal);
      setGameStatus('answer_reveal');
    });
    socket.on('leaderboard:show', ({ rankings }: { rankings: Ranking[] }) => {
      setLeaderboard(rankings);
      setGameStatus('leaderboard');
    });
    socket.on('game:ended', () => setGameStatus('ended'));

    return () => {
      socket.off('room:player_joined');
      socket.off('room:player_left');
      socket.off('game:started');
      socket.off('question:show');
      socket.off('dashboard:update');
      socket.off('answer:reveal');
      socket.off('leaderboard:show');
      socket.off('game:ended');
    };
  }, [
    socket,
    sessionId,
    setPlayers,
    setCurrentQuestion,
    setGameStatus,
    updateAnswerStats,
    setLeaderboard,
  ]);

  return {
    players,
    gameStatus,
    currentQuestion,
    timeLeft: currentQuestion?.timeLimit ?? 0,
    answerStats,
    leaderboard,
    totalAnswered,
    startGame: () => socket?.emit('host:start_game', { sessionId }),
    nextQuestion: () => socket?.emit('host:next_question', { sessionId }),
    revealAnswer: () => socket?.emit('host:reveal_answer', { sessionId }),
    showLeaderboard: () => socket?.emit('host:show_leaderboard', { sessionId }),
    endGame: () => socket?.emit('host:end_game', { sessionId }),
  };
}
