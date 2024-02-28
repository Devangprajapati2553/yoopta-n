"use client";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import CustomInlineToolbarEditor from "../component/SimpleInlineToolbarEditor";
import {
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
const ContentDetail = () => {
  const GetPath = useParams();
  const [contentData, setContentData] = useState([]);
  const ref = useRef();
  const router = useRouter();
  const [toDelete, setToDelete] = useState([]);
  const [isEdited, setIsEdited] = useState(false);
  const [isTwyllableIndex, setIsTwyllableIndex] = useState();

  const [onlyText, setOnlyText] = useState();

  useEffect(() => {
    const GetContent = JSON.parse(localStorage?.getItem("withExports"));
    const GetcontentByTitle = GetContent.filter(
      (x) => x.title == GetPath.title
    );
    setAllContentData(GetcontentByTitle[0].yooptaData);
    if (!isEdited) {
      setContentData(GetcontentByTitle);
    } else {
      // const SetText = GetcontentByTitle[0].yooptaData[0].children[0].text
      //   ?.split(GetcontentByTitle[0].separator === "doubleline" ? "\n\n" : "\n")
      //   .filter((text) => text.trim() !== "");

      setContentData(GetcontentByTitle);
    }
  }, [isEdited]);

  const HandleSubmitContent = () => {
    const GetContent = JSON.parse(localStorage.getItem("withExports"));
    const FindContent = GetContent.filter((x) => x.title != GetPath.title);

    const GetcontentByTitle = GetContent.filter(
      (x) => x.title == GetPath.title
    );
    const SEtData = {
      title: GetcontentByTitle[0].title,
      separator: GetcontentByTitle[0].separator,
      yooptaData: ref.current,
    };
    FindContent.push(SEtData);

    localStorage.setItem("withExports", JSON.stringify(FindContent));
  };

  const HandleTwyllable = (index) => {
    setIsTwyllableIndex(index);
  };
  const [twyllableStatus, setTwyllableStatus] = useState([]);

  const HandleTwyllableStatus = (index) => {
    // Clone the existing twyllableStatus array to avoid mutating state directly
    const updatedTwyllableStatus = [...twyllableStatus];
    // Toggle the status of the clicked index
    updatedTwyllableStatus[index] = !updatedTwyllableStatus[index];
    // Update the state with the new twyllableStatus array
    setTwyllableStatus(updatedTwyllableStatus);
  };
  const mainData = [...contentData];
  const [AllContentData, setAllContentData] = useState([]);

  useEffect(() => {
    setOnlyText(
      contentData[0]?.yooptaData[0]?.children[0]?.text
        ?.split(contentData[0].separator === "doubleline" ? "\n\n" : "\n")
        .filter((text) => text.trim() !== "")
    );
  }, [contentData]);

  const editorRef = useRef(null);

  const focus = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handlemergeContent = (ind, type) => {
    if (ind >= 0 && ind < modifiedData.length) {
      const container = document.querySelector(`.editor-${ind}`);
      if (type === "down" && ind < modifiedData.length - 1) {
        mergeBlocks(ind, ind + 1);
      } else if (type === "up" && ind > 0) {
        const prevContainer = document.querySelector(`.editor-${ind - 1}`);

        mergeBlocks(ind - 1, ind);
      }
    }
  };

  const mergeBlocks = (index1, index2) => {
    console.log(modifiedData[index1], "mergedContent first");
    console.log(modifiedData[index2], "mergedContent second");
    if (
      typeof modifiedData[index1] !== "string" &&
      typeof modifiedData[index2] === "string"
    ) {
      const mergedContent = [...modifiedData[index1], modifiedData[index2]];

      console.log(mergedContent, "fdgpjfdgiofdgukfghd");
      modifiedData[index1] = mergedContent;

      modifiedData.splice(index2, 1);
      index2--;
      console.log([...modifiedData], "AQQQQQQQQQQQw");
      setModifiedData([...modifiedData]);
    } else if (
      typeof modifiedData[index2] !== "string" &&
      typeof modifiedData[index1] === "string"
    ) {
      const mergedContent = [modifiedData[index1], ...modifiedData[index2]];

      console.log(mergedContent, "fdgpjfdgiofdgukfghd");
      modifiedData[index1] = mergedContent;

      modifiedData.splice(index2, 1);
      index2--;
      console.log([...modifiedData], "AQQQQQQQQQQQw");
      setModifiedData([...modifiedData]);
    } else if (
      typeof modifiedData[index2] !== "string" &&
      typeof modifiedData[index1] !== "string"
    ) {
      const mergedContent = [...modifiedData[index1], ...modifiedData[index2]];

      console.log(mergedContent, "fdgpjfdgiofdgukfghd");
      modifiedData[index1] = mergedContent;

      modifiedData.splice(index2, 1);
      index2--;
      console.log([...modifiedData], "AQQQQQQQQQQQw");
      setModifiedData([...modifiedData]);
    } else {
      const mergedContent = [modifiedData[index1], modifiedData[index2]];
      console.log(mergedContent, "mergedContent last");
      console.log(mergedContent, "mergedContentmergedContentmergedContent");
      // console.log(mergedContent, "mergedContent");
      if (index1 > index2) {
        modifiedData[index1] = mergedContent;

        modifiedData.splice(index2, 1);
        index2--;
      } else {
        modifiedData[index2] = mergedContent;

        modifiedData.splice(index1, 1);
        index1--;
      }
      console.log([...modifiedData], "AQQQQQQQQQQQw");
      setModifiedData([...modifiedData]);
    }
  };

  const [modifiedData, setModifiedData] = useState([]);
  useEffect(() => {
    console.log(onlyText, "onlyText");

    setModifiedData(onlyText);
  }, [onlyText]);

  const handleSplitIt = (text, indxx) => {
    const check = text.slice(0, indxx); // Extract elements before indxx
    const check2 = text.slice(indxx); // Extract elements from indxx onwards

    const data2 = modifiedData.filter((x) => typeof x === "string");

    const arr1 = [
      check.length === 1 ? check[0] : check,
      check2.length === 1 ? check2[0] : check2,
      ...data2,
    ];

    setOnlyText(arr1);
  };

  return (
    <div>
      <div className="card m-10 min-h-96">
        {mainData != undefined &&
          mainData.map((x, index) => {
            ref.current = x.yooptaData;
            return (
              <div key={index}>
                <div className="flex gap-5 justify-between cursor-pointer ">
                  <div className="flex  gap-5" onClick={() => router.push("/")}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                      />
                    </svg>

                    <p className="text-xl mb-10 font-medium">{x.title}</p>
                  </div>
                  <div className="">
                    <div className="flex items-center gap-5">
                      <button
                        onClick={() => setIsEdited(false)}
                        className="p-2 bg-blue-400 px-5 text-white"
                      >
                        save
                      </button>
                      <button
                        onClick={() => setIsEdited(true)}
                        className="p-2 border px-2  "
                      >
                        Edit block
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        <div className="block-merger ml-10">
          {modifiedData?.map((text, ind) => {
            const status = twyllableStatus[ind] || false;

            return (
              <div
                key={ind}
                className={` flex w-full items-center  block-${ind + 1}`}
              >
                <div className="w-[5%]">
                  {isEdited && isTwyllableIndex == ind && (
                    <div
                      onClick={() => HandleTwyllableStatus(ind)}
                      className={`h-7 text-center cursor-pointer mb-7 w-7 rounded-md text-white ${
                        status ? "bg-green-400" : "bg-red-400"
                      }`}
                    >
                      {status ? "✔" : "X"}
                    </div>
                  )}
                </div>

                <div
                  className={`w-full contentwilladdhere-${ind}`}
                  onMouseEnter={() => HandleTwyllable(ind)}
                >
                  {text && typeof text === "string" ? (
                    <div
                      className={`editor  ${
                        status ? "" : "bg-[#EDEAEA]"
                      } editor-${ind}`}
                      onClick={focus}
                    >
                      {isEdited && ind != 0 && isTwyllableIndex == ind && (
                        <VerticalAlignTopOutlined
                          className="w-full mx-auto cursor-pointer absolute -mt-3 "
                          // onClick={() => mergeBlocks(ind, "up")}
                          onClick={() => handlemergeContent(ind, "up")}
                        />
                      )}
                      {/* <div className="no-space-div">
                        <hr className="line-css" />
                        <p className="fas fa-cut">✂</p>
                      </div> */}
                      {/* here */}
                      <CustomInlineToolbarEditor
                        pushto={contentData[0].yooptaData[0].children}
                        contentData={contentData}
                        setContentData={setContentData}
                        content={modifiedData}
                        setOnlyText={setModifiedData}
                        blockIndex={ind}
                        isEdited={isTwyllableIndex == ind && isEdited}
                        initialText={text}
                        separator={contentData[0].separator}
                        status={status}
                      />
                      {/* here */}
                      {isEdited && isTwyllableIndex == ind && (
                        <VerticalAlignBottomOutlined
                          className="w-full mx-auto cursor-pointer absolute -mb-3"
                          onClick={() => handlemergeContent(ind, "down")}
                          // onClick={() => mergeBlocks(ind, "down")}
                        />
                      )}
                    </div>
                  ) : (
                    <div
                      className={`editor arrayEditor-${ind}  ${
                        status ? "" : "bg-[#EDEAEA]"
                      } editor-${ind}`}
                      onClick={focus}
                    >
                      {isEdited && ind != 0 && isTwyllableIndex == ind && (
                        <VerticalAlignTopOutlined
                          className="w-full mx-auto cursor-pointer absolute -mt-3 "
                          // onClick={() => mergeBlocks(ind, "up")}
                          onClick={() => handlemergeContent(ind, "up")}
                        />
                      )}
                      {text?.map((xx, indxx) => (
                        <div key={indxx} className={``}>
                          {indxx !== 0 && (
                            <div
                              className="no-space-div py-3"
                              onClick={() => handleSplitIt(text, indxx)}
                            >
                              <hr className="line-css" />
                              <p className="fas fa-cut">✂</p>
                            </div>
                          )}

                          <CustomInlineToolbarEditor
                            pushto={contentData[0].yooptaData[0].children}
                            contentData={contentData}
                            setContentData={setContentData}
                            content={modifiedData}
                            setOnlyText={setModifiedData}
                            blockIndex={ind}
                            isEdited={isTwyllableIndex == ind && isEdited}
                            initialText={xx}
                            separator={contentData[0].separator}
                            status={status}
                          />
                        </div>
                      ))}
                      {isEdited &&
                        isTwyllableIndex == ind &&
                        modifiedData.length !== 1 && (
                          <VerticalAlignBottomOutlined
                            className="w-full mx-auto cursor-pointer absolute -mb-3"
                            onClick={() => handlemergeContent(ind, "down")}
                            // onClick={() => mergeBlocks(ind, "down")}
                          />
                        )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center">
        <button
          className="mt-5 border rounded-sm px-5 p-1"
          onClick={() => router.push("/")}
        >
          Cancel
        </button>
        <button
          className="mt-5 border rounded-sm px-5 p-1 bg-blue-500 text-white"
          onClick={HandleSubmitContent}
        >
          Save
        </button>
      </div>
      {/* <YourComponent /> */}
    </div>
  );
};

export default ContentDetail;
