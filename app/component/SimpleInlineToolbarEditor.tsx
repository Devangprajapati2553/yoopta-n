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
  status,
}) => {
  const [editorState, setEditorState] = useState(null);
  const [blocks, setBlocks] = useState(content);
  const [text, settext] = useState(initialText);
  const editorRef = useRef(null);
  const onChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const focus = () => {
    editorRef.current.focus();
  };
  // console.log(contentData,"contentData")
  const editorKey = useMemo(() => uuidv4(), []);

  console.log(initialText, "initialText");
  useEffect(() => {
    setEditorState(createEditorStateWithText(text?.text ? text?.text : text)); // Initialize editor content with the same text on both server and client
  }, [initialText]);

  console.log(contentData, "contentData");
  const mergeBlocks = (blockIndex: number, type: string) => {
    if (blockIndex >= 0 && blockIndex < blocks.length) {
      const newBlocks = [...blocks];
      if (type === "up" && blockIndex > 0) {
        newBlocks[blockIndex - 1] += "<br/>" + newBlocks[blockIndex];

        newBlocks.splice(blockIndex, 1);
        blockIndex -= 1;
        console.log(newBlocks, "newBlocks");
      } else if (type === "down" && blockIndex < newBlocks.length - 1) {
        newBlocks[blockIndex] += "<br/>" + newBlocks[blockIndex + 1];
        newBlocks.splice(blockIndex + 1, 1);
      }
      // com
      const newData = [...contentData];
      console.log(contentData, "contentData");
      console.log(newData, "contentData newData");
      if (newData && newData.length > 0) {
        const firstItem = { ...newData[0].yooptaData[0] };
        console.log(firstItem, "newData");
        if (firstItem.children && firstItem.children.length > 0) {
          console.log(newBlocks, "Waste");
          // let stringOnly;
          // if (separator === "doubleline") {
          //   stringOnly = newBlocks.join(",");
          // } else {
          //   stringOnly = newBlocks.join(",");
          // }
          console.log(firstItem.children[0].text, "firstItem.children[0].text");

          firstItem.children[0].text = newBlocks
            .join("',")
            .replace(/, /g, "\n\n");
        }
        // newData[0].yooptaData[0].children[0].text = newBlocks
        //   .join("'")
        //   .replace(/,/g, "\n\n");
        newData[0].yooptaData[0].children[0].text = newBlocks.join("\n\n");
        console.log(newBlocks.join("\n\n"), "newblock");

        console.log(newData, "Last response");
        setContentData(newData);
      }
    }
  };

  // console.log(contentData, "Map data");

  const handlemergeContent = (blockIndex: number, type: string) => {
    if (blockIndex >= 0 && blockIndex < blocks.length) {
      const container = document.querySelector(`.editor-${blockIndex}`);
      if (type === "down" && blockIndex < blocks.length - 1) {
        container.classList.add("no-space");
        addScissorDiv(container);
      } else if (type === "up" && blockIndex > 0) {
        const prevContainer = document.querySelector(
          `.editor-${blockIndex - 1}`
        );
        prevContainer.classList.add("no-space");
        addScissorDiv(prevContainer);
      }
    }
  };

  const addScissorDiv = (container) => {
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

  const splitContent = (container) => {
    container.classList.remove("no-space");
    // Remove the no-space-div
    const container2 = document.querySelector(
      `.contentwilladdhere-${blockIndex}`
    );
    const noSpaceDiv = container2.querySelector(".no-space-div");
    console.log(noSpaceDiv, "noSpaceDiv");
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
