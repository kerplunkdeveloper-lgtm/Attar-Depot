'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { openAuthModal } from '@/store/uiSlice';

export default function GlobalAuthTimer() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If user is already logged in, no need for the timer
    if (isAuthenticated) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    // Check if we already prompted the user in this session
    const hasPrompted = sessionStorage.getItem('has_auth_prompted');
    if (hasPrompted) return;

    // Set 2 minute timer (120000ms)
    timerRef.current = setTimeout(() => {
      dispatch(openAuthModal('login'));
      sessionStorage.setItem('has_auth_prompted', 'true');
    }, 120000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAuthenticated, dispatch]);

  return null;
}
