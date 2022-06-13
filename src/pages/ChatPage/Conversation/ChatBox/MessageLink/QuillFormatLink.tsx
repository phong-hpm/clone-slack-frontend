/* istanbul ignore file */
import Quill from "quill";

// types
import { ContextLinkValueType } from "../MessageInput/_types";

const Link = Quill.import("formats/link");

class QuillFormatLink extends Link {
  public static create(value: ContextLinkValueType): QuillFormatLink {
    const node = super.create(value.href) as HTMLElement;

    node.setAttribute("href", QuillFormatLink.sanitize(value.href));
    node.setAttribute("rel", "noopener noreferrer");
    node.setAttribute("target", "_blank");

    // set dataset
    node.dataset["text"] = value.text;
    node.dataset["href"] = value.href;
    node.dataset["url"] = QuillFormatLink.sanitize(value.href);
    node.dataset["isEditabe"] = value.isEditable ? "true" : "false";

    const linkValue: ContextLinkValueType = {
      text: value.text,
      href: value.href,
      url: QuillFormatLink.sanitize(value.href),
      isEditable: value.isEditable,
    };

    node.addEventListener("click", (e: MouseEvent) => {
      if (!linkValue.isEditable) return;

      e.preventDefault();

      const event = new Event("link-clicked", {}) as any;
      event.event = e;
      event.node = node;
      event.value = linkValue;

      window.dispatchEvent(event);
    });

    node.addEventListener("mouseenter", (e: MouseEvent) => {
      e.preventDefault();

      const event = new Event("link-hovered", {}) as any;
      event.event = e;
      event.node = node;
      event.value = linkValue;

      window.dispatchEvent(event);
    });

    return node;
  }

  static formats(node: HTMLElement) {
    // We will only be called with a node already
    // determined to be a Link blot, so we do
    // not need to check ourselves
    return {
      href: node.dataset["href"],
      url: node.dataset["url"],
      text: node.dataset["text"],
      isEditable: node.dataset["isEditable"] === "true",
    };
  }
}

QuillFormatLink.sanitize = function (url: any) {
  let val = url;
  if (!/^\w+:/.test(val) && !/^https?:/.test(val)) val = "https://" + val;
  return Link.sanitize.call(this, val);
};

Quill.register("formats/link", QuillFormatLink, true);

const Size = Quill.import("attributors/style/size");
Size.whitelist = ["13px", "15px"];
Quill.register(Size, true);

export default QuillFormatLink;
