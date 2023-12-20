import React, { useContext } from "react";
import classes from "./footer.module.css";
import { AiFillFacebook } from "@react-icons/all-files/ai/AiFillFacebook";
import { AiOutlineMail } from "@react-icons/all-files/ai/AiOutlineMail";
import { AiFillHeart } from "@react-icons/all-files/ai/AiFillHeart";
import {
  FooterContext,
  FooterContextType,
} from "../../context-api/FooterProvider";

function Footer() {
  const { checkShowingFooter } = useContext(FooterContext) as FooterContextType;
  if (!checkShowingFooter()) return null;
  return (
    <div className={classes.root}>
      <div className={classes.contactContainer}>
        <h3 className={classes.contactTitle}>Liên hệ với chúng tôi:</h3>
        <div className={classes.contactLinks}>
          <a
            className={classes.facebookLink}
            target={"_blank"}
            href={"https://www.facebook.com/gradeptit"}
            rel={"noopener noreferrer"}
          >
            <AiFillFacebook />
          </a>
          <a
            className={classes.gmailLink}
            href={"mailto:gradeptit@gmail.com?subject=Feedback to Gradeptit"}
            target={"_blank"}
            rel={"noopener noreferrer"}
          >
            <AiOutlineMail />
          </a>
        </div>
      </div>
      <div className={classes.bio}>
        <span>From PTIT with </span>
        <span className={classes.heart}>
          <AiFillHeart />
        </span>
      </div>
    </div>
  );
}

export default Footer;
