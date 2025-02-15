// Copyright 2022-2023 the Chili authors. All rights reserved. AGPL-3.0 license.

import { AsyncController, Config, I18nKeys, IDocument, IView, XYZ } from "chili-core";
import { Dimension } from "../dimension";
import { ObjectSnap } from "../objectSnap";
import { PlaneSnap, WorkplaneSnap } from "../planeSnap";
import { TrackingSnap } from "../tracking";
import { SnapEventHandler } from "./snapEventHandler";
import { SnapPointData } from "./snapPointData";

export class SnapPointEventHandler extends SnapEventHandler {
    constructor(
        document: IDocument,
        controller: AsyncController,
        protected pointData: SnapPointData,
    ) {
        let objectSnap = new ObjectSnap(Config.instance.snapType, pointData.refPoint);
        let workplaneSnap = pointData.plane
            ? new PlaneSnap(pointData.plane, pointData.refPoint)
            : new WorkplaneSnap(pointData.refPoint);
        let trackingSnap = new TrackingSnap(pointData.refPoint, true);
        let snaps = [objectSnap, trackingSnap, workplaneSnap];
        super(document, controller, snaps, pointData);
    }

    protected getPointFromInput(view: IView, text: string): XYZ {
        let dims = text.split(",").map((x) => Number(x));
        let refPoint = this.getRefPoint();
        let result = refPoint ?? XYZ.zero;
        let end = this._snaped!.point!;
        if (dims.length === 1 && end !== undefined) {
            let vector = end.sub(refPoint!).normalize()!;
            result = result.add(vector.multiply(dims[0]));
        } else if (dims.length > 1) {
            let plane = this.pointData.plane?.() ?? view.workplane;
            result = result.add(plane.xvec.multiply(dims[0])).add(plane.yvec.multiply(dims[1]));
            if (dims.length === 3) {
                result = result.add(plane.normal.multiply(dims[2]));
            }
        }
        return result;
    }

    protected inputError(text: string): I18nKeys | undefined {
        let dims = text.split(",").map((x) => Number(x));
        let dimension = Dimension.from(dims.length);
        let refPoint = this.getRefPoint();
        if (!Dimension.contains(this.pointData.dimension!, dimension)) {
            return "error.input.unsupportedInputs";
        } else if (dims.some((x) => Number.isNaN(x))) {
            return "error.input.invalidNumber";
        } else if (refPoint === undefined) {
            if (dims.length !== 3) {
                return "error.input.threeNumberCanBeInput";
            }
        } else if (
            dims.length === 1 &&
            (this._snaped === undefined || this._snaped.point!.isEqualTo(refPoint))
        ) {
            return "error.input.cannotInputANumber";
        }
        return undefined;
    }

    private getRefPoint(): XYZ | undefined {
        return this.pointData.refPoint?.() ?? this._snaped?.refPoint;
    }
}
