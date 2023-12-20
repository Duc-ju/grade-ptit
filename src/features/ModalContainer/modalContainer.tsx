import React, { useContext } from "react";
import classes from "./modalContainer.module.css";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
// @ts-ignore
import mergeClassNames from "merge-class-names";
import {
  ModalContext,
  ModalContextType,
} from "../../context-api/ModalProvider";

function ModalContainer() {
  const { content, show, hideModal } = useContext(
    ModalContext
  ) as ModalContextType;
  const handleClose = () => {
    hideModal();
  };
  return (
    <div className={mergeClassNames(classes.root, show ? "" : classes.close)}>
      <div
        className={mergeClassNames(
          classes.closeArea,
          show ? "" : classes.close
        )}
        onClick={handleClose}
      />
      <div className={classes.contentArea}>
        <span className={classes.closeButton} onClick={handleClose}>
          <AiOutlineClose />
        </span>
        <div className={classes.content}>{content}</div>
      </div>
    </div>
  );
}

export default ModalContainer;
