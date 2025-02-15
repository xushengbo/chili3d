// Copyright 2022-2023 the Chili authors. All rights reserved. AGPL-3.0 license.

import {
    GeometryEntity,
    I18nKeys,
    IDocument,
    IEdge,
    IShape,
    IWire,
    Result,
    Serializer,
    ShapeType,
} from "chili-core";

@Serializer.register("SweepBody", ["document", "profile", "path"])
export class SweepBody extends GeometryEntity {
    override display: I18nKeys = "body.sweep";

    private _profile: IShape;
    @Serializer.serialze()
    get profile() {
        return this._profile;
    }
    set profile(value: IShape) {
        this.setPropertyAndUpdate("profile", value);
    }

    private _path: IWire;
    @Serializer.serialze()
    get path() {
        return this._path;
    }
    set path(value: IWire) {
        this.setPropertyAndUpdate("path", value);
    }

    constructor(document: IDocument, profile: IShape, path: IWire | IEdge) {
        super(document);
        this._profile = profile;
        this._path =
            path.shapeType === ShapeType.Wire
                ? (path as IWire)
                : document.application.shapeFactory.wire(path as unknown as IEdge).value!;
    }

    protected override generateShape(): Result<IShape> {
        return this.document.application.shapeFactory.sweep(this.profile, this.path);
    }
}
