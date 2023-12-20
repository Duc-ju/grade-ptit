import React, { useContext, useEffect, useState } from "react";
import classes from "./loginBody.module.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase/config";
import { toast } from "react-toastify";
import { BsFacebook, BsGoogle } from "react-icons/bs";
import {
  AuthContext,
  AuthContextType,
  User,
} from "../../../context-api/AuthProvider";
import { useNavigate } from "react-router";
import * as validate from "../../../utils/validate";
import LoadingButton from "../../../common-components/LoadingButton";

function LoginBody(props: { setTab: Function }) {
  const { setTab } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fetching, setFetching] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const { setUser } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Grade PTIT | Đăng Nhập";
  }, []);
  const handleLogin = (e: any) => {
    e.preventDefault();
    let error = false;
    const validatePassword = validate.validatePassword(password);
    if (validatePassword) {
      setPasswordError(validatePassword);
      error = true;
    }
    const validateEmail = validate.validateEmail(email);
    if (validateEmail) {
      setEmailError(validateEmail);
      error = true;
    }
    if (error) return;
    setFetching(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userLogin = userCredential.user;
        db.collection("users")
          .where("uid", "==", userLogin.uid)
          .limit(1)
          .get()
          .then((snapshot) => {
            return snapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
          })
          .then((userResponse) => {
            const user = userResponse as User[];
            if (user && user.length) {
              setUser(user[0]);
              window.localStorage.setItem("user", JSON.stringify(user[0]));
              db.collection("files")
                .where("uid", "==", user[0].uid)
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
                  if (!files.length) {
                    navigate("/create-root-file");
                    toast.info("Bạn hãy vui lòng tạo hồ sơ gốc!");
                  }
                })
                .catch((e) => {
                  toast.error("Có lỗi xảy ra");
                });
            }
          });
        toast.info("Đăng nhập thành công");
        navigate("/");
      })
      .catch((error) => {
        toast.error("Email hoặc mật khẩu không đúng");
      })
      .finally(() => setFetching(false));
  };
  const handleChangeEmail = (e: any) => {
    setEmail(e.target.value);
    const validateEmail = validate.validateEmail(e.target.value);
    if (emailError && !validateEmail) setEmailError("");
    if (emailError && validateEmail) setEmailError(validateEmail);
  };
  const handleChangePassword = (e: any) => {
    setPassword(e.target.value);
    const validatePassword = validate.validatePassword(e.target.value);
    if (passwordError && !validatePassword) setPasswordError("");
    if (passwordError && validatePassword) setPasswordError(validatePassword);
  };

  const handleForgotPassword = () => {
    setTab(3);
  };

  const handleGoogleLogin = () => {
    toast.info(
      "Tính năng này đang được phát triển. Bạn hãy đăng nhập bằng email và mật khẩu nhé."
    );
  };

  const handleFacebookLogin = () => {
    toast.info(
      "Tính năng này đang được phát triển Bạn hãy đăng nhập bằng email và mật khẩu nhé."
    );
  };
  return (
    <form className={classes.body} onSubmit={handleLogin}>
      <h3>Với các tài khoản mạng xã hội</h3>
      <div className={classes.social}>
        <div className={classes.googleButton} onClick={handleGoogleLogin}>
          <span className={classes.icon}>
            <BsGoogle />
          </span>
          <span>Google</span>
        </div>
        <div className={classes.facebookButton} onClick={handleFacebookLogin}>
          <span className={classes.icon}>
            <BsFacebook />
          </span>
          <span>Facebook</span>
        </div>
      </div>
      <div className={classes.br}>hoặc</div>
      <div className={classes.inputGroup}>
        <div className={classes.fieldLabel}>Email</div>
        <input
          className={classes.textInput}
          placeholder={"Email"}
          value={email}
          onChange={handleChangeEmail}
        />
        {emailError && (
          <span className={classes.errorMessage}>{emailError}</span>
        )}
      </div>
      <div className={classes.inputGroup}>
        <div className={classes.fieldLabel}>Mật khẩu</div>
        <input
          type={"password"}
          className={classes.textInput}
          placeholder={"Mật khẩu"}
          value={password}
          onChange={handleChangePassword}
        />
        {passwordError && (
          <span className={classes.errorMessage}>{passwordError}</span>
        )}
      </div>
      <div className={classes.forgotPassword} onClick={handleForgotPassword}>
        Quên mật khẩu
      </div>
      <LoadingButton
        className={classes.loginButton}
        type={"submit"}
        fullWidth={true}
        fetching={fetching}
      >
        Đăng nhập
      </LoadingButton>
    </form>
  );
}

export default LoginBody;
