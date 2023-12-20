import { useContext, useEffect } from "react";
import {
  SnowFlakeContext,
  SnowFlakeContextType,
} from "../context-api/SnowFlakeProvider";

const useHideSnowFlakeButton = () => {
  const { showButton, hideButton } = useContext(
    SnowFlakeContext
  ) as SnowFlakeContextType;

  useEffect(() => {
    hideButton();

    return showButton;
  }, [hideButton, showButton]);
};

export default useHideSnowFlakeButton;
