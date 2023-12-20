import React, { useContext } from "react";
import classes from "./subjectViewer.module.scss";
import hasSameMappingId from "../../utils/hasSameMappingId";
import { AiOutlineEdit } from "@react-icons/all-files/ai/AiOutlineEdit";
// @ts-ignore
import mergeClassNames from "merge-class-names";
import ReactTooltip from "react-tooltip";
import { FileContext, FileContextType } from "../../context-api/FileProvider";
import {
  ModalContext,
  ModalContextType,
} from "../../context-api/ModalProvider";
import SubjectForm from "../SubjectForm";
import { toast } from "react-toastify";
import { db } from "../../firebase/config";
import hasDiffMappingId from "../../utils/hasDiffMappingId";
import { Subject } from "../../entity/subject";
import { Semester } from "../../entity/semester";

function SubjectViewer(props: {
  subject: Subject;
  semesterId: string;
  edit: boolean;
}) {
  const { subject, semesterId, edit } = props;
  const { file, setFile, setSemesterState, semesterState } = useContext(
    FileContext
  ) as FileContextType;
  const markMap = {
    0: "F",
    1: "D",
    1.5: "D+",
    2: "C",
    2.5: "C+",
    3: "B",
    3.5: "B+",
    3.7: "A",
    4: "A+",
  };
  const { showModal } = useContext(ModalContext) as ModalContextType;
  const handleChangeOldMark = (e: any) => {
    setSemesterState((semesterState: Semester[]) => {
      const newState = [...semesterState];
      const newSemester = newState.find((s) => s.id === semesterId);
      if (!newSemester) return semesterState;
      const newSubject = newSemester.subjects.find(
        (s) =>
          s.id === subject.id ||
          hasSameMappingId(s.mappingId, subject.mappingId)
      );
      if (newSubject) {
        newSubject.mark =
          e.target.value === "" ? undefined : parseFloat(e.target.value);
        newSubject.newMark = undefined;
      }
      return newState;
    });
  };
  const handleChangeNewMark = (e: any) => {
    setSemesterState((semesterState) => {
      const newState = [...semesterState];
      const newSemester = newState.find((s) => s.id === semesterId);
      if (!newSemester) return semesterState;
      const newSubject = newSemester.subjects.find(
        (s) =>
          s.id === subject.id ||
          hasSameMappingId(s.mappingId, subject.mappingId)
      );
      if (newSubject) {
        newSubject.newMark = parseFloat(e.target.value);
      }
      return newState;
    });
  };
  const handleEditSubject = () => {
    showModal(
      <SubjectForm
        subject={subject}
        saveProcess={editSubjectProcess}
        fillProcess={fillProcess}
        deleteProcess={() => deleteProcess(subject)}
      />
    );
  };
  const editSubjectProcess = (newSubjectInfo: Subject) => {
    if (!file) return;
    let processedFile = commonFileProcess(newSubjectInfo);
    let processedState = semesterStateProcess(newSubjectInfo);
    db.collection("files")
      .doc(file.id)
      .update({
        ...processedFile,
        semester: processedState,
      })
      .then((res) => {
        setFile(processedFile);
        setSemesterState(processedState);
        toast.info("Cập nhật môn học thành công");
      })
      .catch((e) => toast.error("Cập nhật môn học thất bại"));
  };
  const fillProcess = (newSubjectInfo: Subject) => {
    let processedFile = commonFileProcess(newSubjectInfo);
    let processedState = semesterStateProcess(newSubjectInfo);
    setFile(processedFile);
    setSemesterState(processedState);
    toast.info(
      "Đã cập nhật môn học trên màn hình. Thông tin chưa được lưu vào CSDL"
    );
  };
  const commonFileProcess = (newSubjectInfo: Subject) => {
    let clonedFile = JSON.parse(JSON.stringify(file));
    for (let semester of clonedFile.semester) {
      if (semester.id !== semesterId) {
        continue;
      }
      let newSubjects = [];
      for (let subject of semester.subjects) {
        if (
          subject.id !== newSubjectInfo.id &&
          !hasSameMappingId(subject.mappingId, newSubjectInfo.oldMappingId)
        ) {
          newSubjects.push(subject);
        } else {
          newSubjects.push(JSON.parse(JSON.stringify(newSubjectInfo)));
        }
      }
      semester.subjects = newSubjects;
    }
    return clonedFile;
  };
  const semesterStateProcess = (newSubjectInfo: Subject) => {
    let clonedSemesterState = JSON.parse(JSON.stringify(semesterState));
    for (let semester of clonedSemesterState) {
      if (semester.id !== semesterId) {
        continue;
      }
      let newSubjects = [];
      for (let subject of semester.subjects) {
        if (
          subject.id !== newSubjectInfo.id &&
          !hasSameMappingId(subject.mappingId, newSubjectInfo.oldMappingId)
        ) {
          newSubjects.push(subject);
        } else {
          newSubjects.push(JSON.parse(JSON.stringify(newSubjectInfo)));
        }
      }
      semester.subjects = newSubjects;
    }
    return clonedSemesterState;
  };
  const deleteProcess = (subject: Subject) => {
    let clonedFile = JSON.parse(JSON.stringify(file));
    for (let semester of clonedFile.semester) {
      if (semester.id !== semesterId) {
        continue;
      }
      semester.subjects = semester.subjects.filter(
        (subject: Subject) =>
          subject.id !== subject.id &&
          hasDiffMappingId(subject.mappingId, subject.mappingId)
      );
    }
    setFile(clonedFile);
    let clonedSemesterState = JSON.parse(JSON.stringify(semesterState));
    for (let semester of clonedSemesterState) {
      if (semester.id !== semesterId) {
        continue;
      }
      semester.subjects = semester.subjects.filter(
        (subject: Subject) =>
          subject.id !== subject.id &&
          hasDiffMappingId(subject.mappingId, subject.mappingId)
      );
    }
    setSemesterState(clonedSemesterState);
    toast.info(
      "Đã xoá môn học trên màn hình. Thông tin chưa được lưu vào CSDL"
    );
  };

  return (
    <div className={mergeClassNames(classes.root, edit ? classes.edit : "")}>
      {edit && (
        <span
          className={classes.editButton}
          data-tip={"Chỉnh sửa môn học"}
          onClick={handleEditSubject}
        >
          <AiOutlineEdit />
        </span>
      )}
      <div className={classes.container}>
        <div className={classes.info}>
          <h2>{subject.name}</h2>
          <span className={classes.badge}>{`${subject.credit} tín chỉ`}</span>
        </div>
        <div className={classes.value}>
          <select
            onChange={handleChangeOldMark}
            value={subject.mark !== undefined ? subject.mark + "" : ""}
          >
            <option value="">Điểm hiện tại</option>
            <option value="4">A+</option>
            <option value="3.7">A</option>
            <option value="3.5">B+</option>
            <option value="3">B</option>
            <option value="2.5">C+</option>
            <option value="2">C</option>
            <option value="1.5">D+</option>
            <option value="1">D</option>
            <option value="0">Trượt</option>
          </select>
          {((!!subject.mark && subject.mark !== 4) || subject.mark === 0) && (
            <select
              onChange={handleChangeNewMark}
              value={subject.newMark ? subject.newMark + "" : ""}
            >
              <option value="">Điểm cải thiện</option>
              {((subject.mark && subject.mark < 4) || !subject.mark) && (
                <option value="4">A+</option>
              )}
              {((subject.mark && subject.mark < 3.7) || !subject.mark) && (
                <option value="3.7">A</option>
              )}
              {((subject.mark && subject.mark < 3.5) || !subject.mark) && (
                <option value="3.5">B+</option>
              )}
              {((subject.mark && subject.mark < 3) || !subject.mark) && (
                <option value="3">B</option>
              )}
              {((subject.mark && subject.mark < 2.5) || !subject.mark) && (
                <option value="2.5">C+</option>
              )}
              {((subject.mark && subject.mark < 2) || !subject.mark) && (
                <option value="2">C</option>
              )}
              {((subject.mark && subject.mark < 1.5) || !subject.mark) && (
                <option value="1.5">D+</option>
              )}
              {((subject.mark && subject.mark < 1) || !subject.mark) && (
                <option value="1">D</option>
              )}
            </select>
          )}
          {subject.targetMark && (markMap as any)[subject.targetMark] && (
            <span className={classes.target}>
              Mục tiêu:{" "}
              <span className={classes.targetMark}>
                {(markMap as any)[subject.targetMark]}
              </span>
            </span>
          )}
        </div>
      </div>
      <ReactTooltip />
    </div>
  );
}

export default SubjectViewer;
