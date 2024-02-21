"use client";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import "./editorStype.css";
import { html } from "@yoopta/exports";
import { useRouter } from "next/navigation";
import { YooptaValue } from "../page";
interface FormData {
  title: string;
  content: string | { text: string; twyllable: boolean; type: string };
  separator: string;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  separator: Yup.string().required("Radio button selection is required"),
});

function Test({ plugins, offlineKey }) {
  const [htmlString, setHtmlString] = useState<string>("");

  const [user, setUserData] = useState<any>({});

  const [image, setImage] = useState<string>("");
  const [contentData, setContentData] = useState([]);
  const [value, setValue] = useState("");
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
    setValues,
    touched,
  } = useFormik({
    initialValues: {
      title: "",
      content: "",
      separator: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values.content, "FFFF");
      // textProcess(values.content, 1, false);

      if (values.content?.length === 0)
        return alert("Paste into textarea html string ");
      const yooptaData = html.deserialize(values.content, plugins);
      console.log(yooptaData, "QQA");
      yooptaData.map((x) => {
        console.log(x, "QQAERF");
      });
      const jsonItem = [
        {
          children: [{ text: yooptaData[0].text }],
          twyllable: true, // You may need to determine this dynamically
          type: "paragraph", // Assuming all items are paragraphs, adjust as needed
          imageFilename: null,
        },
      ];
      const Alldata = {
        title: values.title,
        separator: values.separator,
        yooptaData: yooptaData[0].id ? yooptaData : jsonItem,
      };
      console.log(Alldata, "AZXSAZXS");

      // if (values.separator == "singleline") {
      //   console.log(values.content, "EWWW");
      //   const GetData = values.content.split("<br>");
      //   const filteredArray = GetData.filter((item) => item.trim() !== "");

      //   filteredArray.forEach((item, index) => {
      //     const jsonItem = {
      //       index: index,
      //       text: item,
      //       twyllable: true, // You may need to determine this dynamically
      //       type: "paragraph", // Assuming all items are paragraphs, adjust as needed
      //       imageFilename: null,
      //     };

      //     const jsonString = JSON.stringify(jsonItem, null, 2);
      //     contentZip.file(`block${index}.json`, jsonString);
      //     // const fileName = `output_${index}.json`;

      //   });
      // }
      // if (values.separator == "doubleline") {
      //   const GetData = values.content.split("<br><br>");
      //   const filteredArray = GetData.filter((item) => item.trim() !== "");
      //   const jsonArray = filteredArray.map((item, index) => {
      //     return {
      //       index: index,
      //       text: item,
      //       // twyllable: true, // You may need to determine this dynamically
      //       // type: "paragraph", // Assuming all items are paragraphs, adjust as needed
      //       imageFilename: null,
      //     };
      //   });
      //   console.log(filteredArray, "DDDDDDD double");
      // }

      // Push the values to the state array

      setContentData((prevContentData) => [...prevContentData, Alldata]);
      setFormData((formData) => [...formData, Alldata]);
      let existingData: FormData[] = JSON.parse(
        localStorage.getItem(offlineKey) || "[]"
      );
      // console.log(existingData, "A");

      existingData.push(Alldata);

      localStorage.setItem(offlineKey, JSON.stringify(existingData));
      resetForm();
      // setValue("");
      setFieldValue("content", "");
      setFieldValue("separator", "");
    },
  });
  function textProcess(content, generateId, doubleNewLine) {
    // Split the content into blocks based on double new lines
    const blocks = content.split(doubleNewLine ? /\n\s*\n/ : "\n");
    console.log(blocks,"what what")

    // Map each block to an object with an ID and the block content
    return blocks.map((block, index) => ({
      __id: generateId(), // Assuming generateId is a function that generates unique IDs
      content: block.trim(), // Trim the block content to remove leading/trailing whitespace
      index: index + 1, // Add 1 to index to start from 1 instead of 0
    }));

  }


  const [FormDataa, setFormData] = useState([]);
  useEffect(() => {
    // Retrieve data from local storage
    const storedData = localStorage.getItem(offlineKey);
    // console.log(storedData, "QQEWSD");
    const GetuserData = localStorage.getItem("userData");
    const userDataGet: FormData[] = JSON.parse(GetuserData);
    setUserData(userDataGet);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      // console.log(parsedData, "AAA>>>");
      setFormData(parsedData);
    }
  }, []);

  // console.log(FormDataa, "FFFF");

  const router = useRouter();
  return (
    <div className="mt-20 ">
      <div>
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div className="mt-10  ">
            <div className="mt-5">
              <h2 className="text-3xl ">Content</h2>

              {FormDataa &&
                FormDataa != null &&
                FormDataa?.map((data, index) => {
                  // console.log(data, "EEEEEE");
                  return (
                    <div
                      key={index}
                      className="mt-5 cursor-pointer bg-gray-50 p-2 rounded-md  ml-5 "
                      onClick={() => router.push(`/${data?.title}`)}
                    >
                      {/* <YooptaEditor value={data.title} onChange={onChange} /> */}

                      <h3 className="pl-5 capitalize">{data?.title}</h3>
                     
                    </div>
                  );
                })}

              {/* { FormDataa.length === 0 && <p>No form data available.</p>} */}
            </div>
          </div>
          <div className="mt-5">
            {/* <form> */}
            <div className="flex items-start  justify-between">
              <div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="file">
                    Bulk Create With single file (Epub/Special Html)
                  </label>
                  {/* dropify */}
                  <div className="h-[150px] w-96 bg-gray-100 border-dashed border-gray-300 rounded-md"></div>
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="file">Import anexported content</label>
                  {/* dropify */}
                  <div className="h-[150px] w-96 bg-gray-100 border-dashed border-gray-300 rounded-md"></div>
                </div>
              </div>
              <div>
                <h3>Manually Create</h3>
                <div className=" mt-5 flex items-center justify-between gap-20">
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
                    {touched.title && errors.title && (
                      <p className="text-red-500 font-semibold text-sm pl-1 mt-2 ">
                        {errors.title}
                      </p>
                    )}
                  </div>
                </div>

                <div id="form" className="  mt-5 flex items-start gap-20">
                  <label htmlFor="Content">
                    <span className="text-red-500">* </span> Content
                  </label>
                  <div>
                    <div className="w-96 "></div>

                    <textarea
                      rows={5}
                      // type="text"
                      value={values.content}
                      onChange={(e) => {
                        console.log(e.target.value, "Response");
                        setFieldValue("content", e.target.value);
                      }}
                      name="content"
                      id="Content"
                      className="p-3 min-h-[80px]  pl-5 w-96 border  outline-none  h-10"
                    />

                    <p className="text-xs text-gray-400">
                      insert valid and supported HTML or a plain text
                    </p>
                    {touched.content && errors.content && (
                      <p className="text-red-500 font-semibold text-sm pl-1 mt-2 ">
                        {errors.content}
                      </p>
                    )}
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
                      choose how paragraph are saperated for plain text
                      materials
                    </p>
                  </div>
                </div>
                {touched.separator && errors.separator && (
                  <p className="ml-40 text-red-500 font-semibold text-sm pl-1 mt-2 ">
                    {errors.separator}
                  </p>
                )}
                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    // onClick={(e) => HandleAllContent(e)}
                    className=" mt-5  border  rounded-sm  px-5 p-1   bg-blue-500 text-white  "
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Test;
