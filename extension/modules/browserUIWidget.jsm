/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {classes: Cc, interfaces: Ci, utils: Cu} = Components;

this.EXPORTED_SYMBOLS = [];

try {
  Cu.import("resource:///modules/CustomizableUI.jsm");
} catch (e) {
  // No Australis, nothing to do here
}

function linearizeMenuPopup(aMenuPopup) {
  if (!aMenuPopup) {
    return aMenuPopup;
  }

  let doc = aMenuPopup.ownerDocument;
  const kNSXUL = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

  let resultMenuPopup = aMenuPopup.cloneNode(true);
  let elementsToAdd = [];

  let idx = -1;
  for (let element of resultMenuPopup.childNodes) {
    idx++;
    if (element.localName == "menu") {
      elementsToAdd.push({original: aMenuPopup.childNodes[idx], current: element});
    }
  }

  for (let {original, current} of elementsToAdd) {
    let slimMenuPopup = linearizeMenuPopup(original.menupopup);
    if (!slimMenuPopup) {
      continue;
    }

    current.parentNode.insertBefore(doc.createElementNS(kNSXUL, "menuseparator"), current);

    while (slimMenuPopup.firstChild) {
      current.parentNode.insertBefore(slimMenuPopup.firstChild, current);
    };

    current.parentNode.insertBefore(doc.createElementNS(kNSXUL, "menuseparator"), current);

    current.parentNode.removeChild(current);
  }

  return resultMenuPopup;
}

if (typeof CustomizableUI !== "undefined") {
  Cu.import("resource://gre/modules/XPCOMUtils.jsm");

  Cu.import("resource://nightly/CustomizableUIWidgetHelpers.jsm");

  let nightlyWidget = {
    id: "nightlyWidget-button",
    type: "view",
    viewId: "nightly-PanelUI",
    tooltiptext: "Nightly Tester Tools",
    defaultArea: CustomizableUI.AREA_PANEL,
    label: "Nightly Tester Tools"
  };

  nightlyWidget.onViewShowing = function(aEvent) {
    // Populate the subview with whatever menuitems are in the insert-name-here
    // menu. We skip menu elements, because the menu panel has no way
    // of dealing with those right now.
    let doc = aEvent.target.ownerDocument;
    let win = doc.defaultView;

    let nightlyMenu = doc.getElementById("nightly-menu").menupopup;
    win.nightly.menuPopup({target: nightlyMenu}, nightlyMenu);

    let menu = linearizeMenuPopup(nightlyMenu);

    let itemsToDisplay = [...menu.children];



    fillSubviewFromMenuItems(itemsToDisplay, doc.getElementById("nightly-PanelUI-items"));
  };

  nightlyWidget.onViewHiding = function(aEvent) {
    let doc = aEvent.target.ownerDocument;
    clearSubview(doc.getElementById("nightly-PanelUI-items"));
  };


  CustomizableUI.createWidget(nightlyWidget);
}
