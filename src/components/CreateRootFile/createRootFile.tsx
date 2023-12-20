import React, { useContext, useEffect, useState } from "react";
import classes from "./createRootFile.module.css";
import { AuthContext, AuthContextType } from "../../context-api/AuthProvider";
import { addDocument } from "../../firebase/service";
// @ts-ignore
import mergeClassNames from "merge-class-names";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import masterCourseListJSON from "../../master-data/masterCourseList.json";
import * as validate from "../../utils/validate";
import majorMappingJSON from "../../master-data/majorMapping.json";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/config";
import firebase from "firebase/compat/app";
import getAllSubstrings from "../../utils/getAllSubstrings";
import FacebookPage from "../FacebookPage";
import Tags from "../Tags";
import { FcNext } from "@react-icons/all-files/fc/FcNext";
import { File } from "../../entity/file";
import LoadingButton from "../../common-components/LoadingButton";

function CreateRootFile() {
  const params = useParams();
  const { user } = useContext(AuthContext) as AuthContextType;
  const [file, setFile] = useState<File | null>(null);
  const [course, setCourse] = useState("");
  const [major, setMajor] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [courseError, setCourseError] = useState("");
  const [majorError, setMajorError] = useState("");
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();
  const masterCourseList = masterCourseListJSON as any;
  const majorMapping = majorMappingJSON as any;

  useEffect(() => {
    if (!user) {
      toast.error("Đăng nhập đã nhé bờ rô");
      navigate("/login");
    }
  }, [user, navigate]);
  useEffect(() => {
    if (params.id) {
      document.title = "Grade PTIT | Cập nhật hồ sơ gốc";
    } else {
      document.title = "Grade PTIT | Tạo hồ gốc";
    }
  }, [params.id]);
  useEffect(() => {
    if (user && !params.id) {
      db.collection("files")
        .where("uid", "==", user.uid)
        .where("root", "==", true)
        .limit(1)
        .get()
        .then((snapshot) => {
          return snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
        })
        .then((files) => {
          if (files.length) {
            navigate("/file-list");
            toast.info("Hồ sơ gốc đã tồn tại");
          }
        })
        .catch((e) => {
          toast.error("Có lỗi xảy ra");
        });
    }
  }, [navigate, user, params.id]);
  useEffect(() => {
    params.id &&
      db
        .collection("files")
        .where(firebase.firestore.FieldPath.documentId(), "==", params.id)
        .limit(1)
        .get()
        .then((snapshot) => {
          return snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
        })
        .then((filesResponse) => {
          const files = filesResponse as File[];
          if (files && files.length && files.length > 0) {
            setFile({
              ...files[0],
            });
            setCourse(files[0].course);
            setMajor(files[0].major);
            setIsPublic(files[0].isPublic);
          } else {
            throw new Error("Hồ sơ không tồn tại");
          }
        })
        .catch((err) => {
          console.error(err);
          navigate("/file-list");
          toast.error("Hồ sơ không tồn tại");
        });
  }, [params, navigate]);
  const handleAddFile = () => {
    let error = false;
    const validateCourse = validate.validateCourse(course);
    if (validateCourse) {
      setCourseError(validateCourse);
      error = true;
    }
    const validateMajor = validate.validateMajor(major);
    if (validateMajor) {
      setMajorError(validateMajor);
      error = true;
    }
    if (error || !user) return;
    setFetching(true);
    addDocument("files", {
      uid: user.uid,
      fullName: user.fullName,
      studentCode: user.studentCode,
      course,
      major,
      keywords: getAllSubstrings(user.studentCode),
      semester: masterCourseList[course][major],
      root: true,
      isPublic,
    })
      .then(function (docRef) {
        toast.info("Tạo hồ sơ gốc thành công");
        navigate("/file-view?id=" + docRef.id);
      })
      .catch((e) => {
        toast.error("Tạo hồ sơ gốc thất bại");
      })
      .finally(() => setFetching(false));
  };
  const handleUpdateFile = () => {
    let error = false;
    const validateCourse = validate.validateCourse(course);
    if (validateCourse) {
      setCourseError(validateCourse);
      error = true;
    }
    const validateMajor = validate.validateMajor(major);
    if (validateMajor) {
      setMajorError(validateMajor);
      error = true;
    }
    if (error || !file) return;
    if (file.course !== course || file.major !== major) {
      const res = window.confirm(
        "Nếu bạn thay đổi khoá học hoặc ngành học, tất cả điểm cũ sẽ bị mất, bạn đồng ý chứ?"
      );
      if (!res) return;
    }
    setFetching(true);
    const data =
      file.course !== course || file.major !== major
        ? JSON.parse(
            JSON.stringify({
              ...file,
              course,
              major,
              isPublic,
              semester: masterCourseList[course][major],
            })
          )
        : JSON.parse(
            JSON.stringify({
              ...file,
              course,
              major,
              isPublic,
            })
          );
    db.collection("files")
      .doc(file.id)
      .update(data)
      .then((res) => {
        toast.info("Cập nhật hồ sơ thành công");
        navigate("/file-list");
      })
      .catch((e) => toast.error("Cập nhật thất bại"))
      .finally(() => setFetching(false));
  };
  const handleChangeCourse = (e: any) => {
    setCourse(e.target.value);
    setMajor("");
    const validateCourse = validate.validateCourse(e.target.value);
    if (courseError && !validateCourse) setCourseError("");
    if (courseError && validateCourse) setCourseError(validateCourse);
  };
  const handleChangeMajor = (e: any) => {
    setMajor(e.target.value);
    const validateMajor = validate.validateMajor(e.target.value);
    if (majorError && !validateMajor) setMajorError("");
    if (majorError && validateMajor) setMajorError(validateMajor);
  };
  const courseList = (() => {
    return Object.keys(masterCourseList);
  })();

  const majorList = (() => {
    if (!course) return [];
    return Object.keys(masterCourseList[course]);
  })();
  const title = !params.id ? "Tạo hồ sơ gốc" : "Cập nhật hồ sơ gốc";
  if (!user) return null;
  return (
    <div className={classes.root}>
      <div className={classes.parent}>
        <div className={classes.topContainer}>
          <div className={classes.container}>
            <div className={classes.header}>{title}</div>
            <div className={classes.createForm}>
              <input
                placeholder={"Họ và tên"}
                value={user.fullName}
                readOnly={true}
              />
              <input
                placeholder={"Mã sinh viên"}
                value={user.studentCode}
                readOnly={true}
              />
              <select onChange={handleChangeCourse} value={course}>
                <option value={""}>Khoá học</option>
                {courseList.map((course) => (
                  <option value={course} key={course}>
                    {course}
                  </option>
                ))}
              </select>
              {courseError && (
                <span className={classes.errorMessage}>{courseError}</span>
              )}
              <select onChange={handleChangeMajor} value={major}>
                <option value={""}>Ngành học</option>
                {majorList.map((major) => (
                  <option value={major} key={major}>
                    {majorMapping[major]}
                  </option>
                ))}
              </select>
              {majorError && (
                <span className={classes.errorMessage}>{majorError}</span>
              )}
              <div className={classes.toggleButtonCover}>
                <div className={classes.buttonCover}>
                  <div
                    className={mergeClassNames(classes.button, classes.r)}
                    id="button1"
                  >
                    <input
                      type="checkbox"
                      className={classes.checkbox}
                      checked={!isPublic}
                      onChange={(e) => setIsPublic((old) => !old)}
                    />
                    <div className={classes.knobs} />
                    <div className={classes.layer} />
                  </div>
                </div>
              </div>
              <span className={classes.notice}>
                Nếu để public, hồ sơ của bạn có thể được tìm kiếm bởi mọi người
              </span>
              <LoadingButton
                className={classes.registButton}
                onClick={!file ? handleAddFile : handleUpdateFile}
                fullWidth={true}
                fetching={fetching}
                disabled={!!params.id && !file}
              >
                Hoàn thành
              </LoadingButton>
            </div>
          </div>
        </div>
        <div className={classes.aboutContainer}>
          <h3>
            Xin chào các bạn sinh viên PTIT. Dưới đây là phần giới thiệu chức
            năng tạo và cập nhật thông tin hồ sơ
          </h3>
          <ul className={classes.about}>
            <li>
              <span>
                <FcNext />
                Khi tạo hồ sơ, các bạn cần nhập đầy đủ các thông tin họ và tên,
                mã sinh viên, khoá học, ngành học.
              </span>
            </li>
            <li>
              <span>
                <FcNext />
                Khi tạo mới hồ sơ, danh sách môn học của các môn học của các học
                kỳ được chúng tôi lấy dựa vào khoá học và ngành học của bạn. Khi
                cập nhật hồ sơ, nếu bạn thay đổi khoá học hoặc ngành học, thông
                tin điểm cũ sẽ bị mất.
              </span>
            </li>
            <li>
              <span>
                <FcNext />
                Nếu chọn private, thông tin của hồ sơ được bảo mật hoàn toàn,
                nghĩa là hồ sơ của bạn sẽ không thể tìm kiếm và xem bởi người
                khác. Nếu chọn public, mọi người có thể tìm kiếm, xem hồ sơ và
                tạo bản sao từ hồ sơ của bạn.
              </span>
            </li>
          </ul>
        </div>
        <FacebookPage className={classes.facebookPage} />
        <Tags
          tags={[
            "hồ sơ tính điểm",
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
            "grade ptit",
            "gradeptit",
          ]}
          className={classes.tagContainer}
        />
      </div>
    </div>
  );
}

export default CreateRootFile;
