import React from "react";
import classes from "./aboutPage.module.css";
import { MAX_FILE_COUNT } from "../../constrain/constrain";
import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <div className={classes.root}>
      <h3>Xin chào các bạn sinh viên PTIT,</h3>
      <div>
        <Link to={"/"}>Grade Ptit</Link> được tạo ra để phục vụ mục đích tính
        toán, ước lượng điểm số, GPA của các sinh viên Học viện Công nghệ Bưu
        chính Viễn thông. Chúng tôi đang phát triển một số tính năng mới và
        không ngừng cải thiện chất lượng của các tính năng hiện có. Nếu có bất
        kỳ thắc mắc hay đóng góp, hãy liên hệ với chúng tôi qua{" "}
        <a
          href={"https://www.facebook.com/gradeptit"}
          target={"_blank"}
          rel={"noopener noreferrer"}
        >
          Facebook Page Grade Ptit
        </a>{" "}
        hoặc email{" "}
        <a
          href={"mailto:gradeptit@gmail.com?subject=Feedback to Gradeptit"}
          target={"_blank"}
          rel={"noopener noreferrer"}
        >
          gradeptit@gmail.com
        </a>
      </div>
      <h3>Các tính năng chính của Grade Ptit:</h3>
      <ul>
        <li>
          - <b>Tính điểm tổng kết:</b> tính toán bằng điểm thành phần và cấu
          trúc điểm của môn học.{" "}
          <Link to={"/calc-point"}>Tính điểm tổng kết</Link>
        </li>
        <li>
          - <b>Tạo hồ sơ:</b> mỗi hồ sơ là một kịch bản điểm số khác nhau.{" "}
          <Link to={"/create-file"}>Tạo hồ sơ</Link>
        </li>
        <li>
          - <b>Tính toán, ước lượng điểm số:</b> Với mỗi kịch bản điểm số, có
          thể nhập điểm số hiện tại và điểm số đã cải thiện (hoặc sẽ cải thiện
          trong tương lai). Từ đó tính ra được điểm trung bình của các học kỳ và
          điểm GPA trước và sau cải thiện. Ngoài ra web cũng sẽ hiển thị biểu đồ
          điểm để sinh viên dễ quan sát sự thay đổi của điểm số qua các kỳ.{" "}
          <Link to={"/file-view"}>Tính toán, ước lượng điểm số</Link>
        </li>
        <li>
          - <b>Import điểm:</b> Do không có quyền truy cập vào dữ liệu điểm số
          của trường. Web có chức năng import điểm từ file excel để người dùng
          không phải nhập tay điểm số của mình. File điểm xuất ra ở chức năng
          xem điểm của trang quản lý đào tạo.{" "}
          <Link to={"/file-view"}>Import điểm</Link>
        </li>
        <li>
          - <b>Đặt mục tiêu:</b> Hiện tại chức năng khá đơn giản khi mới dừng
          lại ở việc tính điểm trung bình những môn học còn lại để đạt được mục
          tiêu bằng khá, giỏi, xuất sắc.{" "}
          <Link to={"/file-view"}>Đặt mục tiêu</Link>
        </li>
        <li>
          - <b>Tìm kiếm hồ sơ:</b> Với mục đích có thể chia sẻ điểm số giữa
          những người dùng với nhau, mỗi hồ sơ được phân quyền public hay
          private. Những hồ sơ public có thể được tìm kiếm và xem bởi những
          người dùng khác. Người dùng khác khi vào xem hồ sơ có thể nhân bản hồ
          sơ để thực hiện nhiều hành động hơn.{" "}
          <Link to={"/find-file"}>Tìm kiếm hồ sơ</Link>
        </li>
        <li>
          - <b>Các chức năng khác:</b> <Link to={"/login"}>Đăng nhập</Link>,{" "}
          <Link to={"/register"}>Đăng ký</Link>, Lấy lại mật khẩu, thay avatar
        </li>
      </ul>
      <h3>Thông tin cập nhật:</h3>
      <ul>
        <li>
          - <b>13/7/2023:</b> Cập nhật danh sách môn học của các ngành D19 -
          Truyền thông đa phương tiện và D19 - Công nghệ kỹ thuật điện, điện tử
          - Kỹ thuật điện tử máy tính.
        </li>
        <li>
          - <b>2/9/2023:</b> Thêm chức năng nhân bản hồ sơ.
        </li>
        <li>
          - <b>3/9/2023:</b> Nâng cấp giao diện và sửa một số lỗi hiển thị.
        </li>
        <li>
          - <b>4/9/2023:</b> Thêm chức năng đồng bộ môn học.
        </li>
        <li>
          - <b>4/9/2023:</b> Thêm chức năng import điểm từ file excel.
        </li>
        <li>
          - <b>10/9/2023:</b> Chúng tôi đã giới hạn số hồ sơ mỗi tài khoản có
          thể tạo là {MAX_FILE_COUNT}.
        </li>
        <li>
          - <b>10/9/2023:</b> Thêm chức năng chỉnh sửa môn học.
        </li>
        <li>
          - <b>11/9/2023:</b> Thêm chức năng thêm môn học cho 1 học kỳ và xoá
          môn học.
        </li>
        <li>
          - <b>15/9/2023:</b> Thêm hiển thị biểu đồ điểm ở màn hình tính toán
          điểm GPA.
        </li>
      </ul>
      <h3>
        Grade Ptit Team rất hân hạnh chào đón các bạn ghé thăm. Chúc các bạn có
        những trải nghiệm thật tuyệt vời!
      </h3>
    </div>
  );
}

export default AboutPage;
