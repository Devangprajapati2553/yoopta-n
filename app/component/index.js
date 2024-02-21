/*
 * Copyright (c) 2016, Globo.com (https://github.com/globocom)
 * Copyright (c) 2016, vace.nz (https://github.com/vacenz)
 * Copyright (c) 2016, Nik Graf (https://www.draft-js-plugins.com)
 *
 * License: MIT
 */

import decorateComponentWithProps from "decorate-component-with-props";
import {
  BoldButton,
  ItalicButton,
  UnderlineButton,
  BlockquoteButton,
  CodeBlockButton,
  UnorderedListButton,
  OrderedListButton,
} from "@draft-js-plugins/buttons"; // eslint-disable-line import/no-unresolved

import createStore from "./utils/createStore";
import Toolbar from "./Toolbar";
import Separator from "./Separator";
import buttonStyles from "./buttonStyles.css";
import toolbarStyles from "./toolbarStyles.css";
import modalStyles from "./modalStyles.css";
import colorPickerStyles from "./colorPickerStyles.css";
import getModalByType from "./getModalByType";

const createToolbarPlugin = (config = {}) => {
  const defaultTheme = {
    buttonStyles,
    toolbarStyles,
    modalStyles,
    colorPickerStyles,
  };

  const defaultaddLink = undefined;

  const {
    theme = defaultTheme,
    addLink = defaultaddLink,
    structure = [
      BoldButton,
      ItalicButton,
      UnderlineButton,

      BlockquoteButton,
      CodeBlockButton,
      UnorderedListButton,
      OrderedListButton,
    ],
  } = config;

  const store = createStore({
    isVisible: false,
    addLink,
  });

  const toolbarProps = {
    store,
    structure,
    getModalByType,
    theme,
  };

  return {
    initialize: ({ getEditorState, setEditorState }) => {
      store.updateItem("getEditorState", getEditorState);
      store.updateItem("setEditorState", setEditorState);
    },
    // Re-Render the text-toolbar on selection change
    onChange: (editorState) => {
      const selection = editorState.getSelection();
      if (selection.getHasFocus() && !selection.isCollapsed()) {
        store.updateItem("isVisible", true);
      } else {
        store.updateItem("isVisible", false);
      }
      return editorState;
    },
    Toolbar: decorateComponentWithProps(Toolbar, toolbarProps),
  };
};

export default createToolbarPlugin;

export { Separator };
