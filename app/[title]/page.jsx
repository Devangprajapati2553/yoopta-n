"use client";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import CustomInlineToolbarEditor from "../component/SimpleInlineToolbarEditor";

const ContentDetail = () => {
  const GetPath = useParams();
  const [contentData, setContentData] = useState([]);
  const ref = useRef();
  const router = useRouter();
  const [blocks, setBlocks] = useState(null);
  const [items, setItems] = useState([]);
  const [toDelete, setToDelete] = useState([]);
  const [isEdited, setIsEdited] = useState(false);
  const [isTwyllable, setIsTwyllable] = useState(false);
  const [isTwyllableIndex, setIsTwyllableIndex] = useState();
  const cleanTwylls = useRef([]);
  const addToDelete = useCallback(
    (id) => setToDelete([...toDelete, id]),
    [toDelete]
  );

  useEffect(() => {
    const GetContent = JSON.parse(localStorage.getItem("withExports"));
    const GetcontentByTitle = GetContent.filter(
      (x) => x.title == GetPath.title
    );
    if (!isEdited) {
      setContentData(GetcontentByTitle);
    } else {
      const SetText = GetcontentByTitle[0].yooptaData[0].children[0].text
        ?.split(GetcontentByTitle[0].separator === "doubleline" ? "\n\n" : "\n")
        .filter((text) => text.trim() !== "");
      // console.log(
      //   GetcontentByTitle[0].yooptaData[0].children[0].text,
      //   "GetcontentByTitle[0]"
      // );
      // console.log(SetText, "FGFGFG");
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

  const mergeBlocks = async (blockIndex) => {
    try {
      // Ensure blocks is initialized and is an array
      if (!Array.isArray(contentData)) {
        console.error("Blocks is not properly initialized or is not an array");
        return;
      }

      const newBlocks = [...contentData];

      // Ensure blockIndex is within bounds
      if (blockIndex < 0 || blockIndex >= newBlocks.length - 1) {
        console.error("Invalid blockIndex:", blockIndex);
        return;
      }

      // Merge content
      newBlocks[blockIndex].content += newBlocks[blockIndex + 1].content;

      // Handle item cleanup and deletion
      cleanTwylls.current.push(newBlocks[blockIndex + 1].__id);
      addToDelete(newBlocks[blockIndex + 1].__id);

      // Remove the merged block
      newBlocks.splice(blockIndex + 1, 1);

      // Update state
      setContentData(newBlocks);
      setChanged(true);
    } catch (e) {
      console.error("Error in mergeBlocks:", e);
    }
  };

  const HandleTwyllable = (index) => {
    // console.log(index, "THIS IS AN INDEX");
    setIsTwyllableIndex(index);
  };
  const [textArray, setTextArray] = useState([]);
  const [twyllableStatus, setTwyllableStatus] = useState([]);

  const HandleTwyllableStatus = (index) => {
    // Clone the existing twyllableStatus array to avoid mutating state directly
    const updatedTwyllableStatus = [...twyllableStatus];
    // Toggle the status of the clicked index
    updatedTwyllableStatus[index] = !updatedTwyllableStatus[index];
    // Update the state with the new twyllableStatus array
    setTwyllableStatus(updatedTwyllableStatus);
  };
  // console.log(contentData, "contentData");
  return (
    <div>
      <div className="card m-10 min-h-96">
        {contentData != undefined &&
          contentData.map((x, index) => {
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
                <div className="block-merger ml-10">
                  {x.yooptaData?.map((y, i) => {
                    const SetText = y.children[0]?.text
                      ?.split(x.separator === "doubleline" ? "\n\n" : "\n")
                      .filter((text) => text.trim() !== "");

                    return (
                      <div key={i}>
                        {(!isEdited ? y.children : SetText).map((text, ind) => {
                          const status = twyllableStatus[ind] || false;
                          return (
                            <div
                              key={ind}
                              className={` flex w-full items-center  block-${
                                ind + 1
                              }`}
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
                                <CustomInlineToolbarEditor
                                  pushto={
                                    contentData[index].yooptaData[i].children
                                  }
                                  contentData={contentData}
                                  i={i}
                                  index={index}
                                  setContentData={setContentData}
                                  content={SetText}
                                  blockIndex={ind}
                                  isEdited={isTwyllableIndex == ind && isEdited}
                                  initialText={text}
                                  separator={x.separator}
                                  status={status}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
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
