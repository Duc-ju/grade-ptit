import React, { useContext, useEffect, useState } from "react";
import classes from "./createFile.module.css";
import { AuthContext, AuthContextType } from "../../context-api/AuthProvider";
import { useNavigate } from "react-router";
import { addDocument, getFileCount } from "../../firebase/service";
import { toast } from "react-toastify";
import * as validate from "../../utils/validate";
import majorMappingJSON from "../../master-data/majorMapping.json";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/config";
import firebase from "firebase/compat/app";
import getAllSubstrings from "../../utils/getAllSubstrings";
import { MAX_FILE_COUNT } from "../../constrain/constrain";
import FacebookPage from "../FacebookPage";
import Tags from "../Tags";
import { FcNext } from "@react-icons/all-files/fc/FcNext";
import { File } from "../../entity/file";
import LoadingButton from "../../common-components/LoadingButton";
import {
  getMasterCourseKeyList,
  getMasterMajor,
  getMasterMajorKeyList,
} from "../../master-data/masterData";

function CreateFile() {
  const { user } = useContext(AuthContext) as AuthContextType;
  const params = useParams();
  const [file, setFile] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [course, setCourse] = useState("");
  const [major, setMajor] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [studentCodeError, setStudentCodeError] = useState("");
  const [courseError, setCourseError] = useState("");
  const [majorError, setMajorError] = useState("");
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();
  const majorMapping = majorMappingJSON as any;
  useEffect(() => {
    if (!user) {
      toast.error("Đăng nhập đã nhé bờ rô");
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (params.id) {
      document.title = "Grade PTIT | Cập nhật hồ sơ";
    } else {
      document.title = "Grade PTIT | Tạo hồ sơ mới";
    }
  }, [params.id]);
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
            setFullName(files[0].fullName);
            setStudentCode(files[0].studentCode);
            setCourse(files[0].course);
            setMajor(files[0].major);
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
    const validateFullName = validate.validateFullName(fullName);
    if (validateFullName) {
      setFullNameError(validateFullName);
      error = true;
    }
    const validateStudentCode = validate.validateStudentCode(studentCode);
    if (validateStudentCode) {
      setStudentCodeError(validateStudentCode);
      error = true;
    }
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
    getFileCount(user.uid).then((count) => {
      if (count > MAX_FILE_COUNT) {
        toast.error(
          `Mỗi tài khoản chỉ có thể tạo tối đa ${MAX_FILE_COUNT} hồ sơ`
        );
      } else {
        setFetching(true);
        addDocument("files", {
          uid: user.uid,
          fullName,
          studentCode,
          course,
          major,
          keywords: getAllSubstrings(studentCode),
          semester: getMasterMajor(course, major),
          root: false,
          isPublic: false,
        })
          .then(function (docRef) {
            toast.info("Tạo hồ sơ thành công");
            navigate("/file-view?id=" + docRef.id);
          })
          .catch((e) => {
            toast.error("Tạo hồ sơ thất bại");
          })
          .finally(() => setFetching(false));
      }
    });
  };
  const handleUpdateFile = () => {
    let error = false;
    const validateFullName = validate.validateFullName(fullName);
    if (validateFullName) {
      setFullNameError(validateFullName);
      error = true;
    }
    const validateStudentCode = validate.validateStudentCode(studentCode);
    if (validateStudentCode) {
      setStudentCodeError(validateStudentCode);
      error = true;
    }
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
              fullName,
              studentCode,
              keywords: getAllSubstrings(studentCode),
              semester: getMasterMajor(course, major),
            })
          )
        : JSON.parse(
            JSON.stringify({
              ...file,
              course,
              major,
              fullName,
              keywords: getAllSubstrings(studentCode),
              studentCode,
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
  const handleChaneFullName = (e: any) => {
    setFullName(e.target.value);
    const validateFullName = validate.validateFullName(e.target.value);
    if (fullNameError && !validateFullName) setFullNameError("");
    if (fullNameError && validateFullName) setFullNameError(validateFullName);
  };

  const handleChangeStudentCode = (e: any) => {
    setStudentCode(e.target.value && e.target.value.toUpperCase());
    const validateStudentCode = validate.validateStudentCode(e.target.value);
    if (studentCodeError && !validateStudentCode) setStudentCodeError("");
    if (studentCodeError && validateStudentCode)
      setStudentCodeError(validateStudentCode);
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

  const title = !params.id ? "Tạo hồ sơ" : "Cập nhật hồ sơ";

  return (
    <div className={classes.root}>
      <div className={classes.parent}>
        <div className={classes.topContainer}>
          <div className={classes.container}>
            <div className={classes.header}>{title}</div>
            <div className={classes.createForm}>
              <input
                placeholder={"Họ và tên"}
                value={fullName}
                onChange={handleChaneFullName}
              />
              {fullNameError && (
                <span className={classes.errorMessage}>{fullNameError}</span>
              )}
              <input
                placeholder={"Mã sinh viên"}
                value={studentCode}
                onChange={handleChangeStudentCode}
              />
              {studentCodeError && (
                <span className={classes.errorMessage}>{studentCodeError}</span>
              )}
              <select onChange={handleChangeCourse} value={course}>
                <option value={""}>Khoá học</option>
                {getMasterCourseKeyList().map((course) => (
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
                {getMasterMajorKeyList(course).map((major) => (
                  <option value={major} key={major}>
                    {majorMapping[major]}
                  </option>
                ))}
              </select>
              {majorError && (
                <span className={classes.errorMessage}>{majorError}</span>
              )}
              <span className={classes.notice}>
                Thông tin của hồ sơ này được bảo mật hoàn toàn
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
                Thông tin của hồ sơ được bảo mật hoàn toàn, nghĩa là hồ sơ của
                bạn sẽ không thể tìm kiếm bởi người khác, không thể xem bởi
                người khác.
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

export default CreateFile;
