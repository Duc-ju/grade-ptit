import { useContext, useEffect } from "react";
import {
  FooterContext,
  FooterContextType,
} from "../context-api/FooterProvider";

const useHideFooter = () => {
  const { showFooter, hideFooter } = useContext(
    FooterContext
  ) as FooterContextType;

  useEffect(() => {
    hideFooter();

    return showFooter;
  }, [hideFooter, showFooter]);
};

export default useHideFooter;
