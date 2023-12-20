import React, { useEffect, useState } from "react";
import classes from "./login.module.css";
import LoginBody from "./LoginBody";
import mergeClassNames from "merge-class-names";
import RegisterBody from "./RegisterBody";
import { useLocation } from "react-router-dom";
import ResetPassword from "./ResetPassword";

function Login(props) {
    const location = useLocation();
    const [tab, setTab] = useState(() => {
        if (location.pathname === "/login") return 1;
        if (location.pathname === "/register") return 2;
    });
    useEffect(() => {
        if (location.pathname === "/login") setTab(1);
        if (location.pathname === "/register") setTab(2);
    }, [location.pathname]);
    const loginClasses = mergeClassNames(
        classes.login,
        tab === 1 || tab === 3 ? classes.active : null
    );
    const registerClasses = mergeClassNames(
        classes.login,
        tab === 2 ? classes.active : null
    );
    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <div className={classes.header}>
                    <div className={loginClasses} onClick={() => setTab(1)}>
                        Đăng nhập
                    </div>
                    <div className={registerClasses} onClick={() => setTab(2)}>
                        Đăng ký
                    </div>
                </div>
                {tab === 1 && <LoginBody setTab={setTab} />}
                {tab === 2 && <RegisterBody />}
                {tab === 3 && <ResetPassword setTab={setTab} />}
            </div>
        </div>
    );
}

export default Login;
