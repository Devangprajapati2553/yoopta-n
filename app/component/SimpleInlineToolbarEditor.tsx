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
  separator,
  status,
  setOnlyText,
}: any) => {
  const [editorState, setEditorState] = useState(null);
  const [text, settext] = useState(initialText);
  const editorRef = useRef(null);
  const onChange = (newEditorState: any) => {
    setEditorState(newEditorState);
  };

  const focus = () => {
    editorRef.current.focus();
  };
  const editorKey = useMemo(() => uuidv4(), []);

  useEffect(() => {
    setEditorState(createEditorStateWithText(text?.text ? text?.text : text));
  }, [initialText]);

  const handlemergeContent = (blockIndex: number, type: string) => {
    if (blockIndex >= 0 && blockIndex < content.length) {
      const container = document.querySelector(`.editor-${blockIndex}`);
      if (type === "down" && blockIndex < content.length - 1) {
        container.classList.add("no-space");
        addScissorDiv(container);
        mergeBlocks(blockIndex, blockIndex + 1);
      } else if (type === "up" && blockIndex > 0) {
        const prevContainer = document.querySelector(
          `.editor-${blockIndex - 1}`
        );
        prevContainer.classList.add("no-space");
        addScissorDiv(prevContainer);
        mergeBlocks(blockIndex - 1, blockIndex);
      }
    }
  };

  const mergeBlocks = (index1: number, index2: number) => {
    // const container2 = document.querySelector(`.editor-${index1}`);
    // const GetDiv = container2.querySelector(`.DraftEditor-root`);
    // console.log(GetDiv, "GetDiv");

    const container = document.querySelector(`.editor-${index2}`);
    // container?.appendChild(GetDiv!);

    console.log(container, "container");
    const mergedContent = content[index1] + content[index2];
    // console.log(mergedContent, "mergedContent");
    content[index1] = mergedContent;

    // console.log(content[index1], "content[index1]");
    content.splice(index2, 1);
    index2--;
    console.log(content, "Total Content");
    setOnlyText([...content]);
    setContentData([...contentData]);
  };

  const addScissorDiv = (container: any) => {
    // Create a new div element
    const noSpaceDiv = document.createElement("div");
    noSpaceDiv.classList.add("no-space-div");

    // Create a horizontal line
    const line = document.createElement("hr");
    line.classList.add("line-css");

    // Create a scissor icon
    const scissorIcon = document.createElement("p");
    scissorIcon.innerText = "✂";
    scissorIcon.classList.add("fas", "fa-cut");

    scissorIcon.addEventListener("click", () => {
      splitContent(container);
    });

    // Append the line and scissor icon to the new div
    noSpaceDiv.appendChild(line);
    noSpaceDiv.appendChild(scissorIcon);

    // Find the next sibling element
    const nextSibling = container.nextElementSibling;

    // Insert the new div before the next sibling
    container.parentNode.insertBefore(noSpaceDiv, nextSibling);
  };

  const splitContent = (container: any) => {
    container.classList.remove("no-space");
    // Remove the no-space-div
    const container2 = document.querySelector(
      `.contentwilladdhere-${blockIndex}`
    );
    const noSpaceDiv = container2.querySelector(".no-space-div");
    // console.log(noSpaceDiv, "noSpaceDiv");
    if (noSpaceDiv) {
      noSpaceDiv.remove();
    }
  };

  return (
    <div
      className={`editor  ${status ? "" : "bg-[#EDEAEA]"} editor-${blockIndex}`}
      onClick={focus}
    >
      {isEdited && blockIndex != 0 && (
        <VerticalAlignTopOutlined
          className="w-full mx-auto cursor-pointer absolute -mt-3 "
          // onClick={() => mergeBlocks(blockIndex, "up")}
          onClick={() => handlemergeContent(blockIndex, "up")}
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
          className="w-full mx-auto cursor-pointer absolute -mb-3"
          onClick={() => handlemergeContent(blockIndex, "down")}
          // onClick={() => mergeBlocks(blockIndex, "down")}
        />
      )}
    </div>
  );
};

export default CustomInlineToolbarEditor;
