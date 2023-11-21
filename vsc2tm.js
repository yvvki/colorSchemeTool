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

    // Verify default settings, that is settings that don't have any scope.
    var defaultSettings = textmate.settings.find(setting => !setting.scope)
    if (!defaultSettings) {
        defaultSettings = { settings: {} }
        textmate.settings.unshift(defaultSettings);
    }

    addSetting("editorCursor.foreground", "caret");
    addSetting("editor.selectionBackground", "selection");
    addSetting("editor.lineHighlightBackground", "lineHighlight");
    addSetting("editor.foreground", "foreground");
    addSetting("editor.background", "background");
    addSetting("editorWhitespace.foreground", "invisibles");

    function addSetting(source, target) {
        if (source in vscode.colors) {
            defaultSettings.settings[target] = vscode.colors[source];
        }
    }

    // Convert scope array to string with commas.
    textmate.settings.forEach(setting => {
        if (setting.scope) {
            setting.scope = setting.scope.toString();
        }
    });
    return textmate;
}
export default convert;

const vscode = JSON5.parse(await fs.readFile(process.argv[2]));
const textmate = convert(vscode);
await fs.writeFile(process.argv[3], plist.build(textmate));