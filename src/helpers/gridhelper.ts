import { Vector2d } from "konva/lib/types";

export type VirtualPoint = { vx: number, vy: number };
export type RealPoint = Vector2d;

export const toFixedVirtualGrid = (point: RealPoint, pitch: number, upperLeft: VirtualPoint) => {
    return fix(toVirtualGrid(point, pitch, upperLeft));
}
export const toVirtualGrid = (point: RealPoint, pitch: number, upperLeft: VirtualPoint) => {
    return { vx: point.x / pitch + upperLeft.vx, vy: point.y / pitch + upperLeft.vy };
}

export const toRealGrid = (point: VirtualPoint, pitch: number, upperLeft: VirtualPoint) => {
    return { x: (point.vx - upperLeft.vx) * pitch, y: (point.vy - upperLeft.vy) * pitch };
}

export const add = (vp1: VirtualPoint, vp2: VirtualPoint) => {
    return { vx: vp1.vx + vp2.vx, vy: vp1.vy + vp2.vy };
}

export const sub = (vp1: VirtualPoint, vp2: VirtualPoint) => {
    return { vx: vp1.vx - vp2.vx, vy: vp1.vy - vp2.vy };
}
export const fix = (vp: VirtualPoint) => {
    return { vx: Math.round(vp.vx), vy: Math.round(vp.vy) };
}