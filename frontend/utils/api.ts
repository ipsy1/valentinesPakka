import { UserProgress } from '../types';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const api = {
  async getProgress(): Promise<UserProgress> {
    const response = await fetch(`${BACKEND_URL}/api/progress`);
    if (!response.ok) {
      throw new Error('Failed to fetch progress');
    }
    return response.json();
  },

  async completeDay(dayNumber: number): Promise<UserProgress> {
    const response = await fetch(`${BACKEND_URL}/api/progress/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ day_number: dayNumber }),
    });
    if (!response.ok) {
      throw new Error('Failed to complete day');
    }
    return response.json();
  },

  async resetProgress(): Promise<void> {
    const response = await fetch(`${BACKEND_URL}/api/progress/reset`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to reset progress');
    }
  },
};
