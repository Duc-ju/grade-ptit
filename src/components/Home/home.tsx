import React, { useContext, useEffect } from "react";
import classes from "./home.module.scss";
import { Link } from "react-router-dom";
import { AuthContext, AuthContextType } from "../../context-api/AuthProvider";
import FacebookPage from "../../components/FacebookPage";
import Tags from "../../components/Tags";

function Home() {
  const { user } = useContext(AuthContext) as AuthContextType;
  useEffect(() => {
    document.title = "Grade PTIT";
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.topContainer}>
        <Link to={"/file-list"} className={classes.button}>
          Xem hồ sơ
        </Link>
        {user && (
          <Link to={"/create-file"} className={classes.button}>
            Tạo hồ sơ mới
          </Link>
        )}
        {!user && (
          <Link to={"/file-view"} className={classes.button}>
            Xem hồ sơ mẫu
          </Link>
        )}
        <Link to={"/find-file"} className={classes.button}>
          Tìm kiếm hồ sơ
        </Link>
        <Link to={"/calc-point"} className={classes.button}>
          Tính điểm tổng kết
        </Link>
      </div>
      <FacebookPage className={classes.facebookPage} />
      <Tags
        tags={[
          "grade ptit",
          "gradeptit",
          "tính điểm ptit",
          "ước lượng điểm cải thiện",
          "tính điểm cải thiện",
          "tính điểm GPA",
          "kịch bản học tập",
          "điểm GPA",
          "điểm trung bình",
          "điểm tích luỹ",
          "công cụ tính điểm",
          "sinh viên",
          "sinh viên ptit",
          "kết quả học tập",
          "công cụ học tập",
        ]}
        className={classes.tagContainer}
      />
    </div>
  );
}

export default Home;
