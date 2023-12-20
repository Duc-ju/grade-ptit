import React, { PropsWithChildren, useState } from "react";

export interface SnowFlakeContextType {
  showButton: () => void;
  hideButton: () => void;
  checkShowingButton: () => boolean;
}

export const SnowFlakeContext =
  React.createContext<SnowFlakeContextType | null>(null);

function SnowFlakeProvider({ children }: PropsWithChildren<{}>) {
  const [show, setShow] = useState(true);

  const showButton = () => {
    setShow(true);
  };

  const hideButton = () => {
    setShow(false);
  };

  const checkShowingButton = () => {
    return show;
  };

  return (
    <SnowFlakeContext.Provider
      value={{ showButton, hideButton, checkShowingButton }}
    >
      {children}
    </SnowFlakeContext.Provider>
  );
}

export default SnowFlakeProvider;
