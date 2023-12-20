import React, { useContext, useEffect, useState } from "react";
import classes from "./header.module.css";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { AiOutlineMenu } from "@react-icons/all-files/ai/AiOutlineMenu";
import { MdAccountCircle } from "@react-icons/all-files/md/MdAccountCircle";
import { AiOutlineInfoCircle } from "@react-icons/all-files/ai/AiOutlineInfoCircle";
import { FcFeedback } from "@react-icons/all-files/fc/FcFeedback";
// @ts-ignore
import mergeClassNames from "merge-class-names";
import { GrLogout } from "@react-icons/all-files/gr/GrLogout";
import { FiUserPlus } from "@react-icons/all-files/fi/FiUserPlus";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import emptyAvatar from "../../static/img/empty-avatar.png";
import ReactTooltip from "react-tooltip";
import { FiFilePlus } from "@react-icons/all-files/fi/FiFilePlus";
import { GiFiles } from "@react-icons/all-files/gi/GiFiles";
import { AiOutlineFileSearch } from "@react-icons/all-files/ai/AiOutlineFileSearch";
import { AiFillCalculator } from "@react-icons/all-files/ai/AiFillCalculator";
import { FaFile } from "@react-icons/all-files/fa/FaFile";
import SnowMan from "./SnowMan";
import { SHOW_CHRISTMAS_THEME } from "../../constrain/constrain";
import { auth, db } from "../../firebase/config";
import { AuthContext, AuthContextType } from "../../context-api/AuthProvider";

