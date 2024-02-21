"use client";
import { html, markdown } from "@yoopta/exports";

import React, { useState } from "react";
import { YooptaValue } from "../page";
import { YooptaPlugin } from "@yoopta/editor";
import { useFormik } from "formik";

type Props = {
  editorValue: YooptaValue[];
  plugins: YooptaPlugin<any, any>[];
  onChange: (val: YooptaValue[]) => void;
  offlineKey: string;
};
const Demo = ({ editorValue, plugins, onChange, offlineKey }: Props) => {
  const [htmlString, setHtmlString] = useState<string>("");
  //   console.log(plugins, "QQQ");
  const handleImportHTML = () => {
    // window.location.reload();
  };

  const {
    handleChange,
    handleSubmit,
    errors,
    values,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: {
      title: "",
      content: "",
      separator: "",
    },
    onSubmit: (values) => {
      // console.log(values.content.length, "FDGFDG");
      if (values.content?.length === 0)
        return alert("Paste into textarea html string ");
      const yooptaData = html.deserialize(values.content, plugins);

      const Alldata = {
        title: values.title,
        yooptaData,
      };

      localStorage.setItem(offlineKey, JSON.stringify(Alldata));

      onChange(yooptaData);
      // console.log(values, "RTRTRTRT");
      resetForm();
      //   setHtmlString("");
    },
  });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <h3>Manually Create</h3>
          <div className=" mt-5 flex items-start  gap-20">
            <label htmlFor="title">
              <span className="text-red-500">* </span> title
            </label>
            <div>
              <input
                type="text"
                value={values.title}
                onChange={handleChange}
                name="title"
                id="title"
                className=" pl-5 w-96 border  outline-none  h-10"
              />
            </div>
          </div>

          <div className=" mt-5 flex items-start gap-20">
            <label htmlFor="Content">
              <span className="text-red-500">* </span> Content
            </label>
            <div>
              <textarea
                rows={5}
                // type="text"
                value={values.content}
                onChange={(e) => setFieldValue("content", e.target.value)}
                name="content"
                id="Content"
                className="p-3 min-h-[80px]  pl-5 w-96 border  outline-none  h-10"
              />
              <p className="text-xs text-gray-400">
                insert valid and supported HTML or a plain text
              </p>
            </div>
          </div>

          <div className="flex items-start gap-20 mt-5">
            <label htmlFor="separator">
              <span className="text-red-500">* </span> Separator
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="separator"
                  id="separator"
                  value={"doubleline"}
                  onChange={handleChange}
                />
                <label htmlFor="radio1">Use double newline</label>
                <input
                  type="radio"
                  name="separator"
                  id="separator"
                  value={"singleline"}
                  onChange={handleChange}
                />
                <label htmlFor="radio2">Use single newline</label>
              </div>
              <p className="text-xs text-gray-400">
                choose how paragraph are saperated for plain text materials
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <button
              type="submit"
              // onClick={HandleAllContent}
              className=" mt-5  border  rounded-sm  px-5 p-1   bg-blue-500 text-white  "
            >
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Demo;
