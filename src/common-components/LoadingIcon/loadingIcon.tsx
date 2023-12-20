import React from "react";
import classes from "./loadingIcon.module.css";
import { AiOutlineLoading3Quarters } from "@react-icons/all-files/ai/AiOutlineLoading3Quarters";
// @ts-ignore
import mergeClassNames from "merge-class-names";

function LoadingIcon(props: any) {
  const { className, ...resProps } = props;
  const rootClass = mergeClassNames(className, classes.root);
  return (
    <span className={rootClass} {...resProps}>
      <AiOutlineLoading3Quarters />
    </span>
  );
}

export default LoadingIcon;
