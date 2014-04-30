/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {classes: Cc, interfaces: Ci, utils: Cu} = Components;

this.EXPORTED_SYMBOLS = ["fillSubviewFromMenuItems", "clearSubview", "linearizeMenuPopup"];

Cu.import("resource:///modules/CustomizableUI.jsm");

let {
    fillSubviewFromMenuItems: importedFillSubviewFromMenuItems,
    clearSubview: importedClearSubview,
    addShortcut, kNSXUL
  } = Cu.import("resource:///modules/CustomizableWidgets.jsm",{});


let fillSubviewFromMenuItems = importedFillSubviewFromMenuItems || function (aMenuItems, aSubview) {
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
        addShortcut(menuChild, doc, subviewItem);
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
  }

let clearSubview = importedClearSubview || function (aSubview) {
  let parent = aSubview.parentNode;
  // We'll take the container out of the document before cleaning it out
  // to avoid reflowing each time we remove something.
  parent.removeChild(aSubview);

  while (aSubview.firstChild) {
    aSubview.firstChild.remove();
  }

  parent.appendChild(aSubview);
}

function linearizeMenuPopup(aMenuPopup) {
  if (!aMenuPopup) {
    return aMenuPopup;
  }

  let doc = aMenuPopup.ownerDocument;

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
    let slimMenuPopup = linearizeMenuPopup(original.firstChild);
    if (!slimMenuPopup) {
      continue;
    }

    if (current.previousSibling.localName !== "menuseparator") {
      current.parentNode.insertBefore(doc.createElementNS(kNSXUL, "menuseparator"), current);
    }

    while (slimMenuPopup.firstChild) {
      current.parentNode.insertBefore(slimMenuPopup.firstChild, current);
    };

    if (current.nextSibling.localName !== "menuseparator") {
      current.parentNode.insertBefore(doc.createElementNS(kNSXUL, "menuseparator"), current);
    }

    current.parentNode.removeChild(current);
  }

  return resultMenuPopup;
}
