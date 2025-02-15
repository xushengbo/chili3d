// Copyright 2022-2023 the Chili authors. All rights reserved. AGPL-3.0 license.

import en from "./en";
import { I18nKeys } from "./keys";
import zh from "./zh-cn";

const I18nId = "chili18n";
const I18nArgs = new WeakMap<HTMLElement, any[]>();

export type Locale = {
    display: string;
    code: string;
    translation: {
        [key in I18nKeys]: string;
    } & {
        [key: string]: string;
    };
};

export type Translation = Record<I18nKeys, string>;

export namespace I18n {
    let languageIndex = navigator.language.toLowerCase() === "zh-cn" ? 0 : 1;

    export const languages = [zh, en];

    export function currentIndex() {
        return languageIndex;
    }

    export function combineTranslation(code: "zh-CN" | "en", translations: Record<string, string>) {
        let language = languages.find((lang) => lang.code === code);
        if (language) {
            language.translation = {
                ...language.translation,
                ...translations,
            };
        }
    }

    export function translate(key: I18nKeys, ...args: any[]) {
        let text = languages[languageIndex].translation[key];
        if (args.length > 0) {
            text = text.replace(/\{(\d+)\}/g, (_, index) => args[index]);
        }
        return text;
    }

    export function set(dom: HTMLElement, key: I18nKeys, ...args: any[]) {
        dom.textContent = translate(key, ...args);
        dom.dataset[I18nId] = key;
        if (args.length > 0) {
            I18nArgs.set(dom, args);
        }
    }

    export function changeLanguage(idx: number): boolean {
        if (idx < 0 || idx >= languages.length || languageIndex === idx) return false;
        languageIndex = idx;
        document.querySelectorAll(`[data-${I18nId}]`).forEach((e) => {
            let html = e as HTMLElement;
            let id = html?.dataset[I18nId] as I18nKeys;
            if (id === undefined) return;
            let args = I18nArgs.get(html) ?? [];
            html.textContent = translate(id, ...args);
        });

        return true;
    }
}
