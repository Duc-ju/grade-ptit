import React, { useContext, useState } from "react";
import classes from "./syncChangeList.module.css";
import {
  ModalContext,
  ModalContextType,
} from "../../../context-api/ModalProvider";
import ChangedSubject from "./ChangedSubject";
import AddedSubject from "./AddedSubject";
import DeletedSubject from "./DeletedSubject";
import { toast } from "react-toastify";
import ReactTooltip from "react-tooltip";
import { SynchronousSemesterChange } from "./synchronousChange";
import LoadingButton from "../../../common-components/LoadingButton";

function SyncChangeList(props: {
  changeList: SynchronousSemesterChange[];
  syncProcess: Function;
  fillProcess: Function;
}) {
  const { changeList, syncProcess, fillProcess } = props;
  const [updateLoading, setUpdateLoading] = useState(false);
  const { hideModal } = useContext(ModalContext) as ModalContextType;

  const handleSync = () => {
    setUpdateLoading(true);
    syncProcess();
    hideModal();
    setUpdateLoading(false);
  };

  const handleFill = () => {
    hideModal();
    fillProcess();
    toast.info(
      "Đã cập nhật thông tin môn học trên màn hình, thông tin chưa được lưu trong CSDL"
    );
  };

  const handleCancel = () => {
    hideModal();
  };

  const makeKey = (key: string[] | number) => {
    if (typeof key === "object") return key.join("-");
    return "" + key;
  };

  return (
    <div className={classes.root}>
      <h2 className={classes.heading}>Danh sách môn học đã được cập nhật</h2>
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
                switch (change.type) {
                  case "update":
                    return (
                      <ChangedSubject
                        change={change}
                        key={makeKey(change.id)}
                      />
                    );
                  case "add":
                    return (
                      <AddedSubject change={change} key={makeKey(change.id)} />
                    );
                  case "delete":
                    return (
                      <DeletedSubject
                        change={change}
                        key={makeKey(change.id)}
                      />
                    );
                  default:
                    return null;
                }
              })}
            </div>
          </div>
        ))}
        <div className={classes.buttonContainer}>
          <LoadingButton
            fetching={updateLoading}
            className={classes.updateButton}
            onClick={handleSync}
            data-tip={"Lưu thông tin vào CSDL và cập nhật trên màn hình"}
          >
            Cập nhật
          </LoadingButton>
          <LoadingButton
            className={classes.fillButton}
            onClick={handleFill}
            data-tip={"Chỉ cập nhật thông tin trên màn hình"}
          >
            Cập nhật trên màn hình
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

export default SyncChangeList;
