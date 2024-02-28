"use client";
import React, { useState } from "react";

const data = [
  {
    id: 1,
    name: "Text",
  },
  {
    id: 2,
    name: "Text2",
  },
  {
    id: 3,
    name: "Text3",
  },
  {
    id: 4,
    name: "Text4",
  },
];

const Demo = () => {
  const [merged, setMerged] = useState(false);

  const toggleMerge = () => {
    setMerged(!merged);
  };

  return (
    <div>
      <button onClick={toggleMerge}>{merged ? "Split" : "Merge"} Divs</button>
      <div>
        {data.map((x) => (
          <div
            key={x.id}
            className={`merger-${x.id} ${merged ? "merged" : ""}`}
          >
            <div>{x.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Demo;
