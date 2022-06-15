import { EmojiIconType } from "components/Emoji/_types";

const emojiIcons = {
  whiteCheckMarK: {
    id: "white_check_mark",
    name: "Check Mark Button",
    native: "✅",
    shortcodes: ":white_check_mark:",
    unified: "2705",
    keywords: [],
  },
  raisedHands: {
    id: "raised_hands",
    keywords: [],
    name: "Raising Hands",
    native: "🙌",
    shortcodes: ":raised_hands:",
    unified: "1f64c",
  },
};

function Picker({ onEmojiSelect }: { onEmojiSelect: (emoji: EmojiIconType) => void }) {
  const pickerNode = document.createElement("div");
  pickerNode.dataset.testid = "Picker";

  const whiteCheckMarKNode = document.createElement("div");
  whiteCheckMarKNode.dataset.testid = "click-white_check_mark";
  whiteCheckMarKNode.onclick = () => onEmojiSelect(emojiIcons.whiteCheckMarK);
  pickerNode.appendChild(whiteCheckMarKNode);

  const raisedHandsNode = document.createElement("div");
  raisedHandsNode.dataset.testid = "click-raised_hands";
  raisedHandsNode.onclick = () => onEmojiSelect(emojiIcons.raisedHands);
  pickerNode.appendChild(raisedHandsNode);

  return pickerNode;
}

module.exports = {
  Picker,
};

export {};
