import React, { useContext } from "react";
import classes from "./excelSemesterConvertTool.module.css";
import LoadingButton from "../../common-components/LoadingButton";
import readXlsxFile from "read-excel-file";
import { toast } from "react-toastify";
import { Semester } from "../../entity/semester";
import SemesterSelectPopup, {
  SubjectOption,
} from "./SelemesterSelectPopup/semesterSelectPopup";
import {
  ModalContext,
  ModalContextType,
} from "../../context-api/ModalProvider";
import { FaClipboard } from "@react-icons/all-files/fa/FaClipboard";

function ExcelSemesterConvertTool() {
  const EXCEL_SEMESTER_NAME_POSITION = 0;
  const EXCEL_INDEX_POSITION = 0;
  const EXCEL_CODE_POSITION = 1;
  const EXCEL_NAME_POSITION = 2;
  const EXCEL_CREDIT_POSITION = 3;
  const [semesterContent, setSemesterContent] = React.useState<string>("");
  const semesterFileRef = React.createRef<HTMLInputElement>();
  const { showModal } = useContext(ModalContext) as ModalContextType;
  const handleConvert = (e: any) => {
    readXlsxFile(e.target.files[0])
      .then((rows) => {
        const SubjectOptions: SubjectOption[] = [];
        rows.forEach((row, index) => {
          if (
            row[EXCEL_INDEX_POSITION] &&
            Number.isInteger(row[EXCEL_INDEX_POSITION]) &&
            row[EXCEL_CREDIT_POSITION] &&
            /^[+-]?\d+(\.\d+)?$/.test("" + row[EXCEL_CREDIT_POSITION])
          ) {
            SubjectOptions.push({
              mappingId: row[EXCEL_CODE_POSITION] as string,
              name: row[EXCEL_NAME_POSITION] as string,
            });
          }
        });

        const convertProcess = (selectedSubjectMappingIds: string[]) => {
          const semesters: Semester[] = [];
          let currentSemester: Semester | null = null;
          let currentSemesterIndex = 1;
          let currentSubjectIndex = 1;
          rows.forEach((row, index) => {
            if (
              row[EXCEL_SEMESTER_NAME_POSITION] &&
              typeof row[EXCEL_SEMESTER_NAME_POSITION] === "string" &&
              (row[EXCEL_SEMESTER_NAME_POSITION] as string)
                .toLowerCase()
                .startsWith("học kỳ")
            ) {
              if (currentSemester) {
                semesters.push(currentSemester);
              }
              currentSemester = {
                id: "" + currentSemesterIndex++,
                name: row[EXCEL_SEMESTER_NAME_POSITION] as string,
                subjects: [],
              };
              currentSubjectIndex = 1;
            } else if (
              row[EXCEL_INDEX_POSITION] &&
              Number.isInteger(row[EXCEL_INDEX_POSITION]) &&
              row[EXCEL_CREDIT_POSITION] &&
              /^[+-]?\d+(\.\d+)?$/.test("" + row[EXCEL_CREDIT_POSITION]) &&
              currentSemester
            ) {
              if (
                selectedSubjectMappingIds.includes(
                  row[EXCEL_CODE_POSITION] as string
                )
              ) {
                currentSemester.subjects.push({
                  id: currentSubjectIndex++,
                  name: row[EXCEL_NAME_POSITION] as string,
                  credit: row[EXCEL_CREDIT_POSITION] as number,
                  mappingId: [row[EXCEL_CODE_POSITION] as string],
                });
              }
            } else if (currentSemester) {
              semesters.push(currentSemester);
              currentSemester = null;
            }
          });
          if (!semesters || !semesters.length) {
            throw new Error("Không tìm thấy dữ liệu hợp lệ");
          }
          setSemesterContent(JSON.stringify(semesters, null, 2));
          toast.info("Dữ liệu học kỳ đã được cập nhật trên màn hình");
        };
        showModal(
          <SemesterSelectPopup
            subjectOptions={SubjectOptions}
            convertProcess={convertProcess}
          />
        );
      })
      .catch(() => {
        toast.error("File không đúng định dạng");
      });
  };

  function handleSelectFile() {
    semesterFileRef.current?.click();
  }

  function handleClipboard() {
    navigator.clipboard.writeText(semesterContent).then(() => {
      toast.info("Đã copy vào khay nhớ tạm");
    });
  }

  return (
    <div className={classes.root}>
      <h2>Tạo danh sách học kỳ từ file excel chương trình đào tạo</h2>
      <input
        type={"file"}
        onChange={handleConvert}
        style={{ display: "none" }}
        accept={".xls,.xlsx"}
        ref={semesterFileRef}
      />
      <div className={classes.contentContainer}>
        <textarea
          rows={30}
          cols={100}
          readOnly={true}
          value={semesterContent}
        />
        {!!semesterContent && (
          <span
            className={classes.clipboard}
            onClick={handleClipboard}
            data-tip={"Copy vào khay nhớ tạm"}
          >
            <FaClipboard />
          </span>
        )}
      </div>
      <LoadingButton
        onClick={handleSelectFile}
        className={classes.importButton}
      >
        Chọn file
      </LoadingButton>
    </div>
  );
}

export default ExcelSemesterConvertTool;
