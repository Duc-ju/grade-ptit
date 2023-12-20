import React, { useEffect, useState } from "react";
import classes from "./resetPassword.module.css";
import * as validate from "../../../utils/validate";
import { auth } from "../../../firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import LoadingButton from "../../../common-components/LoadingButton";

function ResetPassword(props: { setTab: Function }) {
  const { setTab } = props;
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    document.title = "Grade PTIT | Đặt lại mật khẩu";
  }, []);

  const handleChangeEmail = (e: any) => {
    setEmail(e.target.value);
    const validateEmail = validate.validateEmail(e.target.value);
    if (emailError && !validateEmail) setEmailError("");
    if (emailError && validateEmail) setEmailError(validateEmail);
  };

  const handleLogin = (e: any) => {
    e.preventDefault();
    let error = false;
    const validateEmail = validate.validateEmail(email);
    if (validateEmail) {
      setEmailError(validateEmail);
      error = true;
    }
    if (error) return;
    setFetching(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.info("Check mail đi bờ rô. Nhớ check cả phần thư rác nhé!");
      })
      .catch((e) => {
        console.error(e);
        toast.error("Gửi yêu cầu không thành công");
      })
      .finally(() => {
        setFetching(false);
        setTab(1);
      });
  };

  return (
    <form className={classes.body} onSubmit={handleLogin}>
      <h3>Lấy lại mật khẩu</h3>
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
      <div className={classes.goBack} onClick={() => setTab(1)}>
        Đăng nhập
      </div>
      <LoadingButton
        className={classes.registerButton}
        fullWidth={true}
        type={"submit"}
        fetching={fetching}
      >
        Gửi yêu cầu
      </LoadingButton>
    </form>
  );
}

export default ResetPassword;
