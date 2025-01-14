// Copyright 2022-2023 the Chili authors. All rights reserved. AGPL-3.0 license.

import { XYZ } from "../math";
import { CurveType } from "./shape";

export interface ICurve {
    get curveType(): CurveType;
    firstParameter(): number;
    lastParameter(): number;
    point(parameter: number): XYZ;
    trim(start: number, end: number): void;
    project(point: XYZ): XYZ[];
}

export interface ILine extends ICurve {
    start: XYZ;
    direction: XYZ;
    location: XYZ;
}

export interface ICircle extends ICurve {
    center: XYZ;
    radius: number;
}

export namespace ICurve {
    export function isCircle(curve: ICurve): curve is ICircle {
        let circle = curve as ICircle;
        return circle.center !== undefined && circle.radius !== undefined;
    }

    export function isLine(curve: ICurve): curve is ILine {
        let line = curve as ILine;
        return line.direction !== undefined;
    }
}
