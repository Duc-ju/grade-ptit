import React from "react";
import classes from "./mainRoute.module.css";
import Header from "../Header";
import { Route, Routes } from "react-router-dom";
import Footer from "../Footer";
import Home from "../../components/Home";
import FileProvider from "../../context-api/FileProvider";
import ScheduleGrade from "../../components/ScheduleGrade";
import AboutPage from "../../components/AboutPage";
import Login from "../../components/LoginRegister";
import ViewFileList from "../../components/ViewFileList";
import CreateFile from "../../components/CreateFile";
import CreateRootFile from "../../components/CreateRootFile";
import FindFile from "../../components/FindFile";
import CalcPoint from "../../components/CalcPoint";
import EditSemesterTool from "../../admin/EditSemesterTool";
import NotFound from "../../components/NotFound";
import useScrollTop from "../../hooks/useScrollTop";
import ExcelSemesterConvertTool from "../../admin/ExcelSemesterConvertTool";
import Privacy from "../../components/Privacy";
import DeleteAccount from "../../components/DeleteAccount";

function MainRoute() {
  useScrollTop();
  return (
    <>
      <Header />
      <div className={classes.content}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/file-view"
            element={
              <FileProvider>
                <ScheduleGrade />
              </FileProvider>
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          <Route path="/file-list" element={<ViewFileList />} />
          <Route path="/create-file" element={<CreateFile />} />
          <Route path="/update-file/:id" element={<CreateFile />} />
          <Route path="/create-root-file" element={<CreateRootFile />} />
          <Route path="/update-root-file/:id" element={<CreateRootFile />} />
          <Route path={"/find-file"} element={<FindFile />} />
          <Route path={"/calc-point"} element={<CalcPoint />} />
          <Route path={"/privacy"} element={<Privacy />} />
          <Route path={"/delete-acount"} element={<DeleteAccount />} />
          {window.location.hostname === "localhost" && (
            <>
              <Route
                path={"/admin/edit-semester"}
                element={<EditSemesterTool />}
              />
              <Route
                path={"/admin/excel-semester-convert-tool"}
                element={<ExcelSemesterConvertTool />}
              />
            </>
          )}
          <Route path={"*"} element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default MainRoute;
