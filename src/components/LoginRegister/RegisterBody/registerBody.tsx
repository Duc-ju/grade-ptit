import React, { useContext, useEffect, useState } from "react";
import classes from "./registerBody.module.css";
import { auth } from "../../../firebase/config";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";
import { addDocument } from "../../../firebase/service";
import {
  AuthContext,
  AuthContextType,
} from "../../../context-api/AuthProvider";
import * as validate from "../../../utils/validate";
import LoadingButton from "../../../common-components/LoadingButton";

function RegisterBody() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [fetching, setFetching] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [studentCodeError, setStudentCodeError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext) as AuthContextType;
  useEffect(() => {
    document.title = "Grade PTIT | Đăng ký";
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
    if (error) return;
    setFetching(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        addDocument("users", {
          uid: user.uid,
          studentCode,
          fullName,
          email,
        }).then((docRef) => {
          setUser({
            id: docRef.id,
            uid: user.uid,
            studentCode,
            fullName,
            email,
          });
          window.localStorage.setItem(
            "user",
            JSON.stringify({
              id: docRef.id,
              uid: user.uid,
              studentCode,
              fullName,
              email,
            })
          );
          toast.info("Đăng ký thành công");
          navigate("/create-root-file");
        });
      })
      .catch((error) => {
        toast.error("Đăng ký không thành công");
      })
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
  return (
    <form className={classes.body} onSubmit={handleLogin}>
      <h3>Đăng ký và bắt đầu trải nghiệm ngay!</h3>
      <div className={classes.inputGroup}>
        <div className={classes.fieldLabel}>Họ và tên</div>
        <input
          className={classes.textInput}
          placeholder={"Họ và tên"}
          value={fullName}
          onChange={handleChaneFullName}
        />
        {fullNameError && (
          <span className={classes.errorMessage}>{fullNameError}</span>
        )}
      </div>
      <div className={classes.inputGroup}>
        <div className={classes.fieldLabel}>Mã sinh viên</div>
        <input
          className={classes.textInput}
          placeholder={"Mã sinh viên"}
          value={studentCode}
          onChange={handleChangeStudentCode}
        />
        {studentCodeError && (
          <span className={classes.errorMessage}>{studentCodeError}</span>
        )}
      </div>
      <div className={classes.inputGroup}>
        <div className={classes.fieldLabel}>Email</div>
        <input
          type={"email"}
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
      <LoadingButton
        className={classes.registerButton}
        fullWidth={true}
        type={"submit"}
        fetching={fetching}
      >
        Đăng ký
      </LoadingButton>
    </form>
  );
}

export default RegisterBody;
