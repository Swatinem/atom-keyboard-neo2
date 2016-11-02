"use babel";
// @flow

/*:: declare var atom: any;*/

const MODIFIERS = {
  "CapsLock": "Mod3",
  "Backslash": "Mod3",
  "IntlBackslash": "Mod4",
  "AltRight": "Mod4",
};
const MODIFIED = {
  Mod3: {
    "KeyQ": "…",
    "KeyW": "_",
    "KeyE": "[",
    "KeyR": "]",
    "KeyT": "^",
    "KeyY": "!",
    "KeyU": "<",
    "KeyI": ">",
    "KeyO": "=",
    "KeyP": "&",
    // "BracketLeft": "ſ",

    "KeyA": "\\",
    "KeyS": "/",
    "KeyD": "{",
    "KeyF": "}",
    "KeyG": "*",
    "KeyH": "?",
    "KeyJ": "(",
    "KeyK": ")",
    "KeyL": "-",
    "Semicolon": ":",
    "Quote": "@",

    "KeyZ": "#",
    "KeyX": "$",
    "KeyC": "|",
    "KeyV": "~",
    "KeyB": "`",
    "KeyN": "+",
    "KeyM": "%",
    "Comma": "\"",
    "Period": "'",
    "Slash": ";",
  },
  Mod4: {
    "KeyQ": "pageup",
    "KeyW": "backspace",
    "KeyE": "up",
    "KeyR": "delete",
    "KeyT": "pagedown",
    "KeyY": "¡",
    "KeyU": "7",
    "KeyI": "8",
    "KeyO": "9",
    "KeyP": "+",
    "BracketLeft": "−",

    "KeyA": "home",
    "KeyS": "left",
    "KeyD": "down",
    "KeyF": "right",
    "KeyG": "end",
    "KeyH": "¿",
    "KeyJ": "4",
    "KeyK": "5",
    "KeyL": "6",
    "Semicolon": ",",
    "Quote": ".",

    "KeyZ": "escape",
    "KeyX": "tab",
    "KeyC": "insert",
    "KeyV": "enter",
    "KeyB": "undo",
    "KeyN": ":",
    "KeyM": "1",
    "Comma": "2",
    "Period": "3",
    "Slash": ";",
  },
};

export default {
  subscription: null,
  modifier: null,

  resolve(args/*: {event: KeyboardEvent, layoutName: string}*/)/*: ?string*/ {
    const {layoutName, event} = args;
    if (!layoutName.includes("de,neo")) { return; }

    const {code} = event;
    const isUp = event.type === "keyup";
    const isModifier = MODIFIERS[code];
    if (isModifier) {
      this.modifier = isUp ? null : isModifier;
      return `${isUp ? "^" : ""}${isModifier}`;
    }
    if (!event.ctrlKey) { return; }
    const {modifier} = this;
    if (!modifier) { return; }
    const mappedKey = MODIFIED[modifier][code];
    if (!mappedKey) {
      console.warn(`Missing neo2 mapping for "${modifier}+${code}"`);
      return;
    }

    let prefix = "";
    if (isUp) {
      prefix = "^";
    } else {
      if (event.ctrlKey) { prefix += "ctrl-"; }
      if (event.altKey) { prefix += "alt-"; }
      if (event.shiftKey) { prefix += "shift-"; }
    }
    return `${prefix}${mappedKey}`
  },

  activate(state/*: any*/) {
    this.subscription = atom.keymaps.addKeystrokeResolver(ev => this.resolve(ev));
  },

  deactivate() {
    if (this.subscription) {
      this.subscription.dispose();
      this.subscription = null;
    }
    this.currentMod = null;
  },
};
