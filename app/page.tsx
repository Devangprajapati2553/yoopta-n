"use client";
import Paragraph, { ParagraphElement } from "@yoopta/paragraph";

import YooptaEditor from "@yoopta/editor";
import { useState } from "react";
import Blockquote, { BlockquoteElement } from "@yoopta/blockquote";
import Code, { CodeElement } from "@yoopta/code";
import Embed, { EmbedElement } from "@yoopta/embed";
import { ImageElement } from "@yoopta/image";
import Link, { LinkElement } from "@yoopta/link";
import Callout, { CalloutElement } from "@yoopta/callout";
import { Bold, Italic, CodeMark, Underline, Strike } from "@yoopta/marks";
import { NumberedList, BulletedList, TodoList } from "@yoopta/lists";
import LinkTool from "@yoopta/link-tool";
import ActionMenu from "@yoopta/action-menu-list";
import Toolbar from "@yoopta/toolbar";

import {
  HeadingOne,
  HeadingOneElement,
  HeadingThree,
  HeadingThreeElement,
  HeadingTwo,
  HeadingTwoElement,
} from "@yoopta/headings";
import Demo from "./component/Demo";
import MainPage from "./component/MainPage";
import CustomInlineToolbarEditor from "./component/SimpleInlineToolbarEditor";
import "@draft-js-plugins/inline-toolbar/lib/plugin.css";
export const yooptaInitData: YooptaValue[] = [
  {
    id: "w8KBqhH7kE1rdJgPBuj_E",
    type: "heading-one",
    children: [
      {
        text: "Lorem Ipsum",
      },
    ],
    nodeType: "block",
  },
];

const plugins = [
  Paragraph,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Callout,
  Code,
  Link,
  NumberedList,
  BulletedList,
  TodoList,
  Embed.extend({
    options: {
      maxWidth: 650,
      maxHeight: 750,
    },
  }),
];

const TOOLS = {
  Toolbar: <Toolbar />,
  ActionMenu: <ActionMenu />,
  LinkTool: <LinkTool />,
};

export const OFFLINE_KEY = "withExports";

export type YooptaValue =
  | ParagraphElement
  | BlockquoteElement
  | CodeElement
  | EmbedElement
  | ImageElement
  | LinkElement
  | CalloutElement
  | HeadingOneElement
  | HeadingTwoElement
  | HeadingThreeElement;
export default function Home() {
  const [editorValue, setEditorValue] = useState<YooptaValue[]>();
  const marks = [Bold, Italic, CodeMark, Underline, Strike];

  const onChange = (val: YooptaValue[]) => {
    // console.log(val, "WWWE");
    setEditorValue(val);
  };
  return (
    <div>
      <div className="m-10">
        {/* <Demo
          editorValue={editorValue}
          offlineKey={OFFLINE_KEY}
          onChange={onChange}
          plugins={plugins}
        />{" "}
        <YooptaEditor<any>
          value={editorValue}
          onChange={onChange}
          plugins={plugins}
          marks={marks}
          placeholder="Type '/' to start"
          tools={TOOLS}
          offline={OFFLINE_KEY}
        /> */}
        <MainPage />
        {/* <CustomInlineToolbarEditor /> */}
      </div>
    </div>
  );
}
