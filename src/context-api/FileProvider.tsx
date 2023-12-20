import React, { PropsWithChildren, useEffect, useState } from "react";
import { File } from "../entity/file";
import { Semester } from "../entity/semester";

export interface FileContextType {
  file: File | null;
  setFile: (file: File) => void;
  semesterState: Semester[];
  setSemesterState: React.Dispatch<React.SetStateAction<Semester[]>>;
}

export const FileContext = React.createContext<FileContextType | null>(null);

function FileProvider({ children }: PropsWithChildren<{}>) {
  const [file, setFile] = useState<File | null>(null);
  const [semesterState, setSemesterState] = useState<Semester[]>(
    file ? file.semester : []
  );

  useEffect(() => {
    setSemesterState(file ? file.semester : []);
  }, [file?.id]);

  return (
    <FileContext.Provider
      value={{ file, setFile, semesterState, setSemesterState }}
    >
      {children}
    </FileContext.Provider>
  );
}

export default FileProvider;
