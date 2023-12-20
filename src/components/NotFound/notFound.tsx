import React from "react";
import classes from "./notFound.module.scss";

function NotFound() {
  return (
    <div className={classes.root}>
      <div className={classes.number}>404</div>
      <div className={classes.text}>
        <span>Ooops...</span>
        <br />
        Trang này không tồn tại
      </div>
    </div>
  );
}

export default NotFound;
