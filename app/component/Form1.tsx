import { useFormik } from "formik";
import JSZip from "jszip";
import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import Image from "next/image";
import * as Yup from "yup";

// import EditSvg from "./EditSvg";

const Form1 = () => {
  const [userData, SetuserData] = useState<any>({});
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    const parsedData = JSON.parse(storedData);
    SetuserData(parsedData);
    setFieldValue("name", parsedData?.name);
    setFieldValue("title", parsedData?.title);
    setFieldValue("cover", parsedData?.coverUrl);
    setFieldValue("abstract", parsedData?.abstract);
    setFieldValue("author", parsedData?.author);
    setFieldValue("language", parsedData?.language);
  }, []);
  // console.log(userData, "DD");

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    title: Yup.string().required("Title is required"),
    abstract: Yup.string().required("Abstract is required"),
    cover: Yup.string().required("Cover is required"),
    author: Yup.string().required("Author is required"),
    language: Yup.string()
      .required("Language is required")
      .matches(/^(English|english)$/, "Language must be English"),
  });
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
      name: "",
      title: "",
      abstract: "",
      cover: "",
      author: "",
      language: "English",
    },
    validationSchema,
    onSubmit: async (values) => {
      const DateValue = new Date().toLocaleString();
      const date = new Date(DateValue);
      const seconds = Math.floor(date.getTime() / 1000);
      const nanoseconds = date.getMilliseconds() * 1000000;
      const createdAt = {
        _seconds: seconds,
        _nanoseconds: nanoseconds,
      };

      const userData = {
        name: values.name,
        title: values.title,
        abstract: values.abstract,
        coverUrl: values.cover,
        author: values.author,
        language: values.language,
        createdAt: createdAt,
        modifiedAt: createdAt,
      };
      console.log(userData);

      localStorage.setItem("userData", JSON.stringify([userData]));
    },
  });

  const HandleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const blob = new Blob([reader.result as ArrayBuffer], {
          type: file.type,
        });
        const url = URL.createObjectURL(blob);
        setImage(url); // Set the image URL in state
        setFieldValue("cover", url);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  console.log(values.cover);
  return (
    <div className="mb-10">
      <form>
        <div className="mt-10   ">
          <div className="max-w-xl flex   flex-col gap-5 ">
            {/* name */}
            <div className="flex items-center justify-between w-full">
              <label htmlFor="name" className="text-lg">
                Name
              </label>
              <div>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  id="name"
                  className=" pl-5 w-96 border border-black outline-none  h-10"
                />
                {touched.name && errors.name && (
                  <p className="text-red-500">{errors.name}</p>
                )}
              </div>
            </div>

            {/* title */}
            <div className="flex items-center justify-between ">
              <label htmlFor="title" className="text-lg">
                Title
              </label>
              <div>
                <input
                  type="text"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  id="title"
                  className=" pl-5 w-96 border border-black outline-none  h-10"
                />
                {touched.title && errors.title && (
                  <p className="text-red-500">{errors.title}</p>
                )}
              </div>
            </div>

            {/* Abstract */}
            <div className="flex items-center justify-between ">
              <label htmlFor="abstract" className="text-lg">
                Abstract
              </label>
              <div>
                <input
                  type="text"
                  value={values.abstract}
                  onChange={handleChange}
                  name="abstract"
                  id="abstract"
                  className=" pl-5 w-96 border border-black outline-none  h-10"
                />
                {touched.abstract && errors.abstract && (
                  <p className="text-red-500">{errors.abstract}</p>
                )}
              </div>
            </div>

            {/* cover */}
            <div className="flex items-start justify-between gap-10">
              <label htmlFor="cover" className="text-lg">
                Cover
              </label>
              <div>
                <div>
                  <input
                    type="file"
                    name="cover"
                    onChange={HandleImageChange}
                    id="cover"
                    className="opacity-0 pl-5 w-96 border border-black outline-none  h-auto"
                  />
                  {touched.cover && errors.cover && (
                    <p className="text-red-500">{errors.cover}</p>
                  )}
                  {values.cover != "" ||
                    (values.cover != undefined && (
                      <Image
                        src={values.cover}
                        className="h-auto w-40"
                        alt="selected-image"
                        width={160}
                        height={160}
                      />
                    ))}
                </div>

                {/* EDIT */}
                {/* <EditSvg /> */}
              </div>
            </div>

            {/* Author */}
            <div className="flex items-center justify-between gap-10">
              <label htmlFor="author" className="text-lg">
                Author
              </label>
              <div className="flex items-center gap-10">
                <input
                  type="text"
                  name="author"
                  value={values.author}
                  onChange={handleChange}
                  id="author"
                  className=" pl-5 w-96 border border-black outline-none  h-10"
                />
                {touched.author && errors.author && (
                  <p className="text-red-500">{errors.author}</p>
                )}

                {/* EDIT */}
                {/* <EditSvg /> */}
              </div>
            </div>

            {/* language */}
            <div className="flex items-center justify-between gap-10">
              <label htmlFor="language" className="text-lg">
                Language
              </label>
              <div className="flex items-center gap-10">
                <input
                  type="text"
                  name="language"
                  value={values.language}
                  onChange={handleChange}
                  id="language"
                  className=" pl-5 w-96 border border-black outline-none  h-10"
                />
                {touched.language && errors.language && (
                  <p className="text-red-500">{errors.language}</p>
                )}

                {/* EDIT */}
                {/* <EditSvg /> */}
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end my-10">
              <button type="button" className="border  rounded-sm px-5 p-1   ">
                Cancel
              </button>
              <button
                onClick={(e) => handleSubmit(e)}
                // type="submit"
                className="border  rounded-sm  px-5 p-1   bg-blue-500 text-white "
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form1;
