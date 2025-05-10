// src/lib/actions.ts
'use server';
import { guessEventCategory, type GuessEventCategoryInput } from '@/ai/flows/guess-event-category';

export async function handleGuessCategory(query: string): Promise<string | null> {
  if (!query || !query.trim()) {
    return null;
  }
  try {
    const input: GuessEventCategoryInput = { query };
    const result = await guessEventCategory(input);
    return result.category;
  } catch (error) {
    console.error('Error guessing category:', error);
    // Optionally, re-throw a more user-friendly error or return a specific error indicator
    return 'Error determining category'; 
  }
}
