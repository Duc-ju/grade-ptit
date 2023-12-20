import React, { useState } from "react";
import classes from "./editSemesterTool.module.css";
import useHideFooter from "../../hooks/useHideFooter";
import majorMapping from "../../master-data/majorMapping.json";
import masterCourseList from "../../master-data/masterCourseList.json";
import { toast } from "react-toastify";
import LoadingButton from "../../common-components/LoadingButton";

function EditSemesterTool() {
  const [course, setCourse] = useState("");
  const [major, setMajor] = useState("");
  const [semester, setSemester] = useState("");
  useHideFooter();
  const handleChangeCourse = (e: any) => {
    setCourse(e.target.value);
    setMajor("");
  };
  const handleChangeMajor = (e: any) => {
    setMajor(e.target.value);
    setSemester(
      JSON.stringify((masterCourseList as any)[course][e.target.value])
    );
  };
  const courseList = (() => {
    return Object.keys(masterCourseList);
  })();
  const majorList = (() => {
    if (!course) return [];
    return Object.keys((masterCourseList as any)[course]);
  })();
  const handleSave = () => {
    try {
      (masterCourseList as any)[course][major] = JSON.parse(semester);
      toast.info("Cập nhật thành công");
    } catch (e) {
      toast.error("Nội dung không hợp lệ");
    }
  };
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(masterCourseList)], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "masterCourseList.json";
    document.body.appendChild(element);
    element.click();
  };
  return (
    <div className={classes.root}>
      <select onChange={handleChangeCourse} value={course}>
        <option value={""}>Khoá học</option>
        {courseList.map((course) => (
          <option value={course} key={course}>
            {course}
          </option>
        ))}
      </select>
      <select onChange={handleChangeMajor} value={major}>
        <option value={""}>Ngành học</option>
        {majorList.map((major) => (
          <option value={major} key={major}>
            {(majorMapping as any)[major]}
          </option>
        ))}
      </select>
      <textarea
        rows={30}
        cols={100}
        onChange={(e) => setSemester(e.target.value)}
        value={semester}
      />
      <div className={classes.buttonGroup}>
        <LoadingButton onClick={handleSave}>Lưu lại</LoadingButton>
        <LoadingButton onClick={handleDownload}>Tải về</LoadingButton>
      </div>
    </div>
  );
}

export default EditSemesterTool;
