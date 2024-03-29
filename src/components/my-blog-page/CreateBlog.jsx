"use client";
import { postBlogDetailsAPI } from "@/connections/post-requests/postBlogDetailsAPI";
import { initialBlogPostState } from "@/constants/initialStateData";
import { convertBase64 } from "@/logic/conversions";
import { validateImageUrl } from "@/logic/validation";

import { Editor } from "@tinymce/tinymce-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ReactGA from "react-ga";
import { useSelector } from "react-redux";
import SuccessInfoModal from "../modal-content/SuccessInfoModal";

export default function CreateBlog() {
  const token = useSelector((state) => state.auth.token);
  const editorRef = useRef(null);
  const [formData, setFormData] = useState(initialBlogPostState);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalMsg, setSuccessModalMsg] = useState("");
  const searchParams = useSearchParams();
  const blogTitle = searchParams.get("title") || "";
  const blogDescription = searchParams.get("description");
  const coverImage = searchParams.get("image");

  const [errors, setErrors] = useState({
    blogTitle: "",
    blogDescription: "",
    coverImage: "",
  });
  useEffect(() => {
    if (blogTitle && coverImage) {
      fetch(validateImageUrl(coverImage))
        .then((response) => response.blob())
        .then((blob) => {
          setFormData({
            blogTitle,
            coverImage: blob,
          });
        })
        .catch((error) => {
          console.error("Error fetching and converting image:", error);
        });
    }
  }, [blogTitle, , coverImage]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setFormData({
      ...formData,
      coverImage: file,
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      blogTitle: "",
      blogDescription: "",
      coverImage: "",
    };

    if (formData.blogTitle.trim() === "") {
      newErrors.blogTitle = "Blog Title is required";
      valid = false;
    }
    if (editorRef.current && editorRef.current.getContent() === "") {
      console.log(editorRef.current.getContent());
      newErrors.blogDescription = "Blog Description is required";
      valid = false;
    } else if (
      editorRef.current &&
      editorRef.current.getContent().split(" ").filter(Boolean).length < 100
    ) {
      newErrors.blogDescription =
        "Blog Description must have at least 100 words";
      valid = false;
    }

    if (!formData.coverImage) {
      newErrors.coverImage = "Cover Image is required";
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  const handleSaveAsDraft = async () => {
    ReactGA.event({
      category: "User",
      action: "User Saved a Blog Draft As a Draft",
      label: "Button Click",
    });
    if (validateForm()) {
      setSuccessModalMsg("Blog Added to Draft Successfully");
      const cover = await convertBase64(formData?.coverImage);
      const payload = {
        blog: {
          cover,
          text: `${editorRef.current.getContent()}`,
          title: formData.blogTitle,
        },
        commit: `SAVE AS DRAFTS`,
      };
      try {
        const { status } = await postBlogDetailsAPI(payload, token);
        if (status?.status === "SUCCESS") {
          setFormData(initialBlogPostState);
          setShowSuccessModal(true);
          editorRef.current.setContent(
            "<p>Please write minimum 100 words of description<p>"
          );
        }
      } catch (error) {}
    }
  };

  const handleSubmit = async () => {
    ReactGA.event({
      category: "User",
      action: "User Submitted a Draft",
      label: "Button Click",
    });
    if (validateForm()) {
      setSuccessModalMsg("Blog Submitted Successfully");
      const cover = await convertBase64(formData?.coverImage);
      const payload = {
        blog: {
          cover,
          text: editorRef.current.getContent(),
          title: formData.blogTitle,
        },
        commit: `SUBMIT`,
      };
      try {
        const { status } = await postBlogDetailsAPI(payload, token);
        if (status?.status === "SUCCESS") {
          setFormData(initialBlogPostState);
          setShowSuccessModal(true);
          editorRef.current.setContent(
            "<p>Please write minimum 100 words of description<p>"
          );
        }
      } catch (error) {}
    }
  };

  return (
    <section className="create-blog-container">
      <div className="carousal-heading">
        <div className="p-heading">
          <h3>My Blogs / Create</h3>
          <div className="trend-line"></div>
        </div>
      </div>
      <form>
        <div>
          <label htmlFor="blogTitle">Blog Title</label>
          <input
            type="text"
            id="blogTitle"
            name="blogTitle"
            value={formData.blogTitle}
            onChange={handleInputChange}
          />
          {errors.blogTitle && <div className="error">{errors.blogTitle}</div>}
        </div>
        <div>
          <label htmlFor="blogDescription">Blog Description</label>
          <Editor
            apiKey="0gmbzf8arey0vgpfhgix66wghz4rlfyr740s4uzv85pedbfv"
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue={blogDescription ? blogDescription : ""}
            init={{
              placeholder: "Please write minimum 100 words of description",
              height: 500,
              menubar: false,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />
          {errors.blogDescription && (
            <div className="error">{errors.blogDescription}</div>
          )}
        </div>
        <div>
          <label>Add Cover Image :</label>
          <div className="image-div">
            <label htmlFor="inputTag" className="upload-blog-image">
              {formData?.coverImage ? (
                <img
                  src={URL.createObjectURL(formData?.coverImage)}
                  alt="img"
                />
              ) : (
                <img src="/images/image 31.svg" alt="img" />
              )}
              <p className="blog-image-para">
                {formData?.coverImage
                  ? formData?.coverImage?.name
                  : "Upload your image here"}
                <input
                  id="inputTag"
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </p>
              <span className="blog-image-span">Supports: JPG, SVG, PNG</span>
            </label>
          </div>
          {errors.coverImage && (
            <div className="error">{errors.coverImage}</div>
          )}
        </div>
      </form>
      <div className="button-container">
        <button onClick={handleSaveAsDraft}>Save as Draft</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <SuccessInfoModal
        modalState={showSuccessModal}
        setModalState={setShowSuccessModal}
      >
        <div className="text-center">
          <img src="/images/review added.svg" alt="img" className="m-auto" />
          <h5 className="text-[20px] font-bold">{successModalMsg}</h5>
        </div>
      </SuccessInfoModal>
    </section>
  );
}
