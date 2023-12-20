import React, { useContext, useState } from "react";
import classes from "./subjectForm.module.css";
import ReactTooltip from "react-tooltip";
import {
  ModalContext,
  ModalContextType,
} from "../../context-api/ModalProvider";
// @ts-ignore
import mergeClassNames from "merge-class-names";
import {
  validateNumberOnlyPositive,
  validateRequire,
  validateStringArray,
} from "../../utils/validate";
import { Subject } from "../../entity/subject";
import LoadingButton from "../../common-components/LoadingButton";

function SubjectForm(props: {
  subject: Subject;
  saveProcess: Function;
  fillProcess: Function;
  deleteProcess?: Function;
  isEdit?: boolean;
}) {
  const {
    subject,
    saveProcess,
    fillProcess,
    deleteProcess,
    isEdit = true,
  } = props;
  const [loading, setLoading] = useState(false);
  const { hideModal } = useContext(ModalContext) as ModalContextType;
  const [mappingId, setMappingId] = useState(
    subject.mappingId && subject.mappingId[0]
      ? subject.mappingId.join(", ")
      : ""
  );
  const [mappingIdError, setMappingIdError] = useState("");
  const [name, setName] = useState(subject.name);
  const [nameError, setNameError] = useState("");
  const [credit, setCredit] = useState<string>("" + subject.credit);
  const [creditError, setCreditError] = useState("");
  const clearValidate = () => {
    setMappingIdError("");
    setNameError("");
    setCreditError("");
  };
  const handleChangeMappingId = (e: any) => {
    setMappingId(e.target.value);
    clearValidate();
  };
  const handleChangeName = (e: any) => {
    setName(e.target.value);
    clearValidate();
  };
  const handleChangeCredit = (e: any) => {
    setCredit(e.target.value);
    clearValidate();
  };
  const validate = () => {
    const mappingIdMsg = validateStringArray(mappingId, "mã môn học");
    setMappingIdError(mappingIdMsg || "");
    const nameMsg = validateRequire(name, "Tên môn học");
    setNameError(nameMsg || "");
    const creditMsg = validateNumberOnlyPositive(credit, "Số tín chỉ");
    setCreditError(creditMsg || "");
    if (mappingIdMsg || nameMsg || creditMsg) return false;
    return true;
  };
  const makeNewSubjectInfo = () => {
    const newSubjectInfo = { ...subject } as any;
    if (isEdit && subject.mappingId) {
      newSubjectInfo.oldMappingId = [...subject.mappingId];
    }
    newSubjectInfo.mappingId = mappingId
      .split(",")
      .filter((s) => !!s)
      .map((s) => s.trim().toUpperCase());
    newSubjectInfo.name = name;
    newSubjectInfo.credit = Number.parseInt(credit);
    if (!isEdit) newSubjectInfo.isCustom = true;
    return newSubjectInfo;
  };
  const handleSave = () => {
    setLoading(true);
    if (!validate()) return;
    const newSubjectInfo = makeNewSubjectInfo();
    saveProcess(newSubjectInfo);
    setLoading(false);
    hideModal();
  };
  const handleFill = () => {
    if (!validate()) return;
    const newSubjectInfo = makeNewSubjectInfo();
    fillProcess(newSubjectInfo);
    hideModal();
  };
  const handleCancel = () => {
    hideModal();
  };
  const handleDelete = () => {
    if (deleteProcess) deleteProcess();
    hideModal();
  };
  return (
    <div
      className={mergeClassNames(
        classes.root,
        isEdit ? classes.isEdit : classes.isAdd
      )}
    >
      <h2 className={classes.heading}>
        {isEdit ? "Chỉnh sửa môn học" : "Thêm môn học mới"}
      </h2>
      <div className={classes.container}>
        <div className={classes.changeTable}>
          <div className={classes.tableHeader}></div>
          {isEdit && <div className={classes.tableHeader}>Thông tin cũ</div>}
          <div className={classes.tableHeader}>
            {isEdit ? "Thông tin mới" : "Thông tin môn học"}
          </div>
          <div
            className={mergeClassNames(
              classes.tableContent,
              classes.bold,
              classes.first
            )}
          >
            Mã môn học
          </div>
          {isEdit && (
            <div
              className={mergeClassNames(classes.tableContent, classes.center)}
            >
              {subject.mappingId && subject.mappingId[0]
                ? subject.mappingId.join(", ")
                : "Chưa có mã"}
            </div>
          )}
          <div
            className={mergeClassNames(
              classes.tableContent,
              classes.inputContainer
            )}
          >
            <input
              type={"text"}
              className={mergeClassNames(classes.inputField, classes.center)}
              value={mappingId}
              onChange={handleChangeMappingId}
              data-tip={"Nếu muốn nhập nhiều mã, cách nhau bởi dấu phẩy"}
            />
            {mappingIdError && (
              <span className={classes.errorMsg}>{mappingIdError}</span>
            )}
          </div>
          <div
            className={mergeClassNames(
              classes.tableContent,
              classes.bold,
              classes.first
            )}
          >
            Tên môn học
          </div>
          {isEdit && (
            <div
              className={mergeClassNames(classes.tableContent, classes.center)}
            >
              {subject.name}
            </div>
          )}
          <div
            className={mergeClassNames(
              classes.tableContent,
              classes.center,
              classes.inputContainer
            )}
          >
            <input
              type={"text"}
              className={mergeClassNames(classes.inputField, classes.center)}
              value={name}
              onChange={handleChangeName}
            />
            {nameError && <span className={classes.errorMsg}>{nameError}</span>}
          </div>
          <div
            className={mergeClassNames(
              classes.tableContent,
              classes.bold,
              classes.first
            )}
          >
            Số tín chỉ
          </div>
          {isEdit && (
            <div
              className={mergeClassNames(classes.tableContent, classes.center)}
            >
              {subject.credit}
            </div>
          )}
          <div
            className={mergeClassNames(
              classes.tableContent,
              classes.bold,
              classes.center,
              classes.inputContainer
            )}
          >
            <input
              type={"number"}
              className={mergeClassNames(classes.inputField, classes.center)}
              value={credit}
              onChange={handleChangeCredit}
            />
            {creditError && (
              <span className={classes.errorMsg}>{creditError}</span>
            )}
          </div>
        </div>
        {isEdit && subject.isCustom && (
          <h3 className={classes.customLabel}>Môn học này do bạn thêm</h3>
        )}
        <div className={classes.buttonContainer}>
          <LoadingButton
            fetching={loading}
            className={classes.importButton}
            onClick={handleSave}
            data-tip={"Lưu thông tin vào CSDL và cập nhật trên màn hình"}
          >
            Cập nhật
          </LoadingButton>
          <LoadingButton
            className={classes.fillButton}
            onClick={handleFill}
            data-tip={"Chỉ cập nhật thông tin trên màn hình"}
          >
            Cập nhật màn hình
          </LoadingButton>
          {isEdit && (
            <LoadingButton
              className={classes.cancelButton}
              onClick={handleDelete}
              data-tip={"Xoá môn học"}
            >
              Xoá
            </LoadingButton>
          )}
          {!isEdit && (
            <LoadingButton
              className={classes.cancelButton}
              onClick={handleCancel}
            >
              Huỷ
            </LoadingButton>
          )}
        </div>
      </div>
      <ReactTooltip />
    </div>
  );
}

export default SubjectForm;
