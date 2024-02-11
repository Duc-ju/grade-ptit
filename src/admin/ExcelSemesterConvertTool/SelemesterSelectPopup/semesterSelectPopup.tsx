import React, { useContext } from "react";
import classes from "./semesterSelectPopup.module.css";
import LoadingButton from "../../../common-components/LoadingButton";
import {
  ModalContext,
  ModalContextType,
} from "../../../context-api/ModalProvider";

export interface SubjectOption {
  mappingId: string;
  name: string;
}

export interface SemesterSelectPopupProps {
  subjectOptions: SubjectOption[];
  convertProcess: (selectedSubjectMappingIds: string[]) => void;
}

function SemesterSelectPopup(props: SemesterSelectPopupProps) {
  const [mappingIds, setMappingIds] = React.useState<string[]>(
    props.subjectOptions.map((subjectOption) => subjectOption.mappingId)
  );
  const { hideModal } = useContext(ModalContext) as ModalContextType;
  const handleConfirm = () => {
    props.convertProcess(mappingIds);
    hideModal();
  };
  return (
    <div className={classes.root}>
      <h2 className={classes.heading}>Chọn môn học có tính điểm tích luỹ</h2>
      <div className={classes.subjectList}>
        {props.subjectOptions.map((subjectOption, index) => (
          <div key={index} className={classes.subject}>
            <input
              type={"checkbox"}
              id={subjectOption.mappingId}
              value={subjectOption.mappingId}
              onChange={(e) => {
                if (e.target.checked) {
                  setMappingIds([...mappingIds, e.target.value]);
                } else {
                  setMappingIds(
                    mappingIds.filter((id) => id !== e.target.value)
                  );
                }
              }}
              checked={mappingIds.includes(subjectOption.mappingId)}
            />
            <label htmlFor={subjectOption.mappingId}>
              {subjectOption.name}
            </label>
          </div>
        ))}
      </div>
      <div className={classes.buttonContainer}>
        <LoadingButton
          fetching={false}
          className={classes.convertProcessButton}
          onClick={handleConfirm}
        >
          Tạo dữ liệu
        </LoadingButton>
      </div>
    </div>
  );
}

export default SemesterSelectPopup;
