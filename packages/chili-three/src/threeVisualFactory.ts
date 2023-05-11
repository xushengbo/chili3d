// Copyright 2022-2023 the Chili authors. All rights reserved. MPL-2.0 license.

import { IDocument, IVisual } from "chili-core";
import { IVisualFactory, Selection } from "chili-vis";

import { ThreeVisual } from "./threeVisual";

export class ThreeVisulFactory implements IVisualFactory {
    create(document: IDocument): IVisual {
        let selection = new Selection(document);
        return new ThreeVisual(document, selection);
    }
}