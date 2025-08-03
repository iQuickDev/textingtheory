export type Badge = {
  id: number; // order from worst (lowest) to best (highest)
  key: string;
  name: string;
  image: string;
};

import abandon from '../assets/badges/abandon.png';
import best from '../assets/badges/best.png';
import blunder from '../assets/badges/blunder.png';
import book from '../assets/badges/book.png';
import brilliant from '../assets/badges/brilliant.png';
import checkmated from '../assets/badges/checkmated.png';
import draw from '../assets/badges/draw.png';
import excellent from '../assets/badges/excellent.png';
import forced from '../assets/badges/forced.png';
import good from '../assets/badges/good.png';
import great from '../assets/badges/great.png';
import inaccuracy from '../assets/badges/inaccuracy.png';
import interesting from '../assets/badges/interesting.png';
import megablunder from '../assets/badges/megablunder.png';
import miss from '../assets/badges/miss.png';
import mistake from '../assets/badges/mistake.png';
import resign from '../assets/badges/resign.png';
import superbrilliant from '../assets/badges/superbrilliant.png';
import timeout from '../assets/badges/timeout.png';
import winner from '../assets/badges/winner.png';

export const badges: Badge[] = [
  // Bad badges
  { id: 1, key: 'megablunder', name: 'Mega Blunder', image: megablunder },
  { id: 2, key: 'blunder', name: 'Blunder', image: blunder },
  { id: 3, key: 'mistake', name: 'Mistake', image: mistake },
  { id: 4, key: 'miss', name: 'Miss', image: miss },
  { id: 5, key: 'inaccuracy', name: 'Inaccuracy', image: inaccuracy },
  { id: 6, key: 'draw', name: 'Draw', image: draw },

  // Good badges
  { id: 7, key: 'good', name: 'Good', image: good },
  { id: 8, key: 'great', name: 'Great', image: great },
  { id: 9, key: 'interesting', name: 'Interesting', image: interesting },
  { id: 10, key: 'forced', name: 'Forced', image: forced },
  { id: 11, key: 'excellent', name: 'Excellent', image: excellent },
  { id: 12, key: 'best', name: 'Best', image: best },
  { id: 13, key: 'brilliant', name: 'Brilliant', image: brilliant },
  { id: 14, key: 'superbrilliant', name: 'Super Brilliant', image: superbrilliant },
  { id: 15, key: 'winner', name: 'Winner', image: winner },

  // Technical badges
  { id: 16, key: 'book', name: 'Book', image: book },
  { id: 17, key: 'abandon', name: 'Abandon', image: abandon },
  { id: 18, key: 'timeout', name: 'Timeout', image: timeout },
  { id: 19, key: 'resign', name: 'Resign', image: resign },
  { id: 20, key: 'checkmated', name: 'Checkmated', image: checkmated },
];


export function getOrderedBadges(): Badge[] {
  return badges.slice().sort((a, b) => a.id - b.id);
}