import { VirtualPoint } from "../helpers/gridhelper";
import Cell from "./Cell";

export type ComponentState = {
    type: string;
    point: VirtualPoint;
    key: string;
}

export const createComponent = (c: ComponentState, pitch: number, upperLeft: VirtualPoint, key: string) => {
    switch (c.type) {
        case "cell":
            return <Cell key={key} upperLeft={upperLeft} point={c.point} pitch={pitch}></Cell>
    }
}