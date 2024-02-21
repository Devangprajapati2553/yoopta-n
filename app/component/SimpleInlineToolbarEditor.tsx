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
// const initialText = "Start typing...";

const CustomInlineToolbarEditor = ({
  initialText,
  isEdited,
  blockIndex,
  content,
  pushto,
  setContentData,
  contentData,
  index,
  i,
  separator,
}) => {
  const [editorState, setEditorState] = useState(null);
  const [blocks, setBlocks] = useState(content);
  const editorRef = useRef(null);
  const onChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const focus = () => {
    editorRef.current.focus();
  };

  const editorKey = useMemo(() => uuidv4(), []);

  useEffect(() => {
    setEditorState(createEditorStateWithText(initialText)); // Initialize editor content with the same text on both server and client
  }, []);

  // console.log(contentData, "contentData");
  const mergeBlocks = (blockIndex: number, type: string) => {
    if (blockIndex >= 0 && blockIndex < blocks.length) {
      const newBlocks = [...blocks];
      if (type === "up" && blockIndex > 0) {
        newBlocks[blockIndex - 1] += newBlocks[blockIndex];
        newBlocks.splice(blockIndex, 1);
        blockIndex -= 1; // Update the blockIndex after merging with the upper block
      } else if (type === "down" && blockIndex < newBlocks.length - 1) {
        newBlocks[blockIndex] += newBlocks[blockIndex + 1];
        newBlocks.splice(blockIndex + 1, 1);
      }

      const newData = [...contentData];
      if (newData && newData.length > 0) {
        const firstItem = { ...newData[0].yooptaData[i] };
        if (firstItem.children && firstItem.children.length > 0) {
          let stringOnly;
          if (separator === "doubleline") {
            stringOnly = newBlocks.join("\n\n");
          } else {
            stringOnly = newBlocks.join(",");
          }
          firstItem.children[0].text = stringOnly;
        }
        newData[0].yooptaData[i] = firstItem;
        setContentData(newData);
      }
    }
  };

  return (
    <div className="editor" onClick={focus}>
      {isEdited && (
        <VerticalAlignTopOutlined
          className="w-full mx-auto cursor-pointer"
          onClick={() => mergeBlocks(blockIndex, "up")}
        />
      )}
      {editorState && (
        <>
          <Editor
            editorKey={editorKey}
            editorState={editorState}
            onChange={onChange}
            plugins={plugins}
            ref={editorRef}
          />
          <InlineToolbar>
            {(externalProps) => (
              <div>
                <BoldButton {...externalProps} key={"editor"} />
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
        </>
      )}
      {isEdited && (
        <VerticalAlignBottomOutlined
          className="w-full mx-auto cursor-pointer"
          onClick={() => mergeBlocks(blockIndex, "down")}
        />
      )}
    </div>
  );
};

export default CustomInlineToolbarEditor;
