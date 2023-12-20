import React, { useContext, useState } from "react";
// @ts-ignore
import mergeClassNames from "merge-class-names";
import classes from "./snowFlake.module.css";
import { SHOW_CHRISTMAS_THEME } from "../../constrain/constrain";
import {
  SnowFlakeContext,
  SnowFlakeContextType,
} from "../../context-api/SnowFlakeProvider";

function SnowFlake() {
  const [snowflake, setSnowflake] = useState(SHOW_CHRISTMAS_THEME);
  const { checkShowingButton } = useContext(
    SnowFlakeContext
  ) as SnowFlakeContextType;

  return (
    <>
      <div
        className={mergeClassNames(
          classes.snowflakes,
          !snowflake ? classes.hidden : ""
        )}
        aria-hidden="true"
      >
        <div className={classes.snowflake}>❅</div>
        <div className={classes.snowflake}>❆</div>
        <div className={classes.snowflake}>❅</div>
        <div className={classes.snowflake}>❆</div>
        <div className={classes.snowflake}>❅</div>
        <div className={classes.snowflake}>❆</div>
        <div className={classes.snowflake}>❅</div>
        <div className={classes.snowflake}>❆</div>
        <div className={classes.snowflake}>❅</div>
        <div className={classes.snowflake}>❆</div>
        <div className={classes.snowflake}>❅</div>
        <div className={classes.snowflake}>❆</div>
      </div>
      {checkShowingButton() && (
        <div
          className={mergeClassNames(
            classes.snowButton,
            snowflake ? classes.isShowing : ""
          )}
          onClick={() => setSnowflake((old) => !old)}
        >
          <span>❆</span>
        </div>
      )}
    </>
  );
}

export default SnowFlake;
