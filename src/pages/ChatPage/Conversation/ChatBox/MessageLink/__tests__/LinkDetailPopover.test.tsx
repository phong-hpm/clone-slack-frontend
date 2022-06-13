import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import LinkDetailPopover from "../LinkDetailPopover";

const renderComponent = () => {
  return render(
    <div data-testid="container">
      <LinkDetailPopover />
    </div>
  );
};

const node = document.createElement("div");
const dispatchLinkHoveredEvent = async (value?: any) => {
  const event = new Event("link-hovered");
  (event as any).value = { isEditable: false, url: "http://example.com", ...value };
  (event as any).node = node;
  await waitFor(() => window.dispatchEvent(event));
};

describe("Test actions", () => {
  test("When dispatch hover", async () => {
    renderComponent();

    await dispatchLinkHoveredEvent();

    expect(screen.getByText("http://example.com")).toBeInTheDocument();

    // unhover link tag
    userEvent.unhover(node);
    expect(screen.queryByText("http://example.com")).toBeNull();
  });

  test("When dispatch hover when link is editable", async () => {
    renderComponent();

    await dispatchLinkHoveredEvent({ isEditable: true });

    expect(screen.getByTestId("container").childNodes.length).toEqual(0);
  });
});
