import React from "react";
import classes from "./loadingButton.module.css";
import LoadingIcon from "../LoadingIcon";
// @ts-ignore
import mergeClassNames from "merge-class-names";

function LoadingButton(props: {
  className?: string;
  fullWidth?: boolean;
  children?: any;
  label?: any;
  fetching?: boolean;
  disabled?: boolean;
  onClick?: Function;
  type?: any;
}) {
  const {
    className,
    fullWidth,
    children,
    label,
    fetching,
    disabled,
    ...restProps
  } = props;
  const rootClass = mergeClassNames(
    className,
    classes.root,
    fullWidth ? classes.fullWidth : ""
  );
  return (
    <button
      className={rootClass}
      disabled={disabled || fetching}
      {...(restProps as any)}
    >
      {fetching && <LoadingIcon />}
      <span>{children || label}</span>
    </button>
  );
}

export default LoadingButton;
