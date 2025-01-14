// Copyright 2022-2023 the Chili authors. All rights reserved. AGPL-3.0 license.

import { AsyncController, I18nKeys, IDocument, XYZ } from "chili-core";

import { SnapedData } from "./interfaces";
import {
    SnapAngleEventHandler,
    SnapEventHandler,
    SnapLengthAtAxisData,
    SnapLengthAtAxisHandler,
    SnapLengthAtPlaneData,
    SnapLengthAtPlaneHandler,
    SnapPointData,
    SnapPointEventHandler,
} from "./snapEventHandler";

export abstract class Snapper {
    protected abstract getEventHandler(document: IDocument, controller: AsyncController): SnapEventHandler;

    async snap(
        document: IDocument,
        tip: I18nKeys,
        controller: AsyncController,
    ): Promise<SnapedData | undefined> {
        let executorHandler = this.getEventHandler(document, controller);
        await document.selection.pickAsync(executorHandler, tip, controller, false, "draw");
        return controller.result?.status === "success" ? executorHandler.snaped : undefined;
    }
}

export class AngleSnapper extends Snapper {
    constructor(
        readonly center: () => XYZ,
        readonly p1: XYZ,
        readonly snapPointData: SnapPointData,
    ) {
        super();
    }

    protected getEventHandler(document: IDocument, controller: AsyncController): SnapEventHandler {
        return new SnapAngleEventHandler(document, controller, this.center, this.p1, this.snapPointData);
    }
}

export class PointSnapper extends Snapper {
    constructor(readonly data: SnapPointData) {
        super();
    }

    protected getEventHandler(document: IDocument, controller: AsyncController): SnapEventHandler {
        return new SnapPointEventHandler(document, controller, this.data);
    }
}

export class LengthAtAxisSnapper extends Snapper {
    constructor(readonly data: SnapLengthAtAxisData) {
        super();
    }

    protected getEventHandler(document: IDocument, controller: AsyncController): SnapEventHandler {
        return new SnapLengthAtAxisHandler(document, controller, this.data);
    }
}

export class LengthAtPlaneSnapper extends Snapper {
    constructor(readonly data: SnapLengthAtPlaneData) {
        super();
    }

    protected getEventHandler(document: IDocument, controller: AsyncController): SnapEventHandler {
        return new SnapLengthAtPlaneHandler(document, controller, this.data);
    }
}
