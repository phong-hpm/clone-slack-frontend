import Quill from "quill";

// context
import { ContextLinkValueType } from "./InputContext";

const Link = Quill.import("formats/link");

class ClickableLink extends Link {
  public static create(value: Omit<ContextLinkValueType, "url">): ClickableLink {
    const node = super.create(value.href) as HTMLElement;

    node.setAttribute("href", ClickableLink.sanitize(value.href));
    node.setAttribute("rel", "noopener noreferrer");
    node.setAttribute("target", "_blank");

    // set dataset
    node.dataset["text"] = value.text;
    node.dataset["href"] = value.href;
    node.dataset["url"] = ClickableLink.sanitize(value.href);
    node.dataset["isReadOnly"] = value.isReadOnly ? "true" : "false";

    const linkValue: ContextLinkValueType = {
      text: value.text,
      href: value.href,
      url: ClickableLink.sanitize(value.href),
      isReadOnly: value.isReadOnly,
    };

    node.addEventListener("click", (e: MouseEvent) => {
      if (linkValue.isReadOnly) return;

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
      isReadOnly: node.dataset["isReadOnly"] === "true",
    };
  }
}

ClickableLink.sanitize = function (url: any) {
  let val = url;
  if (!/^\w+:/.test(val) && !/^https?:/.test(val)) val = "https://" + val;
  return Link.sanitize.call(this, val);
};

Quill.register("formats/link", ClickableLink, true);

export default ClickableLink;
