import type { Point } from '@/types/Point';

export interface PointStore {
  points: Point[];
  addPoint: () => void;
  updatePoint: (index: number, newPoint: Point) => void;
  removePoint: (index: number) => void;
}
