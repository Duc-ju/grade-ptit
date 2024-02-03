import React, { useEffect, useState } from "react";
import classes from "./calcPoint.module.css";
import PointTable from "./PointTable1/pointTable";
import { FcNext } from "@react-icons/all-files/fc/FcNext";
// @ts-ignore
import mergeClassNames from "merge-class-names";
import Tags from "../Tags";
import FacebookPage from "../FacebookPage";

const gradeStructs = [
  [0.1, 0.2, 0.2, 0.5],
  [0.1, 0.1, 0.3, 0.5],
  [0.1, 0.1, 0.2, 0.6],
  [0.1, 0.1, 0.1, 0.7],
  [0.1, 0.3, 0.6],
  [0.1, 0.2, 0.7],
  [0.1, 0.1, 0.8],
];

function CalcPoint() {
  const DEFAULT_SELECTED_STRUCT = 2;
  const [selectedStruct, setSelectedStruct] = useState(DEFAULT_SELECTED_STRUCT);

  useEffect(() => {
    document.title = "Grade PTIT | Công cụ tính điểm tổng kết";
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.parentContainer}>
        <div className={classes.topContainer}>
          <div className={classes.container}>
            <div className={classes.header}>
              <h2>Tính điểm tổng kết</h2>
            </div>
            <div className={classes.inputContainer}>
              <select
                onChange={(e) =>
                  setSelectedStruct(Number.parseInt(e.target.value))
                }
                value={selectedStruct}
              >
                <option value={"-1"}>Chọn cấu trúc điểm của môn học</option>
                {gradeStructs.map((gradeStruct, index) => (
                  <option key={index} value={index}>
                    {gradeStruct
                      .filter((i) => i !== 0)
                      .map((i) => (i * 100).toFixed(0))
                      .join("-")}
                  </option>
                ))}
              </select>
            </div>
            <div className={classes.pointTable}>
              {selectedStruct !== -1 && (
                <PointTable gradeStruct={gradeStructs[selectedStruct]} />
              )}
            </div>
          </div>
        </div>
        <div className={classes.aboutContainer}>
          <h3>
            Xin chào các bạn sinh viên. Dưới đây là phần giới thiệu chức năng
            Tính điểm tổng kết (GPA) của môn học, điểm sẽ được quy đổi ra hệ 4,
            và xếp loại điểm.
          </h3>
          <ul className={classes.about}>
            <li>
              <span>
                <FcNext />
                Các bạn hãy chọn cấu trúc điểm của môn học tương ứng với hệ số
                của các điểm thành phần của môn học đó. Ví dụ nếu môn học có 4
                điểm thành phần, hệ số của các điểm lần lượt là 10% 10% 20% 60%
                hãy chọn 10-10-20-60.
              </span>
            </li>
            <li>
              <span>
                <FcNext />
                Điểm tổng kết quy ra hệ 4 và hệ chữ được quy định như sau (điểm
                lẻ do được làm tròn lên hoặc làm tròn xuống):
              </span>
              <div className={classes.mappingTable}>
                <div
                  className={mergeClassNames(classes.headTitle, classes.first)}
                >
                  Điểm hệ 10
                </div>
                <div className={classes.headTitle}>Điểm hệ 4</div>
                <div className={classes.headTitle}>Điểm dạng chữ</div>
                <div className={classes.first}>0 - 3.94</div>
                <div>0.0</div>
                <div>F</div>
                <div className={classes.first}>3.95 - 4.94</div>
                <div>1.0</div>
                <div>D</div>
                <div className={classes.first}>4.95 - 5.44</div>
                <div>1.5</div>
                <div>D+</div>
                <div className={classes.first}>5.45 - 6.44</div>
                <div>2.0</div>
                <div>C</div>
                <div className={classes.first}>6.45 - 6.94</div>
                <div>2.5</div>
                <div>C+</div>
                <div className={classes.first}>6.95 - 7.94</div>
                <div>3.0</div>
                <div>B</div>
                <div className={classes.first}>7.95 - 8.44</div>
                <div>3.5</div>
                <div>B+</div>
                <div className={classes.first}>8.45 - 8.94</div>
                <div>3.7</div>
                <div>A</div>
                <div className={classes.first}>8.95 - 10</div>
                <div>4.0</div>
                <div>A+</div>
              </div>
            </li>
            <li>
              <span>
                <FcNext />
                Ngay sau khi các bạn nhập điểm, hệ thống sẽ tính toán lại điểm
                tổng kết (GPA) của môn học.
              </span>
            </li>
          </ul>
        </div>
        <FacebookPage
          className={classes.facebookPage}
          label={"Đọc thêm về chức năng"}
          url={
            "https://www.facebook.com/gradeptit/posts/pfbid024t5kvncp2ihc4S4yntDNu9Z9ThXsx8kaGtcufFjj5JJKR7brgRgGxeBrsV7aKLJVl"
          }
        />
        <FacebookPage className={classes.facebookPage} />
        <Tags
          tags={[
            "điểm tổng kết",
            "điểm GPA",
            "điểm trung bình",
            "điểm tích luỹ",
            "tính điểm hệ 4",
            "công cụ tính điểm",
            "tính điểm học phần",
            "sinh viên",
            "sinh viên ptit",
            "kết quả học tập",
            "grade ptit",
            "gradeptit",
          ]}
          className={classes.tagContainer}
        />
      </div>
    </div>
  );
}

export default CalcPoint;
