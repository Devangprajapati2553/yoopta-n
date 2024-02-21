"use client";
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const YourComponent = () => {
  const [blocks, setBlocks] = useState([
    { id: "block1", content: "content 11" },
    { id: "block2", content: "content 12" },
    { id: "block3", content: "content 13" },
    // Add more blocks as needed
  ]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newBlocks = Array.from(blocks);
    const [reorderedBlock] = newBlocks.splice(result.source.index, 1);
    newBlocks.splice(result.destination.index, 0, reorderedBlock);

    setBlocks(newBlocks);
  };

  const mergeBlocks = (blockIndex) => {
    const newBlocks = [...blocks];
    if (blockIndex < newBlocks.length - 1) {
      newBlocks[blockIndex].content += newBlocks[blockIndex + 1].content;
      newBlocks.splice(blockIndex + 1, 1);
      setBlocks(newBlocks);
    }
  };




  

  const splitBlock = (blockIndex, splitPoint) => {
    const newBlocks = [...blocks];
    const blockContent = newBlocks[blockIndex].content;
    const firstPart = blockContent.slice(0, splitPoint);
    const secondPart = blockContent.slice(splitPoint);

    newBlocks[blockIndex].content = firstPart;
    newBlocks.splice(blockIndex + 1, 0, {
      id: `block${Date.now()}`,
      content: secondPart,
    });

    setBlocks(newBlocks);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {blocks.map((block, index) => (
              <Draggable key={block.id} draggableId={block.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <div>{block.content}</div>
                    <button
                      className="bg-black text-white p-4"
                      onClick={() => mergeBlocks(index)}
                    >
                      Merge
                    </button>
                    <button
                      className="bg-black text-white p-4"
                      onClick={() => splitBlock(index, 5)}
                    >
                      Split
                    </button>{" "}
                    {/* Split at position 5 */}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default YourComponent;
