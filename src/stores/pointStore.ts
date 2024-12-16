import type { Point } from '@/types/Point';

export interface PointStore {
  points: Point[];
  selectedPointId: number;
  addPoint: () => void;
  updatePoint: (index: number, newPoint: Point) => void;
  updatePointX: (id: number, newX: number) => void;
  removePoint: (index: number) => void;
  selectPoint: (id: number) => void;
  findPoint: (id: number) => void;
}
