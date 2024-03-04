import React, { useContext, useState } from "react";
import classes from "./semesterViewer.module.scss";
import SubjectViewer from "../SubjectViewer";
// @ts-ignore
import mergeClassNames from "merge-class-names";
import { FileContext, FileContextType } from "../../context-api/FileProvider";
import { AuthContext, AuthContextType } from "../../context-api/AuthProvider";
import { AiFillPlusCircle } from "@react-icons/all-files/ai/AiFillPlusCircle";
import SubjectForm from "../SubjectForm";
import {
  ModalContext,
  ModalContextType,
} from "../../context-api/ModalProvider";
import { db } from "../../firebase/config";
import { toast } from "react-toastify";
import calculateGPASemester from "../../utils/calculateGPASemester";
import calculateNewGPASemester from "../../utils/calculateNewGPASemester";
import calculateCPAToSemester from "../../utils/calculateCPAToSemester";
import calculateNewCPAToSemester from "../../utils/calculateNewCPAToSemester";
import { Semester } from "../../entity/semester";
import { Subject } from "../../entity/subject";

function SemesterViewer(props: { semester: Semester; semesterIndex: number }) {
  const { semester, semesterIndex } = props;
  const { semesterState, setSemesterState, file, setFile } = useContext(
    FileContext
  ) as FileContextType;
  const { user } = useContext(AuthContext) as AuthContextType;
  const { showModal } = useContext(ModalContext) as ModalContextType;
  const [edit, setEdit] = useState(false);

  const gpa = calculateGPASemester(semester);
  const newGPA = calculateNewGPASemester(semester);

  const cpa = calculateCPAToSemester(semesterIndex, semesterState);
  const newCPA = calculateNewCPAToSemester(semesterIndex, semesterState);

  const handleAddSubject = () => {
    showModal(
      <SubjectForm
        subject={
          {
            id:
              [...semester.subjects].sort((s1, s2) =>
                !s1 || !s2 ? 0 : s2.id - s1.id
              )[0].id + 1,
          } as any
        }
        saveProcess={addSubjectProcess}
        fillProcess={fillProcess}
        isEdit={false}
      />
    );
  };

  const addSubjectProcess = (newSubjectInfo: Subject) => {
    let processedFile = commonFileProcess(newSubjectInfo);
    let processedState = semesterStateProcess(newSubjectInfo);
    if (!file) return;
    db.collection("files")
      .doc(file.id)
      .update({
        ...processedFile,
        semester: processedState,
      })
      .then((res) => {
        setFile(processedFile);
        setSemesterState(processedState);
        toast.info("Thêm môn học thành công");
      })
      .catch((e) => toast.error("Thêm môn học thất bại"));
  };

  const fillProcess = (newSubjectInfo: Subject) => {
    setFile(commonFileProcess(newSubjectInfo));
    setSemesterState(semesterStateProcess(newSubjectInfo));
    toast.info(
      "Đã thêm môn học trên màn hình. Thông tin chưa được lưu vào CSDL"
    );
  };

  const commonFileProcess = (newSubjectInfo: Subject) => {
    let clonedFile = JSON.parse(JSON.stringify(file));
    for (let s of clonedFile.semester) {
      if (s.id !== semester.id) {
        continue;
      }
      s.subjects = [...s.subjects, newSubjectInfo];
    }
    return clonedFile;
  };

  const semesterStateProcess = (newSubjectInfo: Subject) => {
    let clonedSemesterState = JSON.parse(JSON.stringify(semesterState));
    for (let s of clonedSemesterState) {
      if (s.id !== semester.id) {
        continue;
      }
      s.subjects = [...s.subjects, newSubjectInfo];
    }
    return clonedSemesterState;
  };

  return (
    <div className={classes.root}>
      {user && file && file.isOwner && (
        <div className={classes.toggleButtonCover}>
          <div className={classes.buttonCover}>
            <div
              className={mergeClassNames(classes.button, classes.r)}
              id="button1"
            >
              <input
                type="checkbox"
                className={classes.checkbox}
                checked={edit}
                onChange={(e) => setEdit((old) => !old)}
              />
              <div className={classes.knobs} />
              <div className={classes.layer} />
            </div>
          </div>
        </div>
      )}

      <h2 className={classes.name}>{semester.name}</h2>
      {semester.subjects.length > 0 ? (
        <>
          <div className={classes.subjects}>
            {semester.subjects.map((subject) => (
              <SubjectViewer
                key={subject.id}
                semesterId={semester.id}
                subject={subject}
                edit={edit}
              />
            ))}
          </div>
          <div className={classes.summary}>
            {gpa ? (
              <>
                <p>
                  Điểm trung bình học kì:{" "}
                  <span
                    className={
                      gpa.gpa !== newGPA.gpa && !isNaN(newGPA.gpa)
                        ? classes.lineThrough
                        : ""
                    }
                  >
                    {isNaN(gpa.gpa) ? "Thiếu dữ liệu" : gpa.gpa.toFixed(3)}
                  </span>
                  {gpa.gpa !== newGPA.gpa && !isNaN(newGPA.gpa) && (
                    <span className={classes.newSumary}>
                      {newGPA.gpa.toFixed(3)}
                    </span>
                  )}
                </p>
                <p>
                  Điểm trung bình tích luỹ:{" "}
                  <span
                    className={
                      cpa.gpa !== newCPA.gpa && !isNaN(newCPA.gpa)
                        ? classes.lineThrough
                        : ""
                    }
                  >
                    {isNaN(cpa.gpa) ? "Thiếu dữ liệu" : cpa.gpa.toFixed(3)}
                  </span>
                  {cpa.gpa !== newCPA.gpa && !isNaN(newCPA.gpa) && (
                    <span className={classes.newSumary}>
                      {newCPA.gpa.toFixed(3)}
                    </span>
                  )}
                </p>
                <p>
                  Số tín chỉ đạt:{" "}
                  <span
                    className={
                      gpa.sumOfPassedSubjectCredit !==
                      newGPA.sumOfPassedSubjectCredit
                        ? classes.lineThrough
                        : ""
                    }
                  >
                    {gpa.sumOfPassedSubjectCredit}
                  </span>
                  {gpa.sumOfPassedSubjectCredit !==
                    newGPA.sumOfPassedSubjectCredit && (
                    <span className={classes.newSumary}>
                      {newGPA.sumOfPassedSubjectCredit}
                    </span>
                  )}
                </p>
                <p>
                  Số tín chỉ tích luỹ:{" "}
                  <span
                    className={
                      cpa.sumOfPassedSubjectCredit !==
                      newCPA.sumOfPassedSubjectCredit
                        ? classes.lineThrough
                        : ""
                    }
                  >
                    {cpa.sumOfPassedSubjectCredit}
                  </span>
                  {cpa.sumOfPassedSubjectCredit !==
                    newCPA.sumOfPassedSubjectCredit && (
                    <span className={classes.newSumary}>
                      {newCPA.sumOfPassedSubjectCredit}
                    </span>
                  )}
                </p>
              </>
            ) : (
              <div>Thông tin không đầy đủ</div>
            )}
          </div>
          {edit && (
            <span
              className={classes.addSubjectButton}
              onClick={handleAddSubject}
            >
              <AiFillPlusCircle />
              <span>Thêm môn học</span>
            </span>
          )}
        </>
      ) : (
        <span>Kì học trống</span>
      )}
    </div>
  );
}

export default SemesterViewer;
