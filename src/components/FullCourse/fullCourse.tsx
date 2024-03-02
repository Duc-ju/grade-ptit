import React, { useContext, useEffect, useState } from "react";
import classes from "./fullCourse.module.scss";
import SemesterViewer from "../SemesterViewer";
import { db } from "../../firebase/config";
import { toast } from "react-toastify";
import { addDocument, getFileCount } from "../../firebase/service";
import { useNavigate } from "react-router";
import firebase from "firebase/compat/app";
import {
  ModalContext,
  ModalContextType,
} from "../../context-api/ModalProvider";
import SyncChangeList from "./SyncChangeList";
import hasDiffMappingId from "../../utils/hasDiffMappingId";
import hasSameMappingId from "../../utils/hasSameMappingId";
import ReactTooltip from "react-tooltip";
import readXlsxFile from "read-excel-file";
import ExcelImport from "./ExcelImport";
import { AuthContext, AuthContextType } from "../../context-api/AuthProvider";
import { useSearchParams } from "react-router-dom";
import { MAX_FILE_COUNT } from "../../constrain/constrain";
import { FileContext, FileContextType } from "../../context-api/FileProvider";
import GradeChart from "./GradeChart";
import getSummary from "../../utils/getSummary";
import getSummaryNew from "../../utils/getSummaryNew";
import getDroppedRankInfo from "../../utils/getDroppedRankInfo";
import { AiFillWarning } from "@react-icons/all-files/ai/AiFillWarning";
import getSummaryTarget from "../../utils/getSummaryTarget";
import getRandomInRange from "../../utils/getRandomInRange";
import increaseMark from "../../utils/increaseMark";
import { Semester } from "../../entity/semester";
import { Subject } from "../../entity/subject";
import LoadingButton from "../../common-components/LoadingButton";
import { File } from "../../entity/file";
import { ExcelSubjectChange } from "./ExcelImport/excelImport";
import {
  SynchronousSemesterChange,
  SynchronousSubjectChange,
} from "./SyncChangeList/synchronousChange";
import { getMasterMajor } from "../../master-data/masterData";

