import React, { PropsWithChildren, useState } from "react";

export interface FooterContextType {
  showFooter: () => void;
  hideFooter: () => void;
  checkShowingFooter: () => boolean;
}

export const FooterContext = React.createContext<FooterContextType | null>(
  null
);

function FooterProvider({ children }: PropsWithChildren<{}>) {
  const [show, setShow] = useState<boolean>(true);

  const showFooter = () => {
    setShow(true);
  };

  const hideFooter = () => {
    setShow(false);
  };

  const checkShowingFooter = () => {
    return show;
  };

  return (
    <FooterContext.Provider
      value={{ showFooter, hideFooter, checkShowingFooter }}
    >
      {children}
    </FooterContext.Provider>
  );
}

export default FooterProvider;
