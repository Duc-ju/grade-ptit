import React from "react";
// @ts-ignore
import mergeClassNames from "merge-class-names";
import classes from "./changedSubject.module.css";
import hasDiffMappingId from "../../../../utils/hasDiffMappingId";
import { SynchronousSubjectChange } from "../synchronousChange";

function ChangedSubject(props: { change: SynchronousSubjectChange }) {
  const { change, ...resProps } = props;
  const getChangeClasses = (
    subject1Id: string[] | number | string | null | undefined,
    subject2Id: string[] | number | string | null | undefined,
    extendClass1?: string,
    extendClass2?: string
  ) => {
    return mergeClassNames(
      classes.tableContent,
      Array.isArray(subject1Id) || Array.isArray(subject2Id)
        ? hasDiffMappingId(subject1Id, subject2Id)
          ? classes.changed
          : ""
        : subject1Id === subject2Id
        ? ""
        : classes.changed,
      extendClass1 ? extendClass1 : "",
      extendClass2 ? extendClass2 : ""
    );
  };
  if (!change.oldInfo || !change.newInfo) return null;
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
        Thông tin cũ
      </div>
      <div
        className={mergeClassNames(
          classes.tableContent,
          classes.center,
          classes.idContainer
        )}
      >
        {change.oldInfo.mappingId &&
          change.oldInfo.mappingId.map((id, index) => (
            <span key={id || index}>{id}</span>
          ))}
      </div>
      <div className={classes.tableContent}>{change.oldInfo.name}</div>
      <div className={mergeClassNames(classes.tableContent, classes.center)}>
        {change.oldInfo.credit}
      </div>
      <div
        className={mergeClassNames(
          classes.tableContent,
          classes.first,
          classes.bold
        )}
      >
        Thông tin mới
      </div>
      <div
        className={getChangeClasses(
          change.oldInfo.mappingId,
          change.newInfo.mappingId,
          classes.center,
          classes.idContainer
        )}
      >
        {change.newInfo.mappingId &&
          change.newInfo.mappingId.map((id) => <span key={id}>{id}</span>)}
      </div>
      <div
        className={getChangeClasses(change.oldInfo.name, change.newInfo.name)}
      >
        {change.newInfo.name}
      </div>
      <div
        className={getChangeClasses(
          change.oldInfo.credit,
          change.newInfo.credit,
          classes.center
        )}
      >
        {change.newInfo.credit}
      </div>
    </div>
  );
}

export default ChangedSubject;
