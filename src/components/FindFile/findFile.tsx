import React, { useContext, useEffect, useState } from "react";
import classes from "./findFile.module.css";
import { db } from "../../firebase/config";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { AuthContext, AuthContextType } from "../../context-api/AuthProvider";
import { FcNext } from "@react-icons/all-files/fc/FcNext";
import Tags from "../Tags";
import FacebookPage from "../FacebookPage";
import sampleRes from "./sampleRes.json";
// @ts-ignore
import mergeClassNames from "merge-class-names";
import { File } from "../../entity/file";
import LoadingIcon from "../../common-components/LoadingIcon";
import LoadingButton from "../../common-components/LoadingButton";

function FindFile() {
  const [keyword, setKeyWord] = useState("");
  const [res, setRes] = useState<File[]>([]);
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) as AuthContextType;
  const KEY_WORD_MIN_SIZE = 3;

  useEffect(() => {
    document.title = "Grade PTIT | Tìm kiếm hồ sơ";
  }, []);

  useEffect(() => {
    if (!user) setRes(sampleRes as any);
  }, [user]);

  const handleChangeKeyword = (e: any) => {
    const value = e.target.value;
    setKeyWord(value);
    if (!user) return;
    if (!value || value.length < KEY_WORD_MIN_SIZE) {
      setRes([]);
      return;
    }
    setFetching(true);
    db.collection("files")
      .where("keywords", "array-contains", value.toLowerCase())
      .where("isPublic", "==", true)
      .limit(20)
      .get()
      .then((snapshot) => {
        return snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
      })
      .then((files) => {
        setRes(files as File[]);
      })
      .catch((e) => {
        toast.error("Không thể tìm kiếm");
      })
      .finally(() => {
        setFetching(false);
      });
  };
  const handleSelectFile = (file: File) => {
    navigate(`/file-view?id=${file.id}`);
  };
  const handleLoginRedirect = () => {
    navigate("/login");
  };
  return (
    <div className={classes.root}>
      <div className={classes.parentContainer}>
        <div className={classes.topContainer}>
          <div className={classes.container}>
            <div className={classes.header}>
              <h2>Tìm kiếm hồ sơ</h2>
            </div>
            <div className={classes.inputContainer}>
              <input
                className={classes.keyword}
                value={keyword}
                onChange={handleChangeKeyword}
                placeholder={"Nhập từ khoá tìm kiếm"}
              />
            </div>
            <div className={classes.resultTable}>
              {((user && res.length >= KEY_WORD_MIN_SIZE && !fetching) ||
                !user) && (
                <ul className={classes.resultList}>
                  {res.map((file) => (
                    <li
                      className={classes.result}
                      key={file.id}
                      onClick={() => handleSelectFile(file)}
                    >
                      <span>{`${file.studentCode} - ${file.fullName}`}</span>
                    </li>
                  ))}
                </ul>
              )}
              {user && fetching && (
                <div className={classes.center}>
                  <LoadingIcon />
                </div>
              )}
              {user &&
                !fetching &&
                keyword.length >= KEY_WORD_MIN_SIZE &&
                res.length === 0 && (
                  <div className={classes.center}>
                    <span>Không tìm thấy kết quả</span>
                  </div>
                )}
              {user &&
                !fetching &&
                keyword.length < KEY_WORD_MIN_SIZE &&
                keyword.length > 0 && (
                  <div className={classes.center}>
                    <span>
                      {`Từ khoá phải bao gồm ít nhất ${KEY_WORD_MIN_SIZE} kí tự`}
                    </span>
                  </div>
                )}
              {!user && (
                <div
                  className={mergeClassNames(classes.center, classes.absolute)}
                >
                  <LoadingButton onClick={handleLoginRedirect}>
                    Đăng nhập để tìm kiếm hồ sơ
                  </LoadingButton>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={classes.aboutContainer}>
          <h3>
            Xin chào các bạn sinh viên PTIT. Dưới đây là phần giới thiệu chức
            năng Tìm kiếm hồ sơ
          </h3>
          <ul className={classes.about}>
            <li>
              <span>
                <FcNext />
                Các bạn hãy nhập tối thiểu 3 ký tự của mã sinh viên, những hồ sơ
                có mã sinh viên giống nhất với từ khoá bạn nhập sẽ được hiển thị
                dưới khung kết quả.
              </span>
            </li>
            <li>
              <span>
                <FcNext />
                Danh sách hồ sơ được hiển thị ở kết quả tìm kiếm bao gồm những
                hồ sơ của người dùng trong hệ thống đang để chế độ công khai.
              </span>
            </li>
            <li>
              <span>
                <FcNext />
                Nếu hồ sơ là của người dùng khác, bạn sẽ được xem hồ sơ ở chế độ
                khách. Với chế độ này bạn chỉ có thể xem, chỉnh sửa điểm. Nếu
                muốn thực hiện nhiều hành động hơn hãy nhân bản hồ sơ.
              </span>
            </li>
          </ul>
        </div>
        <FacebookPage className={classes.facebookPage} />
        <Tags
          tags={[
            "hồ sơ điểm",
            "tìm kiếm hồ sơ",
            "ước lượng điểm GPA",
            "lên kế hoạch học tập",
            "điểm GPA",
            "điểm trung bình",
            "điểm tích luỹ",
            "công cụ tính điểm",
            "sinh viên",
            "sinh viên ptit",
            "kết quả học tập",
            "grade ptit",
            "gradeptit",
          ]}
          className={classes.tagContainer}
        />
      </div>
    </div>
  );
}

export default FindFile;