function Header() {
  const [width, setWidth] = useState(window.innerWidth);
  const [openMenu, setOpenMenu] = useState(false);
  const { user, setUser } = useContext(AuthContext) as AuthContextType;
  const inputFileRef = React.createRef<HTMLInputElement>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setOpenMenu(false);
  }, [location.pathname]);

  const handleLogout = () => {
    window.localStorage.removeItem("user");
    setUser(null);
    signOut(auth)
      .then(() => {
        toast.info("Bờ rô đã đăng xuất thành công!");
        navigate("/login");
      })
      .catch((e) => {
        toast.error("Đăng xuất mà cũng bị lỗi bờ rô ạ, thử lại nhé!");
      });
  };

  const handleOpenMenu = () => {
    setOpenMenu(true);
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  const activeItemClass = mergeClassNames(classes.menuItem, classes.active);
  const menuClasses = mergeClassNames(
    classes.mobileMenu,
    openMenu ? classes.open : ""
  );
  const redundantClass = mergeClassNames(
    classes.redundantButton,
    openMenu ? classes.open : ""
  );
  const rootClass = mergeClassNames(classes.root, openMenu ? classes.open : "");

  const handleSelectFile = () => {
    inputFileRef.current?.click();
  };

  const handleChooseFile = (e: any) => {
    if (!user) return;
    const file = e.target.files[0];
    if (
      file.type.split("/").length === 0 ||
      file.type.split("/")[0] !== "image"
    ) {
      alert("Vui lòng chọn file hình ảnh");
      return;
    }
    if (file.size > 1048576) {
      alert("Vui lòng chọn ảnh có kích thước dưới 1MB và tỉ lệ 1:1");
      return;
    }
    const fileName = (Math.random() + "").split(".")[1] + file.name;
    const storage = getStorage();
    const storageRef = ref(storage, "images/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      () => {},
      () => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const userRef = db.collection("users").doc(user.id);
          userRef
            .update({
              avatar: downloadURL,
              createAt: user.createAt,
              email: user.email,
              fullName: user.fullName,
              studentCode: user.studentCode,
              uid: user.uid,
            })
            .then(() => {
              setUser({
                ...user,
                avatar: downloadURL,
              });
              window.localStorage.setItem(
                "user",
                JSON.stringify({
                  ...user,
                  avatar: downloadURL,
                })
              );
              toast.info("Cập nhật ảnh đại diện thành công!");
            });
        });
      }
    );
  };

  return (
    <div className={rootClass}>
      {SHOW_CHRISTMAS_THEME && <SnowMan />}
      <input
        type={"file"}
        onChange={handleChooseFile}
        ref={inputFileRef}
        className={classes.fileInput}
        accept={"image/gif, image/jpeg, image/png"}
      />
      {width <= 1024 && (
        <>
          <div className={redundantClass} onClick={handleCloseMenu}></div>
          <div className={menuClasses}>
            <h2 className={classes.header}>GRADEPTIT</h2>
            <ul className={classes.accountSession}>
              {!user && (
                <>
                  <li className={classes.menuItem}>
                    <NavLink
                      to={"/login"}
                      className={(navData) =>
                        navData.isActive
                          ? mergeClassNames(
                              classes.menuItemContent,
                              classes.active
                            )
                          : classes.menuItemContent
                      }
                    >
                      <span className={classes.icon}>
                        <MdAccountCircle />
                      </span>
                      <span className={classes.title}>Đăng nhập</span>
                    </NavLink>
                  </li>
                  <li className={classes.menuItem}>
                    <NavLink
                      to={"/register"}
                      className={(navData) =>
                        navData.isActive
                          ? mergeClassNames(
                              classes.menuItemContent,
                              classes.active
                            )
                          : classes.menuItemContent
                      }
                    >
                      <span className={classes.icon}>
                        <FiUserPlus />
                      </span>
                      <span className={classes.title}>Đăng ký</span>
                    </NavLink>
                  </li>
                </>
              )}
              {user && (
                <>
                  <li className={classes.userInfoContainer}>
                    <div className={classes.chooseAvatar}>
                      <span
                        className={classes.avatar}
                        onClick={handleSelectFile}
                        data-tip={
                          user.avatar
                            ? "Thay ảnh đại diện"
                            : "Thêm ảnh đại diện"
                        }
                      >
                        <img
                          className={classes.avatarImg}
                          alt={user.fullName.charAt(0)}
                          src={user.avatar || emptyAvatar}
                        />
                      </span>
                    </div>
                    <div className={classes.userInfo}>
                      <span>{user.fullName}</span>
                      <span>{user.studentCode}</span>
                      <span>{user.email}</span>
                    </div>
                  </li>
                  <li className={classes.menuItem}>
                    <div
                      className={classes.menuItemContent}
                      onClick={handleLogout}
                    >
                      <span className={classes.icon}>
                        <GrLogout />
                      </span>
                      <span className={classes.title}>Đăng xuất</span>
                    </div>
                  </li>
                </>
              )}
            </ul>
            <ul className={classes.listItem}>
              <li className={activeItemClass}>
                <NavLink
                  to={"/file-list"}
                  className={(navData) =>
                    navData.isActive
                      ? mergeClassNames(classes.menuItemContent, classes.active)
                      : classes.menuItemContent
                  }
                >
                  <span className={classes.icon}>
                    <GiFiles />
                  </span>
                  <span className={classes.title}>Xem hồ sơ</span>
                </NavLink>
              </li>
              {!user && (
                <li className={activeItemClass}>
                  <NavLink
                    to={"/file-view"}
                    className={(navData) =>
                      navData.isActive
                        ? mergeClassNames(
                            classes.menuItemContent,
                            classes.active
                          )
                        : classes.menuItemContent
                    }
                  >
                    <span className={classes.icon}>
                      <FaFile />
                    </span>
                    <span className={classes.title}>Xem hồ sơ mẫu</span>
                  </NavLink>
                </li>
              )}
              <li className={activeItemClass}>
                <NavLink
                  to={"/create-file"}
                  className={(navData) =>
                    navData.isActive
                      ? mergeClassNames(classes.menuItemContent, classes.active)
                      : classes.menuItemContent
                  }
                >
                  <span className={classes.icon}>
                    <FiFilePlus />
                  </span>
                  <span className={classes.title}>Tạo hồ sơ mới</span>
                </NavLink>
              </li>
              <li className={activeItemClass}>
                <NavLink
                  to={"/find-file"}
                  className={(navData) =>
                    navData.isActive
                      ? mergeClassNames(classes.menuItemContent, classes.active)
                      : classes.menuItemContent
                  }
                >
                  <span className={classes.icon}>
                    <AiOutlineFileSearch />
                  </span>
                  <span className={classes.title}>Tìm kiếm hồ sơ</span>
                </NavLink>
              </li>
              <li className={activeItemClass}>
                <NavLink
                  to={"/calc-point"}
                  className={(navData) =>
                    navData.isActive
                      ? mergeClassNames(classes.menuItemContent, classes.active)
                      : classes.menuItemContent
                  }
                >
                  <span className={classes.icon}>
                    <AiFillCalculator />
                  </span>
                  <span className={classes.title}>Tính điểm tổng kết</span>
                </NavLink>
              </li>
              <li className={activeItemClass}>
                <NavLink
                  to={"/about"}
                  className={(navData) =>
                    navData.isActive
                      ? mergeClassNames(classes.menuItemContent, classes.active)
                      : classes.menuItemContent
                  }
                >
                  <span className={classes.icon}>
                    <AiOutlineInfoCircle />
                  </span>
                  <span className={classes.title}>Giới thiệu</span>
                </NavLink>
              </li>
              <li className={classes.menuItem}>
                <a
                  href={
                    "mailto:gradeptit@gmail.com?subject=Feedback to Gradeptit"
                  }
                  target={"_blank"}
                  rel={"noopener noreferrer"}
                  className={classes.menuItemContent}
                >
                  <span className={classes.icon}>
                    <FcFeedback />
                  </span>
                  <span className={classes.title}>Góp ý</span>
                </a>
              </li>
            </ul>
          </div>
        </>
      )}
      <div className={classes.left}>
        <Link to={"/"}>GRADE PTIT</Link>
      </div>
      {width < 1024 && (
        <div className={classes.menuButtonContainer}>
          <button className={classes.menuButton} onClick={handleOpenMenu}>
            <AiOutlineMenu />
          </button>
        </div>
      )}
      {width >= 1024 && (
        <div className={classes.right}>
          {width > 1100 && (
            <>
              {user && <Link to={"/file-list"}>Xem hồ sơ</Link>}
              {!user && <Link to={"/file-view"}>Xem hồ sơ mẫu</Link>}
              {user && <Link to={"/find-file"}>Tìm kiếm hồ sơ</Link>}
            </>
          )}
          <Link to={"/about"}>Giới thiệu</Link>
          <a
            href={"mailto:gradeptit@gmail.com?subject=Feedback to Gradeptit"}
            target={"_blank"}
            rel={"noopener noreferrer"}
          >
            Góp ý
          </a>
          {user ? (
            <div className={classes.infoContainer}>
              <div className={classes.info}>
                <span>{user.fullName}</span>
                <span>{user.studentCode}</span>
              </div>
              <div className={classes.avatar}>
                <img
                  className={classes.avatarImg}
                  alt={user.fullName.charAt(0)}
                  src={user.avatar || emptyAvatar}
                />
              </div>
              <div className={classes.popup}>
                <div className={classes.popupContainer}>
                  <div className={classes.popupRow}>
                    <div className={classes.popupLeft}>
                      <span
                        onClick={handleSelectFile}
                        className={classes.popUpAvatar}
                        data-tip={
                          user.avatar
                            ? "Thay ảnh đại diện"
                            : "Thêm ảnh đại diện"
                        }
                      >
                        <img
                          className={classes.avatarImg}
                          alt={user.fullName.charAt(0)}
                          src={user.avatar || emptyAvatar}
                        />
                      </span>
                    </div>
                    <div className={classes.popupRight}>
                      <span>{user.fullName}</span>
                      <span>{user.studentCode}</span>
                      <span>{user.email}</span>
                    </div>
                  </div>
                  <div className={classes.logoutContainer}>
                    <button
                      className={classes.logoutButton}
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link to={"/login"}>Đăng nhập</Link>
              <Link to={"/register"}>Đăng kí</Link>
            </>
          )}
        </div>
      )}
      <ReactTooltip className={classes.tooltip} />
    </div>
  );
}

export default Header;
