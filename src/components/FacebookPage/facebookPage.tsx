import React from "react";
import classes from "./facebookPage.module.css";
// @ts-ignore
import mergeClassNames from "merge-class-names";
import { FacebookEmbed } from "react-social-media-embed";

function FacebookPage(props: {
  className: string;
  label?: string;
  url?: string;
}) {
  const {
    className,
    label = "Giới thiệu về Grade Ptit",
    url = "https://www.facebook.com/20531316728/posts/122102398388034166/",
    ...restProps
  } = props;

  return (
    <div className={mergeClassNames(classes.root, className)}>
      <h3>{label}</h3>
      <div className={classes.postContainer}>
        <FacebookEmbed url={url} width={"100%"} {...restProps} />
      </div>
    </div>
  );
}

export default FacebookPage;
