// Copyright 2022-2023 the Chili authors. All rights reserved. AGPL-3.0 license.

import { GeometryEntity, I18nKeys, IDocument, IShape, Result, Serializer } from "chili-core";

@Serializer.register("BooleanBody", ["document", "booleanShape"])
export class BooleanBody extends GeometryEntity {
    override display: I18nKeys = "body.bolean";

    private _booleanShape: IShape;
    @Serializer.serialze()
    get booleanShape() {
        return this._booleanShape;
    }

    constructor(document: IDocument, shape: IShape) {
        super(document);
        this._booleanShape = shape;
    }

    protected override generateShape(): Result<IShape> {
        return Result.ok(this._booleanShape);
    }
}
