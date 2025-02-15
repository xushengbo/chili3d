// Copyright 2022-2023 the Chili authors. All rights reserved. AGPL-3.0 license.

import { ButtonSize, Command, CommandKeys, I18nKeys, Logger, PubSub } from "chili-core";
import { Control, Label, Svg } from "../components";
import style from "./ribbonButton.module.css";

export class RibbonButton extends Control {
    constructor(
        display: I18nKeys,
        icon: string,
        size: ButtonSize,
        readonly onClick: () => void,
    ) {
        super();
        this.initHTML(display, icon, size);
        this.addEventListener("click", onClick);
    }

    static fromCommandName(commandName: CommandKeys, size: ButtonSize) {
        let data = Command.getData(commandName);
        if (data === undefined) {
            Logger.warn(`commandData of ${commandName} is undefined`);
            return undefined;
        }
        return new RibbonButton(data.display, data.icon, size, () => {
            PubSub.default.pub("executeCommand", commandName);
        });
    }

    override dispose(): void {
        super.dispose();
        this.removeEventListener("click", this.onClick);
    }

    private initHTML(display: I18nKeys, icon: string, size: ButtonSize) {
        let image = new Svg(icon);
        if (size === ButtonSize.large) {
            image.addClass(style.icon);
            this.className = style.normal;
        } else {
            image.addClass(style.smallIcon);
            this.className = style.small;
        }
        let text = new Label().i18nText(display).addClass(style.buttonText);
        this.append(image, text);
    }
}

customElements.define("ribbon-button", RibbonButton);
