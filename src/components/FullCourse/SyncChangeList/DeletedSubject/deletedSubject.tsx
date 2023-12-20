import React from "react";
import classes from "./deletedSubject.module.css";
// @ts-ignore
import mergeClassNames from "merge-class-names";
import { SynchronousSubjectChange } from "../synchronousChange";

function DeletedSubject(props: { change: SynchronousSubjectChange }) {
  const { change, ...resProps } = props;
  if (!change.oldInfo) return null;
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
        Môn đã bị xoá
      </div>
      <div
        className={mergeClassNames(classes.tableContent, classes.idContainer)}
      >
        {change.oldInfo.mappingId &&
          change.oldInfo.mappingId.map((id) => <span key={id}>{id}</span>)}
      </div>
      <div className={classes.tableContent}>{change.oldInfo.name}</div>
      <div className={classes.tableContent}>{change.oldInfo.credit}</div>
    </div>
  );
}

export default DeletedSubject;
