import React, { useContext, useState } from "react";
import {
  ModalContext,
  ModalContextType,
} from "../../../context-api/ModalProvider";
import classes from "./excelImport.module.css";
// @ts-ignore
import mergeClassNames from "merge-class-names";
import { toast } from "react-toastify";
import ReactTooltip from "react-tooltip";
import { Subject } from "../../../entity/subject";
import LoadingButton from "../../../common-components/LoadingButton";

export interface ExcelSubjectChange {
  oldInfo: Subject;
  newMark: number;
}

export interface ExcelSemesterChange {
  semester: {
    id: number;
    name: string;
  };
  changes: ExcelSubjectChange[];
}

function ExcelImport(props: {
  changeList: ExcelSemesterChange[];
  importProcess: Function;
  fillProcess: Function;
}) {
  const { changeList, importProcess, fillProcess } = props;
  const [importLoading, setImportLoading] = useState(false);
  const { hideModal } = useContext(ModalContext) as ModalContextType;

  const handleImport = () => {
    setImportLoading(true);
    importProcess();
    hideModal();
    setImportLoading(false);
  };

  const handleFill = () => {
    hideModal();
    fillProcess();
    toast.info(
      "Đã cập nhật điểm đọc từ file lên màn hình, thông tin chưa được lưu trong CSDL"
    );
  };

  const handleCancel = () => {
    hideModal();
  };

  return (
    <div className={classes.root}>
      <h2 className={classes.heading}>Danh sách điểm đọc từ file</h2>
      <div className={classes.container}>
        {changeList.map((changeData) => (
          <div
            className={classes.semesterContainer}
            key={changeData.semester.id}
          >
            <h3 className={classes.semesterTitle}>
              {changeData.semester.name}
            </h3>
            <div className={classes.subjectContainer}>
              {changeData.changes.map((change) => {
                return (
                  <div
                    key={
                      change.oldInfo.mappingId?.join("-") || change.oldInfo.id
                    }
                    className={classes.changeTable}
                  >
                    <div className={classes.tableHeader}>Mã môn học</div>
                    <div className={classes.tableHeader}>Tên môn học</div>
                    <div className={classes.tableHeader}>Điểm hiện tại</div>
                    <div className={classes.tableHeader}>Điểm từ file</div>
                    <div
                      className={mergeClassNames(
                        classes.tableContent,
                        classes.first,
                        classes.idContainer
                      )}
                    >
                      {change.oldInfo.mappingId &&
                        change.oldInfo.mappingId.map((id) => (
                          <span key={id}>{id}</span>
                        ))}
                    </div>
                    <div className={classes.tableContent}>
                      {change.oldInfo.name}
                    </div>
                    <div
                      className={mergeClassNames(
                        classes.tableContent,
                        classes.center
                      )}
                    >
                      {!change.oldInfo.mark && change.oldInfo.mark !== 0
                        ? "Chưa nhập"
                        : change.oldInfo.mark}
                    </div>
                    <div
                      className={mergeClassNames(
                        classes.tableContent,
                        classes.bold,
                        classes.center,
                        change.oldInfo.mark !== change.newMark
                          ? classes.changed
                          : ""
                      )}
                    >
                      {change.newMark}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div className={classes.buttonContainer}>
          <LoadingButton
            fetching={importLoading}
            className={classes.importButton}
            onClick={handleImport}
            data-tip={"Lưu thông tin vào CSDL và cập nhật trên màn hình"}
          >
            Import điểm
          </LoadingButton>
          <LoadingButton
            className={classes.fillButton}
            onClick={handleFill}
            data-tip={"Chỉ cập nhật thông tin trên màn hình"}
          >
            Cập nhật màn hình
          </LoadingButton>
          <LoadingButton
            className={classes.cancelButton}
            onClick={handleCancel}
          >
            Huỷ
          </LoadingButton>
        </div>
      </div>
      <ReactTooltip />
    </div>
  );
}

export default ExcelImport;
