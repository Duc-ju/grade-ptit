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
import getSummarySemester from "../../utils/getSummarySemester";
import getSummaryNewSemester from "../../utils/getSummaryNewSemester";
import getSummarySemesterGroup from "../../utils/getSummarySemesterGroup";
import getSummaryNewSemesterGroup from "../../utils/getSummaryNewSemesterGroup";
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

  const summary = getSummarySemester(semester);
  const summaryNew = getSummaryNewSemester(semester);

  const summaryGroup = getSummarySemesterGroup(semesterIndex, semesterState);
  const summaryGroupNew = getSummaryNewSemesterGroup(
    semesterIndex,
    semesterState
  );

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
            {summary ? (
              <>
                <p>
                  Điểm trung bình học kì:{" "}
                  <span
                    className={
                      summary.average !== summaryNew.average &&
                      !isNaN(summaryNew.average)
                        ? classes.lineThrough
                        : ""
                    }
                  >
                    {isNaN(summary.average)
                      ? "Thiếu dữ liệu"
                      : summary.average.toFixed(3)}
                  </span>
                  {summary.average !== summaryNew.average &&
                    !isNaN(summaryNew.average) && (
                      <span className={classes.newSumary}>
                        {summaryNew.average.toFixed(3)}
                      </span>
                    )}
                </p>
                <p>
                  Điểm trung bình tích luỹ:{" "}
                  <span
                    className={
                      summaryGroup.average !== summaryGroupNew.average &&
                      !isNaN(summaryGroupNew.average)
                        ? classes.lineThrough
                        : ""
                    }
                  >
                    {isNaN(summaryGroup.average)
                      ? "Thiếu dữ liệu"
                      : summaryGroup.average.toFixed(3)}
                  </span>
                  {summaryGroup.average !== summaryGroupNew.average &&
                    !isNaN(summaryGroupNew.average) && (
                      <span className={classes.newSumary}>
                        {summaryGroupNew.average.toFixed(3)}
                      </span>
                    )}
                </p>
                <p>
                  Số tín chỉ đạt:{" "}
                  <span
                    className={
                      summary.sumPass !== summaryNew.sumPass
                        ? classes.lineThrough
                        : ""
                    }
                  >
                    {summary.sumPass}
                  </span>
                  {summary.sumPass !== summaryNew.sumPass && (
                    <span className={classes.newSumary}>
                      {summaryNew.sumPass}
                    </span>
                  )}
                </p>
                <p>
                  Số tín chỉ tích luỹ:{" "}
                  <span
                    className={
                      summaryGroup.sumPass !== summaryGroupNew.sumPass
                        ? classes.lineThrough
                        : ""
                    }
                  >
                    {summaryGroup.sumPass}
                  </span>
                  {summaryGroup.sumPass !== summaryGroupNew.sumPass && (
                    <span className={classes.newSumary}>
                      {summaryGroupNew.sumPass}
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
