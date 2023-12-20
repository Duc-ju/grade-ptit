import React, { useEffect, useState } from "react";
import classes from "./pointTable.module.css";
// @ts-ignore
import mergeClassNames from "merge-class-names";

function PointTable(props: { gradeStruct: number[] }) {
  const { gradeStruct } = props;
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [points, setPoints] = useState(new Array(gradeStruct.length).fill(""));
  const handleUpdateGrade = (point: string, index: number) => {
    const left = points.slice(0, index);
    const right = points.slice(index + 1, points.length);
    setPoints([...left, point, ...right]);
  };
  const calcPoint = (() => {
    if (points.find((i) => i === "")) return -1;
    return gradeStruct.reduce((store, current, idx) => {
      return store + current * points[idx];
    }, 0);
  })();

  const calcType = (() => {
    if (calcPoint > 10) return;
    if (calcPoint === 0) return "F";
    if (calcPoint && !isNaN(calcPoint)) {
      if (calcPoint >= 8.95) return "A+";
      if (calcPoint >= 8.45) return "A";
      if (calcPoint >= 7.95) return "B+";
      if (calcPoint >= 6.95) return "B";
      if (calcPoint >= 6.45) return "C+";
      if (calcPoint >= 5.45) return "C";
      if (calcPoint >= 4.95) return "D+";
      if (calcPoint >= 3.95) return "D";
      return "F";
    }
  })();
  const rootClass = mergeClassNames(
    classes.table,
    classes[
      `table-` + (gradeStruct.filter((weight) => weight !== 0).length + 1)
    ]
  );
  return (
    <div className={classes.root}>
      <div className={rootClass}>
        {gradeStruct
          .filter((weight) => weight !== 0)
          .map((weight, index) => (
            <div className={classes.heading} key={index}>{`Điểm ${(
              weight * 100
            ).toFixed(0)}%`}</div>
          ))}
        <div className={classes.heading}>Tổng kết</div>
        {gradeStruct
          .filter((weight) => weight !== 0)
          .map((weight, index) => (
            <div key={index} className={classes.inputContainer}>
              <input
                type={"number"}
                placeholder={
                  width > 1024 ? `Điểm ${(weight * 100).toFixed(0)}%` : ""
                }
                value={points[index]}
                onChange={(e) => handleUpdateGrade(e.target.value, index)}
              />
            </div>
          ))}
        <div className={classes.res}>
          <span>
            {calcPoint !== -1 ? calcPoint.toFixed(2) : ""}
            {` ${calcType ? `(${calcType})` : ""}`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PointTable;
