import { createPopper, type Instance } from "@popperjs/core";

type PopperPosition = "top" | "bottom" | "left" | "right";
type PopperStatus = "-start" | "-end" | "";
type PopperPlacement = `${PopperPosition}${PopperStatus}`;

type PopperOptions = {
  text: string;
  placement: PopperPlacement;
};

export function popper(
  element: HTMLElement,
  { text, placement }: PopperOptions
) {
  const pop = document.createElement("div");
  pop.textContent = text;
  console.log("popper", pop, text, placement);

  let popper: Instance | null = null;

  function show() {
    console.log("show");
    pop.style.display = "block";
    popper = createPopper(element, pop, {
      placement,
    });
  }

  function hide() {
    console.log("hide");
    if (popper) {
      popper.destroy();
      popper = null;
      pop.style.display = "none";
    }
  }

  element.addEventListener("mouseenter", show);
  element.addEventListener("mouseleave", hide);

  document.body.appendChild(pop);

  return {
    destroy() {
      popper?.destroy();
      element.removeEventListener("mouseenter", show);
      element.removeEventListener("mouseleave", hide);
    },
  };
}

export default function createPopperAction() {
  let popperElement, popperTooltip, popperParams;
  let popper;

  function initialisePopper() {
    if (popperElement && popperTooltip) {
      popper = createPopper(popperElement, popperTooltip, popperParams);
    }
  }

  function destroyPopper() {
    if (popper) {
      popper.destroy();
      popper = null;
    }
  }

  function usePopperElement(element) {
    popperElement = element;
    initialisePopper();
    return {
      destroy() {
        popperElement = null;
        destroyPopper();
      },
    };
  }
  function usePopperToolip(element, params) {
    popperTooltip = element;
    popperParams = params;
    initialisePopper();

    return {
      update(newParams) {
        popperParams = newParams;
        popper.setOptions(popperParams);
      },
      destroy() {
        popperTooltip = null;
        destroyPopper();
      },
    };
  }
  return [usePopperElement, usePopperToolip];
}