function FullCourse() {
  const EXCEL_INDEX_POSITION = 0;
  const EXCEL_CODE_POSITION = 1;
  const EXCEL_MARK_POSITION = 7;
  const { file, setFile, semesterState, setSemesterState } = useContext(
    FileContext
  ) as FileContextType;
  const [saveLoading, setSaveLoading] = useState(false);
  const [duplicateLoading, setDuplicateLoading] = useState(false);
  const importFileRef = React.createRef<HTMLInputElement>();
  const { showModal } = useContext(ModalContext) as ModalContextType;
  const { user } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  useEffect(() => {
    if (user && file && !file.isOwner && id)
      toast.info("Bạn đang xem hồ sơ với tư cách khách");
    else if (!id) toast.info("Bạn đang xem hồ sơ mẫu");
    else if (!user && id)
      toast.info("Khi chưa đăng nhập bạn chỉ có thể xem hồ sơ mẫu");
  }, [file, id, user]);

  const summary = getSummary(semesterState);
  const summaryNew = getSummaryNew(semesterState);
  const handleSave = () => {
    if (!file) return;
    setSaveLoading(true);
    db.collection("files")
      .doc(file.id)
      .update(
        JSON.parse(
          JSON.stringify({
            ...file,
            semester: semesterState,
          })
        )
      )
      .then((res) => toast.info("Cập nhật hồ sơ thành công"))
      .catch((e) => toast.error("Cập nhật thất bại"))
      .finally(() => setSaveLoading(false));
  };
  const handleDuplicate = () => {
    if (!user || !file) return;
    const res = window.confirm(
      "Khi nhân bản hồ sơ, chúng tôi sẽ tạo một hồ sơ mới và do bạn làm chủ. Bạn đồng ý chứ?"
    );
    if (res) {
      getFileCount(user.uid).then((count) => {
        if (count > MAX_FILE_COUNT) {
          toast.error(
            `Mỗi tài khoản chỉ có thể tạo tối đa ${MAX_FILE_COUNT} hồ sơ`
          );
        } else {
          setDuplicateLoading(true);
          const tempFile = JSON.parse(
            JSON.stringify({
              ...file,
              semester: semesterState,
              referId: file.id,
            })
          );
          delete tempFile.id;
          tempFile.fullName = `${tempFile.fullName} (1)`;
          tempFile.root = false;
          tempFile.createAt = firebase.firestore.FieldValue.serverTimestamp();
          tempFile.uid = user.uid;
          addDocument("files", JSON.parse(JSON.stringify(tempFile)))
            .then(function (docRef) {
              toast.info(
                "Nhân bản hồ sơ thành công, bạn đang xem hồ sơ mới tạo"
              );
              navigate("/file-view?id=" + docRef.id);
            })
            .catch((e) => {
              toast.error("Nhân bản hồ sơ thất bại");
            })
            .finally(() => setDuplicateLoading(false));
        }
      });
    }
  };
  const handleReset = () => {
    if (!user || !file) return;
    const res = window.confirm("Bạn có chắc chắn reset lại điểm từ đầu chứ?");
    if (res) {
      db.collection("files")
        .doc(file.id)
        .update(
          JSON.parse(
            JSON.stringify({
              ...file,
              target: "",
              semester: getMasterMajor(file.course, file.major),
            })
          )
        )
        .then((res) => {
          toast.info("Đã reset hồ sơ");
          setSemesterState(getMasterMajor(file.course, file.major));
        })
        .catch((e) => toast.error("Reset hồ sơ thất bại"));
    }
  };

  const asyncCount = (() => {
    if (!file) return 0;
    let count = 0;
    let localSemesters = getMasterMajor(file.course, file.major);
    for (let semesterElement of file.semester) {
      let localSemester = localSemesters.find(
        (s: Semester) => s.id === semesterElement.id
      );
      if (localSemester) {
        for (let subject of semesterElement.subjects) {
          let localSubject = localSemester.subjects.find(
            (s: Subject) =>
              s.id === subject.id ||
              hasSameMappingId(s.mappingId, subject.mappingId)
          );
          if (
            localSubject &&
            (localSubject.name !== subject.name ||
              localSubject.credit !== subject.credit ||
              hasDiffMappingId(localSubject.mappingId, subject.mappingId))
          ) {
            count++;
          }
          if (!localSubject) {
            count++;
          }
        }
        for (let subject of localSemester.subjects) {
          let stateSubject = semesterElement.subjects.find(
            (s) =>
              s.id === subject.id ||
              hasSameMappingId(s.mappingId, subject.mappingId)
          );
          if (!stateSubject) {
            count++;
          }
        }
      }
    }
    return count;
  })();

  const handleSync = () => {
    // check if it has no change => Show info message
    if (asyncCount === 0) {
      toast.info("Hồ sơ của bạn đã bao gồm những thông tin mới nhất!");
      return;
    }
    // get list change Subject
    let changeList: SynchronousSemesterChange[] = [];
    let clonedFile = JSON.parse(
      JSON.stringify({
        ...file,
        semester: semesterState,
      })
    );
    let localSemesters = getMasterMajor(clonedFile.course, clonedFile.major);
    for (let semesterElement of clonedFile.semester) {
      let localSemester = localSemesters.find(
        (s: Semester) => s.id === semesterElement.id
      );
      let changeObject: SynchronousSubjectChange[] = [];
      if (localSemester) {
        for (let subject of semesterElement.subjects) {
          let localSubject = localSemester.subjects.find(
            (s: Subject) =>
              s.id === subject.id ||
              hasSameMappingId(s.mappingId, subject.mappingId)
          );
          if (
            localSubject &&
            (localSubject.name !== subject.name ||
              localSubject.credit !== subject.credit ||
              hasDiffMappingId(localSubject.mappingId, subject.mappingId))
          ) {
            // if already has => add new updated change
            changeObject.push({
              oldInfo: { ...subject },
              newInfo: localSubject,
              type: "update",
              id: subject.mappingIp || subject.id,
            });
            subject.name = localSubject.name;
            subject.credit = localSubject.credit;
            subject.mappingId = localSubject.mappingId;
          }
          // if not have local subject => add deleted change
          if (!localSubject) {
            changeObject.push({
              oldInfo: { ...subject },
              type: "delete",
              id: subject.mappingId || subject.id,
            });
          }
        }
        for (let subject of localSemester.subjects) {
          let stateSubject = semesterElement.subjects.find(
            (s: Subject) =>
              s.id === subject.id ||
              hasSameMappingId(s.mappingId, subject.mappingId)
          );
          // if not have state subject => add new added change
          if (!stateSubject) {
            changeObject.push({
              newInfo: { ...subject },
              type: "add",
              id: subject.mappingId || subject.id,
            });
            semesterElement.subjects.push(subject);
          }
        }
      }
      // add new item to change list
      if (changeObject.length > 0) {
        changeList.push({
          semester: {
            id: semesterElement.id,
            name: semesterElement.name,
          },
          changes: changeObject,
        });
      }
    }

    // handle delete subject
    for (let semesterElement of clonedFile.semester) {
      let clonedSubjects = [...semesterElement.subjects];
      let changeSemester = changeList.find(
        (c) => c.semester.id === semesterElement.id
      );
      if (changeSemester) {
        for (let subject of semesterElement.subjects) {
          let checkDeleted = changeSemester.changes.find((c) => {
            return (
              (c.id === subject.id ||
                hasSameMappingId(
                  c.oldInfo?.mappingId || c.newInfo?.mappingId,
                  subject.mappingId
                ) ||
                (c.oldInfo && c.oldInfo.id === subject.id)) &&
              c.type === "delete"
            );
          });
          if (checkDeleted) {
            clonedSubjects = clonedSubjects.filter(
              (s) =>
                s.id !== subject.id &&
                hasDiffMappingId(s.mappingId, subject.mappingId)
            );
          }
        }
      }
      semesterElement.subjects = clonedSubjects;
    }

    // check if it has no change => Show info message
    if (changeList.length === 0) {
      toast.info("Hồ sơ của bạn đã bao gồm những thông tin mới nhất!");
      return;
    }
    let processSemester = processSemesterState(clonedFile, true);
    // check if it has change => Show modal
    showModal(
      <SyncChangeList
        changeList={changeList}
        syncProcess={() => syncProcess(clonedFile, processSemester)}
        fillProcess={() => {
          setFile({
            ...clonedFile,
            semester: processSemester,
          });
          setSemesterState(processSemester);
        }}
      />
    );
  };
  const syncProcess = (
    handledFile: File,
    handledSemesterProcess: Semester[]
  ) => {
    if (!file) return;
    setSaveLoading(true);
    db.collection("files")
      .doc(file.id)
      .update({
        ...handledFile,
        semester: handledSemesterProcess,
      })
      .then((res) => {
        setFile(handledFile);
        setSemesterState(handledFile.semester);
        toast.info("Đồng bộ môn học thành công");
      })
      .catch((e) => toast.error("Đồng bộ môn học thất bại"))
      .finally(() => setSaveLoading(false));
  };

  const handleSelectFile = () => {
    importFileRef.current?.click();
  };

  const handleImport = (e: any) => {
    readXlsxFile(e.target.files[0])
      .then((rows) => {
        rows = rows.filter(
          (row) =>
            row.length >= 8 &&
            row[EXCEL_MARK_POSITION] !== null &&
            row[EXCEL_MARK_POSITION] !== undefined &&
            Number.isInteger(row[EXCEL_INDEX_POSITION]) &&
            !Number.isNaN(row[EXCEL_MARK_POSITION]) &&
            [0, 1, 1.5, 2, 2.5, 3, 3.5, 3.7, 4].includes(
              Number.parseInt(row[EXCEL_MARK_POSITION].toString())
            )
        );
        if (rows.length === 0) {
          toast.error("File không đúng định dạng");
          return;
        }
        let markMap = new Map();
        rows.forEach((row) => {
          if (!markMap.has(row[EXCEL_CODE_POSITION])) {
            markMap.set(row[EXCEL_CODE_POSITION], row[EXCEL_MARK_POSITION]);
          } else {
            let mark = markMap.get(row[EXCEL_CODE_POSITION]);
            if (mark < row[EXCEL_MARK_POSITION]) {
              mark = row[EXCEL_MARK_POSITION];
            }
            markMap.delete(row[EXCEL_CODE_POSITION]);
            markMap.set(row[EXCEL_CODE_POSITION], mark);
          }
        });
        let clonedFile = JSON.parse(
          JSON.stringify({
            ...file,
            semester: semesterState,
          })
        );
        let changeList = [];
        for (let semesterElement of clonedFile.semester) {
          let changeObject: ExcelSubjectChange[] = [];
          for (let subject of semesterElement.subjects) {
            if (subject.mappingId && subject.mappingId.length) {
              subject.mappingId.forEach((id: string) => {
                if (subject.mappingId && markMap.has(id)) {
                  let newMark = markMap.get(id);
                  changeObject.push({
                    oldInfo: { ...subject },
                    newMark: newMark,
                  });
                  subject.mark = newMark;
                }
              });
            }
          }
          // add new item to change list
          if (changeObject.length > 0) {
            changeList.push({
              semester: {
                id: semesterElement.id,
                name: semesterElement.name,
              },
              changes: changeObject,
            });
          }
        }
        if (changeList.length === 0) {
          toast.error(
            "File không đúng định dạng hoặc hồ sơ của bạn chưa được cập nhật mới nhất"
          );
          return;
        }
        let newSemesterState = processSemesterState(clonedFile, false);
        showModal(
          <ExcelImport
            changeList={changeList}
            importProcess={() => importProcess(clonedFile, newSemesterState)}
            fillProcess={() => {
              setFile({
                ...clonedFile,
                semester: newSemesterState,
              });
              setSemesterState(newSemesterState);
            }}
          />
        );
      })
      .catch((e) => {
        toast.error("File không đúng định dạng");
      });
  };

  const importProcess = (handledFile: File, newSemesterState: Semester[]) => {
    if (!file) return;
    db.collection("files")
      .doc(file.id)
      .update({
        ...handledFile,
        semester: newSemesterState,
      })
      .then((res) => {
        setFile(handledFile);
        setSemesterState(newSemesterState);
        toast.info("Import điểm thành công");
      })
      .catch((e) => toast.error("Import điểm thất bại"));
  };

  const processSemesterState = (handledFile: File, updateRootMark: boolean) => {
    let newSemesterState = JSON.parse(JSON.stringify(handledFile.semester));
    for (let semester of newSemesterState) {
      let oldSemester = semesterState.find((s) => s.id === semester.id);
      if (!oldSemester) continue;
      let newSubjects = [];
      for (let subject of semester.subjects) {
        let oldSubject = oldSemester.subjects.find(
          (s) =>
            s.id === subject.id ||
            hasSameMappingId(s.mappingId, subject.mappingId)
        );
        if (oldSubject) {
          if (updateRootMark) {
            subject.mark = oldSubject.mark;
          }
          subject.newSumary = oldSubject.newMark;
        }
        newSubjects.push(subject);
      }
      semester.subjects = newSubjects;
    }
    return JSON.parse(JSON.stringify(newSemesterState));
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const droppedRankInfo = getDroppedRankInfo(semesterState);

  const calculateTarget = (e: any) => {
    if (!file) return;
    const newSemesterState = JSON.parse(JSON.stringify(semesterState));
    let studiedSubjects: Subject[] = [];
    newSemesterState.forEach((semester: Semester) => {
      studiedSubjects.push(
        ...semester.subjects.filter(
          (subject) => subject.mark !== undefined && subject.mark !== null
        )
      );
    });
    if (!studiedSubjects.length) return;
    studiedSubjects = studiedSubjects.map((subject) => {
      subject.targetMark = undefined;
      return subject;
    });
    let currentTarget = e.target.value;
    file.target = currentTarget ? Number.parseFloat(currentTarget) : undefined;
    if (!currentTarget) {
      setSemesterState(newSemesterState);
      return;
    }
    const target = Number.parseFloat(currentTarget);
    let t = 0;
    while (t++ < 10000 && getSummaryTarget(newSemesterState).average < target) {
      let randIndex = getRandomInRange(0, studiedSubjects.length - 1);
      studiedSubjects[randIndex].targetMark = increaseMark(
        studiedSubjects[randIndex].newMark
          ? studiedSubjects[randIndex].newMark
          : studiedSubjects[randIndex].mark
      );
    }
    setSemesterState(newSemesterState);
    toast.info("Điểm mục tiêu đã cập nhật trên màn hình");
  };

  if (!file) return null;

  return (
    <div className={classes.root}>
      <div className={classes.control}>
        {semesterState && (
          <div className={classes.resetContainer}>
            {file.isOwner && (
              <div className={classes.buttonTopGroup}>
                <button onClick={handleReset} className={classes.reset}>
                  Reset tất cả điểm
                </button>
                <input
                  type={"file"}
                  onChange={handleImport}
                  style={{ display: "none" }}
                  accept={".xls,.xlsx"}
                  ref={importFileRef}
                />
                <button
                  onClick={handleSync}
                  className={classes.sync}
                  data-tip={
                    asyncCount > 0
                      ? `Có ${asyncCount} cập nhật mới, click để xem chi tiết`
                      : "Không có môn học nào cần đồng bộ"
                  }
                >
                  Đồng bộ môn học
                  {asyncCount > 0 && (
                    <span className={classes.asyncCount}>{asyncCount}</span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <GradeChart />
      <div className={classes.targetContainer}>
        <h3>Đặt mục tiêu</h3>
        <select
          className={classes.target}
          onChange={calculateTarget}
          value={file.target}
        >
          <option value={""}>Đặt mục tiêu</option>
          {summaryNew.average < 2.5 && <option value={"2.5"}>Bằng khá</option>}
          {summaryNew.average < 3.2 && <option value={"3.2"}>Bằng giỏi</option>}
          {summaryNew.average < 3.7 && (
            <option value={"3.7"}>Bằng xuất sắc</option>
          )}
        </select>
      </div>
      {semesterState && (
        <>
          <div className={classes.semester}>
            {semesterState.map((semester, index) => (
              <SemesterViewer
                key={semester.id}
                semester={semester}
                semesterIndex={index}
              />
            ))}
            {droppedRankInfo.isDropped && summaryNew.average >= 3.2 && (
              <div className={classes.droppedInfo}>
                <AiFillWarning />
                {`Bạn đã trượt ${
                  droppedRankInfo.failedCount
                } tín chỉ. Tổng số tín chỉ ngành của bạn là ${
                  droppedRankInfo.totalCount
                }, số tín chỉ tối đa có thể trượt mà không bị hạ bằng là ${
                  droppedRankInfo.maxFailPercent
                }%, tương ứng với ${
                  droppedRankInfo.maxFailCredit
                } tín chỉ. Rất có thể bạn sẽ bị hạ bằng từ ${
                  summaryNew.average >= 3.6 ? "xuất sắc" : "giỏi"
                } xuống ${
                  summaryNew.average >= 3.6 ? "giỏi" : "khá"
                }. Hãy tìm hiểu thêm nhé.`}
              </div>
            )}
          </div>

          <div className={classes.summary}>
            <h2 className={classes.footerTitle}>Thông tin điểm tích luỹ</h2>
            {!isNaN(summary.average) ? (
              <>
                <p>
                  Điểm trung bình tích luỹ:{" "}
                  <span
                    className={
                      summary.average !== summaryNew.average
                        ? classes.lineThrough
                        : ""
                    }
                  >
                    {summary.average.toFixed(3)}
                  </span>
                  {summary.average !== summaryNew.average && (
                    <span className={classes.newSumary}>
                      {summaryNew.average.toFixed(3)}
                    </span>
                  )}
                </p>
                <p>
                  Số tín chỉ tích luỹ:{" "}
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
              </>
            ) : (
              <div className={classes.error}>Thiếu dữ liệu</div>
            )}
            <p className={classes.bottomButton}>
              {user && file.isOwner && (
                <LoadingButton
                  onClick={handleSave}
                  className={classes.saveButton}
                  fetching={saveLoading}
                >
                  Lưu hồ sơ
                </LoadingButton>
              )}
              {user && file.isOwner && (
                <LoadingButton
                  onClick={handleSelectFile}
                  className={classes.importButton}
                >
                  Import điểm
                </LoadingButton>
              )}
              {user && (
                <LoadingButton
                  onClick={handleDuplicate}
                  className={classes.duplicateButton}
                  fetching={duplicateLoading}
                >
                  Nhân bản hồ sơ
                </LoadingButton>
              )}
              {!user && (
                <LoadingButton
                  onClick={handleLoginRedirect}
                  className={classes.duplicateButton}
                >
                  Đăng nhập và tạo hồ sơ của riêng bạn
                </LoadingButton>
              )}
              {user && !id && (
                <LoadingButton
                  onClick={handleLoginRedirect}
                  className={classes.duplicateButton}
                >
                  Tạo hồ sơ của riêng bạn
                </LoadingButton>
              )}
            </p>
          </div>
        </>
      )}
      <ReactTooltip />
    </div>
  );
}

export default FullCourse;
