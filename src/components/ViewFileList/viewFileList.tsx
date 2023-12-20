import React, { useContext, useEffect, useState } from "react";
import classes from "./viewFileList.module.css";
import { db } from "../../firebase/config";
import { AuthContext, AuthContextType } from "../../context-api/AuthProvider";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
// @ts-ignore
import mergeClassNames from "merge-class-names";
import { AiFillEdit } from "@react-icons/all-files/ai/AiFillEdit";
import { RiDeleteBin2Fill } from "@react-icons/all-files/ri/RiDeleteBin2Fill";
import { BiCopy } from "@react-icons/all-files/bi/BiCopy";
import ReactTooltip from "react-tooltip";
import { addDocument, getFileCount } from "../../firebase/service";
import firebase from "firebase/compat/app";
import { MAX_FILE_COUNT } from "../../constrain/constrain";
import { FcNext } from "@react-icons/all-files/fc/FcNext";
import Tags from "../Tags";
import FacebookPage from "../FacebookPage";
import filesSample from "./filesSample.json";
import { File } from "../../entity/file";
import LoadingIcon from "../../common-components/LoadingIcon";
import LoadingButton from "../../common-components/LoadingButton";

function ViewFileList() {
  const { user } = useContext(AuthContext) as AuthContextType;
  const [files, setFiles] = useState<File[]>([]);
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Grade PTIT | Quản lý hồ sơ";
  }, []);

  useEffect(() => {
    if (user) {
      setFetching(true);
      db.collection("files")
        .where("uid", "==", user.uid)
        .orderBy("createAt", "asc")
        .get()
        .then((snapshot) => {
          return snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
        })
        .then((files) => {
          setFiles(
            (files as File[]).sort((file1, file2) => {
              if (file1.root && !file2.root) {
                return -1;
              }
              if (!file1.root && file2.root) {
                return 1;
              }
              return 0;
            })
          );
        })
        .catch((e) => {
          console.error(e);
          toast.error("Không thể tải danh sách file");
        })
        .finally(() => setFetching(false));
    } else {
      setFiles(filesSample as any);
    }
  }, [user]);
  const handleSelectFile = (id: string) => {
    navigate("/file-view?id=" + id);
  };
  const handleEdit = (e: any, file: File) => {
    e.stopPropagation();
    file.root
      ? navigate(`/update-root-file/${file.id}`)
      : navigate(`/update-file/${file.id}`);
  };
  const handleDuplicate = (e: any, file: File) => {
    e.stopPropagation();
    const res = window.confirm(
      "Khi nhân bản hồ sơ, chúng tôi sẽ tạo một hồ sơ mới và do bạn làm chủ. Bạn đồng ý chứ?"
    );
    if (res && user) {
      getFileCount(user.uid).then((count) => {
        if (count > MAX_FILE_COUNT) {
          toast.error(
            `Mỗi tài khoản chỉ có thể tạo tối đa ${MAX_FILE_COUNT} hồ sơ`
          );
        } else {
          setFetching(true);
          const tempFile = { ...file, referId: file.id } as any;
          delete tempFile.id;
          tempFile.fullName = `${tempFile.fullName} (1)`;
          tempFile.root = false;
          tempFile.createAt = firebase.firestore.FieldValue.serverTimestamp();
          addDocument("files", tempFile)
            .then(function (docRef) {
              toast.info("Nhân bản hồ sơ thành công");
              tempFile.id = docRef.id;
              setFiles([files[0], tempFile, ...files.slice(1, files.length)]);
            })
            .catch((e) => {
              toast.error("Nhân bản hồ sơ thất bại");
            })
            .finally(() => setFetching(false));
        }
      });
    }
  };
  const handleRemove = (e: any, file: File) => {
    e.stopPropagation();
    const res = window.confirm("Bạn có chắc chắn muốn xoá hồ sơ chứ?");
    if (res) {
      db.collection("files")
        .doc(file.id)
        .delete()
        .then(() => {
          toast.info("Xoá hồ sơ thành công!");
          setFiles((oldFiles) =>
            oldFiles.filter((fileX) => fileX.id !== file.id)
          );
        });
    }
  };
  const handleRedirect = () => {
    navigate("/create-root-file");
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className={classes.root}>
      <div className={classes.parent}>
        <div className={classes.topContainer}>
          <div className={classes.container}>
            <div className={classes.header}>Quản lý hồ sơ</div>
            <ul className={classes.fileList}>
              {files.length > 0 &&
                !fetching &&
                files.map((file) => (
                  <li
                    className={mergeClassNames(
                      classes.file,
                      file.root && classes.fileRoot
                    )}
                    key={file.id}
                  >
                    <div
                      className={classes.fileContent}
                      onClick={() => handleSelectFile(file.id)}
                    >
                      <div>
                        <span>{file.fullName + " - " + file.studentCode}</span>
                      </div>
                      <div>
                        <span
                          onClick={(e) => handleEdit(e, file)}
                          className={classes.editButton}
                          data-tip={"Chỉnh sửa"}
                        >
                          <AiFillEdit />
                        </span>
                        <span
                          onClick={(e) => handleDuplicate(e, file)}
                          className={classes.duplicateButton}
                          data-tip={"Nhân bản"}
                        >
                          <BiCopy />
                        </span>
                        {!file.root && (
                          <span
                            onClick={(e) => handleRemove(e, file)}
                            className={classes.removeButton}
                            data-tip={"Xoá"}
                          >
                            <RiDeleteBin2Fill />
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              {user && fetching && (
                <li className={classes.fullHeight}>
                  <LoadingIcon />
                </li>
              )}
              {user && !fetching && files.length === 0 && (
                <div className={classes.fullHeight}>
                  <LoadingButton onClick={handleRedirect}>
                    Tạo hồ sơ gốc
                  </LoadingButton>
                </div>
              )}
              {!user && (
                <li
                  className={mergeClassNames(
                    classes.fullHeight,
                    classes.absolute
                  )}
                >
                  <LoadingButton onClick={handleLoginRedirect}>
                    Đăng nhập để xem hồ sơ
                  </LoadingButton>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className={classes.aboutContainer}>
          <h3>
            Xin chào các bạn sinh viên PTIT. Dưới đây là phần giới thiệu chức
            năng Quản lý hồ sơ
          </h3>
          <ul className={classes.about}>
            <li>
              <span>
                <FcNext />
                Những hồ sơ mà bạn đã tạo sẽ hiển thị trong menu này.
              </span>
            </li>
            <li>
              <span>
                <FcNext />
                Đối với hồ sơ gốc, các bạn sẽ không thể xoá, còn đối với các hồ
                sơ bình thường có thể xoá.
              </span>
            </li>
            <li>
              <span>
                <FcNext />
                Khi click vào nút edit, các bạn sẽ có thể chỉnh sửa các thông
                tin như tên sinh viên, mã sinh viên, khoá học, ngành học. Lưu ý
                khi chỉnh sửa khoá học và ngành học, điểm và điểm cải thiện bạn
                nhập trước đó sẽ bị mất.
              </span>
            </li>
            <li>
              <span>
                <FcNext />
                Khi click vào nút nhân bản hồ sơ, một hồ sơ mới sẽ được tạo và
                có thông tin giống hệt như hồ sơ bạn vừa chọn để nhân bản. Chúng
                tôi thêm vào cuối tên hồ sơ mới được tạo ra chuỗi ký tự "(1)" để
                đảm bảo rằng bạn phân biệt được hồ sơ ban đầu và hồ sơ bản sao.
              </span>
            </li>
            <li>
              <span>
                <FcNext />
                Khi click vào khoảng trắng của mỗi hồ sơ, bạn sẽ được đưa tới
                trang ước lượng điểm, nơi chứa các chức năng chính của Grade
                Ptit.
              </span>
            </li>
            <li>
              <span>
                <FcNext />
                {`Chúng tôi đã giới hạn số hồ sơ tối đa một người có thể tạo là ${MAX_FILE_COUNT}.`}
              </span>
            </li>
          </ul>
        </div>
        <FacebookPage className={classes.facebookPage} />
        <Tags
          tags={[
            "quản lý hồ sơ",
            "hồ sơ điểm sinh viên",
            "điểm GPA",
            "điểm trung bình",
            "điểm tích luỹ",
            "công cụ tính điểm",
            "sinh viên",
            "sinh viên ptit",
            "kết quả học tập",
            "cải thiện điểm",
            "grade ptit",
            "gradeptit",
          ]}
          className={classes.tagContainer}
        />
      </div>
      <ReactTooltip className={classes.tooltip} />
    </div>
  );
}

export default ViewFileList;
