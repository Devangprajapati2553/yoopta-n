import React, { useState, useRef, useMemo, useEffect } from "react";
import Editor, { createEditorStateWithText } from "@draft-js-plugins/editor";
import createInlineToolbarPlugin from "@draft-js-plugins/inline-toolbar";
import "@draft-js-plugins/inline-toolbar/lib/plugin.css";
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from "@draft-js-plugins/buttons";
import { v4 as uuidv4 } from "uuid";
import "./editorStype.css";
import {
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { convertToRaw } from "draft-js";
const HeadlinesPicker = ({ onOverrideContent }) => {
  const onWindowClick = () => {
    onOverrideContent(undefined);
  };

  useEffect(() => {
    window.addEventListener("click", onWindowClick);
    return () => {
      window.removeEventListener("click", onWindowClick);
    };
  }, []);

  const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];

  return (
    <div>
      {buttons.map((Button, i) => (
        <Button key={i} onOverrideContent={onOverrideContent} />
      ))}
    </div>
  );
};

const HeadlinesButton = ({ onOverrideContent }) => {
  const onMouseDown = (event) => event.preventDefault();

  const onClick = () => {
    onOverrideContent(HeadlinesPicker);
  };

  return (
    <div onMouseDown={onMouseDown} className="headlineButtonWrapper">
      <button onClick={onClick} className="headlineButton">
        H
      </button>
    </div>
  );
};

const inlineToolbarPlugin = createInlineToolbarPlugin();
const { InlineToolbar } = inlineToolbarPlugin;
const plugins = [inlineToolbarPlugin];

const CustomInlineToolbarEditor = ({
  initialText,
  isEdited,
  blockIndex,
  content,
  pushto,
  setContentData,
  contentData,
  separator,
  status,
  setOnlyText,
  allContent,
}: any) => {
  const [editorState, setEditorState] = useState(null);
  const [selection, setSelection] = useState(null);
  const [toolbarPosition, setToolbarPosition] = useState({}); // To store toolbar position
  const editorRef = useRef(null);

  useEffect(() => {
    if (typeof initialText === "string") {
      setEditorState(createEditorStateWithText(initialText));
    } else if (typeof initialText !== "string" && initialText) {
      console.log(initialText, "initialTextinitialText");
      // initialText.forEach((x) => {
      //   setEditorState(createEditorStateWithText(x));
      // });
    } else {
      console.error("Invalid initial text format:", initialText);
    }
  }, [initialText]);

  // Function to handle editor state change
  const onChange = (newEditorState: any) => {
    setEditorState(newEditorState);
    const currentSelection = newEditorState.getSelection();

    setSelection(currentSelection);
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    // allContent.push(rawContent);
  };

  // Function to handle mouse up event
  const handleMouseUp = () => {
    const selectionState = editorState.getSelection();
    if (!selectionState.isCollapsed()) {
      const selectionRect = getSelectionRect();
      setToolbarPosition({
        top: selectionRect.top,
        left: selectionRect.left + selectionRect.width / 2,
      });
    }
  };

  // Function to get selection rectangle
  const getSelectionRect = () => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    return rect;
  };
  const getFinalValue = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    // You can now use rawContent for further processing or store it in your state
    console.log("Final Value:", rawContent);
  };

  return (
    <div onMouseUp={handleMouseUp}>
      {editorState && (
        <>
          <Editor
            editorState={editorState}
            onChange={onChange}
            plugins={plugins}
            ref={editorRef}
          />
          {selection && !selection.isCollapsed() && (
            <div
              className="inline-toolbar"
              style={{ top: toolbarPosition.top, left: toolbarPosition.left }}
            >
              <InlineToolbar>
                {(externalProps) => (
                  <div>
                    <BoldButton {...externalProps} />
                    <ItalicButton {...externalProps} />
                    <UnderlineButton {...externalProps} />
                    <CodeButton {...externalProps} />
                    <HeadlinesButton {...externalProps} />
                    <UnorderedListButton {...externalProps} />
                    <OrderedListButton {...externalProps} />
                    <BlockquoteButton {...externalProps} />
                    <CodeBlockButton {...externalProps} />
                  </div>
                )}
              </InlineToolbar>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomInlineToolbarEditor;
