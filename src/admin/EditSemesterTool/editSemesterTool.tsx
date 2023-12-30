import React, { useState } from "react";
import classes from "./editSemesterTool.module.css";
import useHideFooter from "../../hooks/useHideFooter";
import majorMapping from "../../master-data/majorMapping.json";
import LoadingButton from "../../common-components/LoadingButton";
import {
  getMasterCourseKeyList,
  getMasterMajorKeyList,
  MASTER_DATA,
} from "../../master-data/masterData";

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
    setSemester(JSON.stringify(MASTER_DATA.get(course)?.get(e.target.value)));
  };
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(MASTER_DATA)], {
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
        {getMasterCourseKeyList().map((course) => (
          <option value={course} key={course}>
            {course}
          </option>
        ))}
      </select>
      <select onChange={handleChangeMajor} value={major}>
        <option value={""}>Ngành học</option>
        {getMasterMajorKeyList(course)?.map((major) => (
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
        <LoadingButton onClick={handleDownload}>Tải về</LoadingButton>
      </div>
    </div>
  );
}

export default EditSemesterTool;
