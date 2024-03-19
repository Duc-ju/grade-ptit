import React, { useContext, useEffect, useState } from "react";
import { auth } from "../../firebase/config";
import { AuthContext, AuthContextType } from "../../context-api/AuthProvider";
import { toast } from "react-toastify";
import classes from "./deleteAccount.module.css";
import LoadingButton from "../../common-components/LoadingButton";
import { useNavigate } from "react-router";

function DeleteAccount() {
  const { user, setUser } = useContext(AuthContext) as AuthContextType;
  const [fetching, setFetching] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Grade Tool | Xoá tài khoản";
  }, []);

  const handleDelete = () => {
    if (!user || !auth.currentUser) {
      toast.info("Vui lòng đăng nhập để sử dụng chức năng này");
      return;
    }
    if (user?.email !== confirmPassword) {
      toast.error("Địa chỉ email xác nhận không đúng");
      return;
    }
    const res = window.confirm("Bạn có chắc chắn muốn xoá tài khoản chứ?");
    if (res) {
      setFetching(true);
      auth.currentUser
        .delete()
        .then(() => {
          toast.info("Xoá tài khoản thành công");
          setUser(null);
          navigate("/");
        })
        .catch(() => {
          toast.error("Có lỗi xảy ra khi xoá tài khoản");
        })
        .finally(() => setFetching(false));
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.parent}>
        <div className={classes.topContainer}>
          <div className={classes.container}>
            <h2 className={classes.header}>Xoá tài khoản</h2>
            <div className={classes.formContainer}>
              <div>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={"Xác nhân email"}
                />
              </div>
              <p className={classes.confirm}>
                Khi xác nhận xoá tài khoản, toàn bộ thông tin và hồ sơ điểm sẽ
                được xoá khỏi hệ thống.
              </p>
              <LoadingButton fetching={fetching} onClick={handleDelete}>
                Xác nhận xoá
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccount;
