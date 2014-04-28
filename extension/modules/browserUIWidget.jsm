/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {classes: Cc, interfaces: Ci, utils: Cu} = Components;

this.EXPORTED_SYMBOLS = [];

Cu.import("resource:///modules/CustomizableUI.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");

let {
    fillSubviewFromMenuItems, clearSubview, kNSXUL
  } = Cu.import("resource:///modules/CustomizableWidgets.jsm",{});

/*function addShortcut(aNode, aDocument, aItem) {
  let shortcutId = aNode.getAttribute("key");
  if (!shortcutId) {
    return;
  }
  let shortcut = aDocument.getElementById(shortcutId);
  if (!shortcut) {
    return;
  }
  aItem.setAttribute("shortcut", ShortcutUtils.prettifyShortcut(shortcut));
};

*/


CustomizableUI.createWidget({
  id: "nightlyWidget-button",
  type: "view",
  viewId: "nightly-PanelUI",
  //shortcutId: "key_devToolboxMenuItem",
  tooltiptext: "Nightly Tester Tools",
  defaultArea: CustomizableUI.AREA_PANEL,
  label: "Nightly Tester Tools",
  onViewShowing: function(aEvent) {
    const kNSXUL = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    function fillSubviewFromMenuItems(aMenuItems, aSubview) {
      let attrs = ["oncommand", "onclick", "label", "key", "disabled",
                  "command", "observes", "hidden", "class", "origin",
                  "image", "checked"];

      let doc = aSubview.ownerDocument;
      let fragment = doc.createDocumentFragment();
      for (let menuChild of aMenuItems) {
        if (menuChild.hidden)
          continue;

        let subviewItem;
        if (menuChild.localName == "menuseparator") {
          // Don't insert duplicate or leading separators. This can happen if there are
          // menus (which we don't copy) above the separator.
          if (!fragment.lastChild || fragment.lastChild.localName == "menuseparator") {
            continue;
          }
          subviewItem = doc.createElementNS(kNSXUL, "menuseparator");
        } else if (menuChild.localName == "menuitem") {
          subviewItem = doc.createElementNS(kNSXUL, "toolbarbutton");
          subviewItem.setAttribute("class", "subviewbutton");
          //addShortcut(menuChild, doc, subviewItem);
        } else {
          continue;
        }
        for (let attr of attrs) {
          let attrVal = menuChild.getAttribute(attr);
          if (attrVal)
            subviewItem.setAttribute(attr, attrVal);
        }
        fragment.appendChild(subviewItem);
      }
      aSubview.appendChild(fragment);
    };
    // Populate the subview with whatever menuitems are in the developer
    // menu. We skip menu elements, because the menu panel has no way
    // of dealing with those right now.
    let doc = aEvent.target.ownerDocument;
    let win = doc.defaultView;

    let menu = doc.getElementById("nightly-menu").firstChild;

    let itemsToDisplay = [...menu.children];

    win.nightly.menuPopup({target: menu}, menu);

    fillSubviewFromMenuItems(itemsToDisplay, doc.getElementById("nighlty-PanelUI-items"));

  },
  onViewHiding: function(aEvent) {
    function clearSubview(aSubview) {
      let parent = aSubview.parentNode;
      // We'll take the container out of the document before cleaning it out
      // to avoid reflowing each time we remove something.
      parent.removeChild(aSubview);

      while (aSubview.firstChild) {
        aSubview.firstChild.remove();
      }

      parent.appendChild(aSubview);
    };
    let doc = aEvent.target.ownerDocument;
    clearSubview(doc.getElementById("nighlty-PanelUI-items"));
  }
});
