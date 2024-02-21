"use client";
import { VerticalAlignTopOutlined } from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import YourComponent from "../component/Example";
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

    setContentData(GetcontentByTitle);
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return; // Dropped outside the list

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const newBlocks = Array.from(blocks);
    const [removed] = newBlocks?.splice(startIndex, 1);
    newBlocks.splice(endIndex, 0, removed);

    setBlocks(newBlocks);
  };

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

  async function mergeBlock(
    [index, directionAbove = true],
    { items, setItems, addToDelete, cleanTwylls, setChanged }
  ) {
    try {
      const result = Array.from(items);
      cleanTwylls.current.push(result[index].__id);
      if (directionAbove) {
        result[index].text = `${result[index - 1].text}${result[index].text}`;
        addToDelete(result[index - 1].__id);
        cleanTwylls.current.push(result[index - 1].__id);
        result.splice(index - 1, 1);
      } else {
        result[index].text += result[index + 1].text;
        addToDelete(result[index + 1].__id);
        cleanTwylls.current.push(result[index + 1].__id);
        result.splice(index + 1, 1);
      }
      setChanged(true);
      setItems(result);
    } catch (e) {
      console.log(e);
    }
    return Promise.resolve();
  }

  async function splitBlock(
    [index, oldText, newText],
    { items, setItems, cleanTwylls, setChanged }
  ) {
    const result = Array.from(items);
    const toAdd = {
      text: newText,
      type: "paragraph",
      __id: basePath.doc().id,
      twyllable: true,
    };
    cleanTwylls.current.push(result[index].__id);
    result[index].text = oldText;
    result.splice(index + 1, 0, toAdd);
    setItems(result);
    setChanged(true);
    return Promise.resolve();
  }
  async function deleteBlock(
    [index],
    { items, setItems, addToDelete, cleanTwylls, setChanged }
  ) {
    const result = Array.from(items);
    addToDelete(result[index].__id);
    cleanTwylls.current.push(result[index].__id);
    result.splice(index, 1);
    setItems(result);
    setChanged(true);
    return Promise.resolve();
  }

  function toggleTwyllableBlock(
    [index],
    { items, setItems, cleanTwylls, setChanged }
  ) {
    const result = Array.from(items);
    result[index].twyllable = !result[index].twyllable;
    cleanTwylls.current.push(result[index].__id);
    setItems(result);
    setChanged(true);
  }

  const runAddBlock = useCallback(
    (...args) =>
      mergeBlock(args, {
        setItems,
        addToDelete,
        items,
        cleanTwylls,
        setChanged,
      }),
    [items, setItems, addToDelete, cleanTwylls]
  );

  const runDeleteBlock = useCallback(
    (...args) =>
      deleteBlock(args, {
        setItems,
        items,
        addToDelete,
        cleanTwylls,
        setChanged,
      }),
    [items, setItems, addToDelete, cleanTwylls]
  );

  const runSplitBlock = useCallback(
    (...args) =>
      splitBlock(args, {
        setItems,
        items,

        cleanTwylls,
        setChanged,
      }),
    [items, setItems, cleanTwylls]
  );

  const runToggleTwyllable = useCallback(
    (...args) =>
      toggleTwyllableBlock(args, {
        setItems,
        items,
        cleanTwylls,
        setChanged,
      }),
    [items, setItems]
  );
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
    console.log(index, "THIS IS AN INDEX");
    setIsTwyllableIndex(index);
  };
  const [textArray, setTextArray] = useState([]);

  return (
    // <DragDropContext onDragEnd={onDragEnd}>
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
                <div className="ml-10">
                  {/* <Droppable droppableId={`droppable-${x.id}`}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        > */}
                  {x.yooptaData?.map((y, i) => {
                    const SetText = y.children[0]?.text
                      ?.split(x.separator === "doubleline" ? "\n\n" : "\n")
                      .filter((text) => text.trim() !== "");
                    console.log(y.children, "DDDD");
                    // isEdited
                    //   ?
                    // setTextArray(SetText);
                    // : setTextArray(y.children);
                    return (
                      // <Draggable
                      //   key={i}
                      //   draggableId={`draggable-${y.id}`}
                      //   index={i}
                      // >
                      //   {(provided) => (
                      //     <div
                      //       ref={provided.innerRef}
                      //       {...provided.draggableProps}
                      //       {...provided.dragHandleProps}
                      //     >
                      <div key={i}>
                        {y.children[0]?.text
                          ?.split(x.separator === "doubleline" ? "\n\n" : "\n")
                          .filter((text) => text.trim() !== "")
                          .map((text, ind) => (
                            <div
                              key={ind}
                              className="flex w-full items-center gap-5"
                            >
                              {isEdited && isTwyllableIndex == ind && (
                                <div className="h-7 text-center cursor-pointer mb-7 w-7 bg-red-400 rounded-md text-white">
                                  X
                                </div>
                              )}
                              <div
                                className="w-full"
                                onMouseEnter={() => HandleTwyllable(ind)}
                              >
                                {isEdited && (
                                  <button
                                    className=" text-black px-2 flex items-center justify-center mx-auto w-full "
                                    onClick={() => mergeBlocks(ind)}
                                  >
                                    {/* <Icon type="minus" /> */}
                                    {/* <VerticalAlignTopOutlined /> */}

                                    {/* + */}
                                  </button>
                                )}
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
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                      //     </div>
                      //   )}
                      // </Draggable>
                    );
                  })}
                  {/* </div>
                      )}
                    </Droppable> */}
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
    // </DragDropContext>
  );
};

export default ContentDetail;
