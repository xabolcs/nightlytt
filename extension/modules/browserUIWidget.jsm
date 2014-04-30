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
    // Populate the subview with whatever menuitems are in the developer
    // menu. We skip menu elements, because the menu panel has no way
    // of dealing with those right now.
    let doc = aEvent.target.ownerDocument;
    let win = doc.defaultView;

    let menu = doc.getElementById("nightly-menu").firstChild;

    let itemsToDisplay = [...menu.children];

    win.nightly.menuPopup({target: menu}, menu);

    fillSubviewFromMenuItems(itemsToDisplay, doc.getElementById("nightly-PanelUI-items"));
  };

  nightlyWidget.onViewHiding = function(aEvent) {
    let doc = aEvent.target.ownerDocument;
    clearSubview(doc.getElementById("nightly-PanelUI-items"));
  };


  CustomizableUI.createWidget(nightlyWidget);
}
