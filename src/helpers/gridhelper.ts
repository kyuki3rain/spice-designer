import { Vector2d } from 'konva/lib/types';

export type VirtualPoint = { vx: number; vy: number };
export type RealPoint = Vector2d;

export const add = (vp1: VirtualPoint, vp2: VirtualPoint) => ({ vx: vp1.vx + vp2.vx, vy: vp1.vy + vp2.vy });

export const sub = (vp1: VirtualPoint, vp2: VirtualPoint) => ({ vx: vp1.vx - vp2.vx, vy: vp1.vy - vp2.vy });
export const fix = (vp: VirtualPoint) => ({ vx: Math.round(vp.vx), vy: Math.round(vp.vy) });

export const toVirtualGrid = (point: RealPoint, pitch: number, upperLeft: VirtualPoint) => ({
  vx: point.x / pitch + upperLeft.vx,
  vy: point.y / pitch + upperLeft.vy,
});

export const toRealGrid = (point: VirtualPoint, pitch: number, upperLeft: VirtualPoint) => ({
  x: (point.vx - upperLeft.vx) * pitch,
  y: (point.vy - upperLeft.vy) * pitch,
});

export const toFixedVirtualGrid = (point: RealPoint, pitch: number, upperLeft: VirtualPoint) =>
  fix(toVirtualGrid(point, pitch, upperLeft));
