import fs from 'fs/promises';

import JSON5 from 'json5';
import plist from 'plist';

/**
 * Covert a VSCode into TextMate theme configuration
 * @param {Object} vscode
 * @param {string} vscode.name
 * @param {Object<string, string>} vscode.colors
 * @param {Object[]} vscode.tokenColors
 * @param {String[]} vscode.tokenColors.scope
 * @param {Object} vscode.tokenColors.settings
 */
export function convert(vscode) {
    const textmate = {
        name: vscode.name,
        settings: vscode.tokenColors,
    }

    const defaultSettings = textmate.settings.find(setting => !setting.scope);

    if (!defaultSettings) {
        textmate.settings.unshift({ settings: {} });
    }

    const textmateDefaultSettings = textmate.settings[0].settings;
    const vscodeColors = vscode.colors;

    const mapper = new SettingsMapper({ tmThemeDefaultSettings: textmateDefaultSettings, vscThemeColors: vscodeColors });
    mapper.addSetting("editorCursor.foreground", "caret");
    mapper.addSetting("editor.selectionBackground", "selection");
    mapper.addSetting("editor.lineHighlightBackground", "lineHighlight");
    mapper.addSetting("editor.foreground", "foreground");
    mapper.addSetting("editor.background", "background");
    mapper.addSetting("editorWhitespace.foreground", "invisibles");
    for (var i = 1; i < textmate.settings.length; i++) {
        const scope = textmate.settings[i].scope;
        if (scope) {
            textmate.settings[i].scope = scope.toString();
        }
    }
    return textmate;
}
export default convert

class SettingsMapper {
    constructor({ textmateDefaultSettings, vscodeColors }) {
        this.textmateDefaultSettings = textmateDefaultSettings;
        this.vscodeColors = vscodeColors;
    }

    addSetting(source, target) {
        if (source in this.vscodeColors) {
            this.textmateDefaultSettings[target] = this.vscodeColors[source];
        }
    }
}

const vscode = JSON5.parse(await fs.readFile(process.argv[2], "utf8"));
const textmate = convert(vscode);
await fs.writeFile(process.argv[3], plist.build(textmate));