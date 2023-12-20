import React from "react";
import classes from "./tags.module.css";
// @ts-ignore
import mergeClassNames from "merge-class-names";

function Tags(props: { tags: string[]; className: string }) {
  const { tags = [], className } = props;
  return (
    <div className={mergeClassNames(classes.root, className)}>
      <span>Từ khoá: </span>
      {tags.map((tag, index) => (
        <h5 key={index} className={classes.tag}>
          {tag}
        </h5>
      ))}
    </div>
  );
}

export default Tags;
