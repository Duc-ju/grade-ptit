import React, { useContext, useEffect, useState } from "react";
import classes from "./scheduleGrade.module.scss";
import { useSearchParams } from "react-router-dom";
import { db } from "../../firebase/config";
import firebase from "firebase/compat/app";
import { AiFillLeftCircle } from "@react-icons/all-files/ai/AiFillLeftCircle";
import FullCourse from "../../components/FullCourse";
import { AuthContext, AuthContextType } from "../../context-api/AuthProvider";
import { GrView } from "@react-icons/all-files/gr/GrView";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
// @ts-ignore
import mergeClassNames from "merge-class-names";
import { convertTime } from "../../utils/convertTime";
import sampleFileJSON from "./sampleFile.json";
import useHideFooter from "../../hooks/useHideFooter";
import useHideSnowFlakeButton from "../../hooks/useHideSnowFlakeButton";
import { FileContext, FileContextType } from "../../context-api/FileProvider";
import Tags from "../../components/Tags";
import { FcNext } from "@react-icons/all-files/fc/FcNext";
import FacebookPage from "../../components/FacebookPage";
import { File } from "../../entity/file";
import { Semester } from "../../entity/semester";
import LoadingIcon from "../../common-components/LoadingIcon";

function ScheduleGrade() {
  const { file, setFile } = useContext(FileContext) as FileContextType;
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { user } = useContext(AuthContext) as AuthContextType;
  const [lastScrollTop, setLastScrollTop] = useState(
    window.pageYOffset || document.documentElement.scrollTop
  );
  const [deny, setDeny] = useState(false);
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(0); //0 is down and 1 is up
  const sampleFile = sampleFileJSON as any;

  useHideFooter();
  useHideSnowFlakeButton();

  useEffect(() => {
    if (file) {
      file.isOwner
        ? (document.title = "Grade PTIT | Tính GPA và điểm cải thiện")
        : (document.title = "Grade PTIT | Xem hồ sơ với tư cách khách");
    }
  }, [file]);

  useEffect(() => {
    if (file && deny) {
      navigate("/");
      toast.error("Bạn không có quyền xem hồ sơ này");
    }
  }, [file, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      setScrollDirection(st > lastScrollTop ? 0 : 1);
      setLastScrollTop(st <= 0 ? 0 : st);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);
  useEffect(() => {
    if (!id || !user) {
      sampleFile.semester = sampleFile.semester.filter(
        (s: Semester) => s.subjects && s.subjects.length > 0
      );
      setFile(sampleFile);
      return;
    }
    setFetching(true);
    db.collection("files")
      .where(firebase.firestore.FieldPath.documentId(), "==", id)
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
          let fileInfo = files[0];
          fileInfo.semester = fileInfo.semester.filter(
            (s) => s.subjects && s.subjects.length > 0
          );
          setFile({
            ...fileInfo,
            isOwner: user.uid === files[0].uid,
          });
          setDeny(user.uid !== files[0].uid && !files[0].isPublic);
        } else {
          throw new Error("Hồ sơ không tồn tại");
        }
      })
      .catch((err) => {
        console.error(err);
        navigate("/file-list");
        toast.error("Không thể tải hồ sơ");
      })
      .finally(() => setFetching(false));
  }, [id, user, navigate, setFile, deny, sampleFile]);

  const handleScroll = () => {
    if (scrollDirection === 0) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setTimeout(() => {
      setScrollDirection((old) => (old === 1 ? 0 : 1));
    }, 100);
  };

  return fetching || !file || deny ? (
    <section className={mergeClassNames(classes.root, classes.loading)}>
      <LoadingIcon />
    </section>
  ) : (
    <section className={classes.root}>
      {file && (
        <div className={classes.fileInfo}>
          <span>{file.fullName}</span>
          <span>{file.studentCode}</span>
          {!file.isOwner && (
            <div className={classes.viewOnly}>
              <GrView />
              <span>Chỉ xem</span>
            </div>
          )}
        </div>
      )}
      <div className={classes.createTime}>
        <span>{`Hồ sơ được tạo vào lúc ${convertTime(
          file?.createAt?.seconds
        )}`}</span>
      </div>
      {file && file.major && <FullCourse />}
      <div className={classes.aboutContainer}>
        <h3>
          Xin chào các bạn sinh viên PTIT. Dưới đây là phần giới thiệu chức năng
          ước lượng điểm cải thiện
        </h3>
        <ul className={classes.about}>
          <li>
            <span>
              <FcNext />
              Mỗi môn học sẽ có 2 ô nhập điểm, ô đầu tiên dùng để chọn điểm hiện
              tại. Nếu điểm hiện tại không phải là A+ sẽ có 1 ô bên cạnh để chọn
              điểm cải thiện. Sau khi thay đổi điểm của một 1 môn học, điểm
              trung bình học kỳ và điểm GPA sẽ được cập nhật ngay lập tức.
            </span>
          </li>
          <li>
            <span>
              <FcNext />
              Để dử dụng chức năng import điểm, các bạn hãy vào trang quản lý
              đào tạo, click xem điểm, click xuất excel sau đó click import điểm
              ở trang hiện tại, chọn file bạn vừa tải về. Ngay sau đó danh sách
              môn học với điểm tương ứng sẽ hiện lên màn hình. Nếu muốn lưu điểm
              ngay, các bạn click import điểm. Nếu chỉ muốn cập nhật trên màn
              hình và không lưu ngay, các bạn click cập nhật màn hình.
            </span>
          </li>
          <li>
            <span>
              <FcNext />
              Khi muốn xoá tất cả điểm đã nhập, các bạn hãy click nút reset tất
              cả điểm, lưu ý khi đã xoá điểm không thể phục hồi lại được nữa.
            </span>
          </li>
          <li>
            <span>
              <FcNext />
              Chức năng đặt mục tiêu hiện tại Grade Ptit làm khá đơn giản. Chúng
              mình sẽ tính xem những môn còn lại bạn phải đạt được trung bình
              GPA là bao nhiêu thì mới đạt mục tiêu đã chọn. Grade Ptit sẽ nâng
              cấp chức năng này trong tương lai.
            </span>
          </li>
          <li>
            <span>
              <FcNext />
              Khi click vào nút nhân bản hồ sơ, một hồ sơ mới sẽ được tạo và có
              thông tin giống hệt như hồ sơ bạn vừa chọn để nhân bản. Chúng tôi
              thêm vào cuối tên hồ sơ mới được tạo ra chuỗi ký tự "(1)" để đảm
              bảo rằng bạn phân biệt được hồ sơ ban đầu và hồ sơ bản sao.
            </span>
          </li>
          <li>
            <span>
              <FcNext />
              Danh sách môn học trên Grade Ptit có thể được cập nhật mới trong
              tương lai. Trong trường hợp các bạn thấy xuất hiện một số ở nút
              đồng bộ môn học, các bạn hãy click vào đó để xem những môn học ở
              hồ sơ của bạn đang bị khác với thông tin của chúng tôi.
            </span>
          </li>
          <li>
            <span>
              <FcNext />Ở trên mỗi học kỳ có một chiếc công tắc. Khi bật công
              tắc lên bạn có thể thêm, sửa, xoá các môn học trong 1 học kỳ. Lưu
              ý mã môn học có thể liên quan đến chức năng đồng bộ môn học và
              import điểm, vì vậy bạn hãy nhập chính xác nhé. Nếu chẳng may
              chỉnh sửa quá lố, hãy dùng tính năng đồng bộ môn học.
            </span>
          </li>
        </ul>
      </div>
      <FacebookPage className={classes.facebookPage} />
      <Tags
        tags={[
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
      <div className={classes.buttonContainer}>
        <button
          onClick={handleScroll}
          className={
            scrollDirection === 0 ? classes.scrollDown : classes.scrollUp
          }
        >
          <AiFillLeftCircle />
        </button>
      </div>
    </section>
  );
}

export default ScheduleGrade;
