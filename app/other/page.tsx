"use client";
import React, { useEffect, useState } from "react";
import Form1 from "../component/Form1";
import Test from "../component/Form";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Paragraph from "@yoopta/paragraph";
import { HeadingOne, HeadingThree, HeadingTwo } from "@yoopta/headings";
import Blockquote from "@yoopta/blockquote";
import Callout from "@yoopta/callout";
import Code from "@yoopta/code";
import Link from "@yoopta/link";
import { BulletedList, NumberedList, TodoList } from "@yoopta/lists";
import Embed from "@yoopta/embed";
import { OFFLINE_KEY } from "../page";

const Other = () => {
  const [user, setUserData] = useState<any>({});
  const [contentData, setContentData] = useState<any>([]);

  useEffect(() => {
    const storedData = localStorage.getItem("withExports");
    const GetuserData = localStorage.getItem("userData");
    const userDataGet: FormData[] = JSON.parse(GetuserData);
    // console.log(userDataGet, "FFFFF");
    setUserData(userDataGet);
    if (storedData) {
      const parsedData: FormData[] = JSON.parse(storedData);
      // console.log(parsedData, "AAA>>>");
      setContentData(parsedData);
    }
  }, []);

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

  const HandleClick = async () => {
    const userDataBlob = new Blob([JSON.stringify(user, null, 2)], {
      type: "application/json",
    });
    // console.log(userDataBlob, "");
    const userDataUrl = URL.createObjectURL(userDataBlob);

    const parsedData: FormData[] = JSON.parse(
      localStorage.getItem(OFFLINE_KEY)
    );
    console.log(parsedData, "TOKEN DATA");

    const mainZip3 = new JSZip();

    // Add userData.json to the mainZip3
    mainZip3.file("material.json", userDataBlob);

    // USER SECTION COMPLETED

    // Create a content folder within mainZip3
    const contentFolder = mainZip3.folder("content");

    await Promise.all(
      parsedData.map(async (data, index) => {
        const contentZip = new JSZip();

        const GetContent = localStorage.getItem("withExports");

        const GEtcont = JSON.parse(GetContent);
        const indexedData = GEtcont.map(
          (item, index: { item: any; index: number }) => {
            const { yooptaData } = item;

            return {
              yooptaData: yooptaData.map((data: any) => ({ ...data, index })),
            };
          }
        );

        console.log(indexedData, "65656QQQW");

        //     // Add the content.json file to the contentZip
        const blockFolder = contentZip.folder("Blocks");

        //     if (data.separator == "singleline") {
        // const findSlash = data.content.filter((x) => x.trim() == "//");
        // console.log(findSlash, "EWWW");
        // const GetData = data.content.split("<br>");
        // const filteredArray = GetData.filter((item) => item.trim() !== "");

        indexedData.forEach((item, index: { item: any; index: number }) => {
          //   console.log(item?.yooptaData, "Content response");
          const jsonItem = {
            index: index,
            text: `${
              item.yooptaData[0]?.text ?? item.yooptaData[0]?.children[0].text
            }`,
            nodeType: item?.yooptaData[0]?.nodeType ?? `block`,
            type: item?.yooptaData[0]?.type ?? `paragraph`,
            imageFilename: null,
            // id: item?.yooptaData[0]?.id ?? index,
          };

          console.log(jsonItem, "Content response json");

          const jsonString = JSON.stringify(jsonItem, null, 2);
          blockFolder.file(`block${index}.json`, jsonString);
        });
        // }

        // blockFolder.file(`content${index}.json`, JSON.stringify(indexedData[index], null, 2));
        // contentZip.file(`content12.json`, JSON.stringify(indexedData, null, 2));

        const titleContent = JSON.stringify({
          index: index,
          title: data.title,
        });

        // Add a separate file for the title only
        contentZip.file(`title.json`, titleContent);

        // Generate zipBlob for contentZip
        const zipBlob = await contentZip.generateAsync({ type: "blob" });

        // Add zipBlob to the content folder of mainZip3
        contentFolder.file(`content_${index}.zip`, zipBlob);
        // const BlockFolder = ContentSaperateZipfiles.folder(`Blocks`);
        // BlockFolder.file(`content.json`, JSON.stringify(contentJson, null, 2));

        // console.log(`content_${index}.zip`, "QQQQQ");
      })
    );

    // Generate blob for mainZip3 and save it
    const mainZipBlob = await mainZip3.generateAsync({ type: "blob" });
    saveAs(mainZipBlob, "material.zip");

    // Revoke object URL
    URL.revokeObjectURL(userDataUrl);
  };

  return (
    <div className="px-10 max-w-screen-xl mx-auto">
      <h1 className="text-center text-3xl mt-10">Form</h1>
      <Form1 />
      <Test offlineKey={"withExports"} plugins={plugins} />
      <div className="flex items-center justify-center mb-20">
        <button
          onClick={HandleClick}
          className="  border  rounded-sm  px-5 p-1   bg-blue-500 text-white"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Other;
