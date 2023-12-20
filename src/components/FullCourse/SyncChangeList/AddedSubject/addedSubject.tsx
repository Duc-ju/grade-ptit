import React from "react";
import classes from "./addedSubject.module.css";
// @ts-ignore
import mergeClassNames from "merge-class-names";
import { SynchronousSubjectChange } from "../synchronousChange";

function AddedSubject(props: { change: SynchronousSubjectChange }) {
  const { change, ...resProps } = props;
  if (!change.newInfo) return null;
  return (
    <div className={classes.changeTable} {...resProps}>
      <div className={classes.tableHeader}></div>
      <div className={classes.tableHeader}>Mã môn học</div>
      <div className={classes.tableHeader}>Tên môn học</div>
      <div className={classes.tableHeader}>Số tín chỉ</div>
      <div
        className={mergeClassNames(
          classes.tableContent,
          classes.first,
          classes.bold
        )}
      >
        Môn thêm mới
      </div>
      <div
        className={mergeClassNames(classes.tableContent, classes.idContainer)}
      >
        {change.newInfo.mappingId &&
          change.newInfo.mappingId.map((id) => <span key={id}>{id}</span>)}
      </div>
      <div className={classes.tableContent}>{change.newInfo.name}</div>
      <div className={mergeClassNames(classes.tableContent, classes.center)}>
        {change.newInfo.credit}
      </div>
    </div>
  );
}

export default AddedSubject;
