import React, { useEffect, useState } from "react";
import Form1 from "./Form1";
import Test from "./Form";
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

const MainPage = () => {
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
      console.log(parsedData, "AAA>>>");
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

    const mainZip3 = new JSZip();

    // Add userData.json to the mainZip3
    mainZip3.file("material.json", userDataBlob);

    // USER SECTION COMPLETED


    console.log(parsedData[0],"GetSaparator")








    // Create a content folder within mainZip3
    const contentFolder = mainZip3.folder("content");

    await Promise.all(
      parsedData.map(async (data, index) => {
        const contentZip = new JSZip();

        const GetContent = localStorage.getItem("withExports");

        const GEtcont = JSON.parse(GetContent);
        const indexedData = GEtcont.map(
          (item, index: { item: any; index: number }) => {
            const { yooptaData, type } = item;
            console.log(yooptaData, "]Yoopta");
            return {
              yooptaData: yooptaData.map((data: any) => ({ ...data, index })),
            };
          }
        );

        // console.log(indexedData, "65656QQQW");

        //     // Add the content.json file to the contentZip
        const blockFolder = contentZip.folder("Blocks");

        //     if (data.separator == "singleline") {
        // const findSlash = data.content.filter((x) => x.trim() == "//");
        // console.log(findSlash, "EWWW");
        // const GetData = data.content.split("<br>");
        // const filteredArray = GetData.filter((item) => item.trim() !== "");

        indexedData.forEach((item, index: { item: any; index: number }) => {
          // console.log(item.yooptaData[0]?.children[0].text, "ASDFG");
          // console.log(item, "ASDFG item");

          const jsonItem = {
            index: index,
            text: `${item.yooptaData[0]?.children[0].text}`,
            nodeType: item?.yooptaData[0]?.nodeType ?? `block`,
            type: item?.yooptaData[0]?.type ?? `paragraph`,
            id: item.id ?? index,
            // twyllable: true, // You may need to determine this dynamically
            // type: "paragraph", // Assuming all items are paragraphs, adjust as needed
            // imageFilename: null,
          };

          const jsonString = JSON.stringify(jsonItem, null, 2);
          // blockFolder.file(`block${index}.json`, jsonString);
          // const fileName = `output_${index}.json`;
        });
        // }
        // console.log(indexedData[index], "EEEAA");
        // {
        indexedData[index].yooptaData.map((x: any, i: number) => {
          console.log(x, "QQQAZAQ");
          const createdData = {
            type: x.type,
            twyllable: x.twyllable,
            nodeType: x.nodeType,
            index: i,
            imageFilename: x.imageFilename,
            text: x.children[0].text,
          };
          blockFolder.file(
            `content${i}.json`,
            JSON.stringify(createdData, null, 2)
          );
        });
        // }
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

export default MainPage;
