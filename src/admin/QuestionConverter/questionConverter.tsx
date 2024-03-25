import React, { useState } from "react";
import classes from "./questionConverter.module.css";
import LoadingButton from "../../common-components/LoadingButton";
import useHideFooter from "../../hooks/useHideFooter";
import { toast, ToastContainer } from "react-toastify";

function QuestionConverter() {
  const [title, setTitle] = useState("");
  const [bonus, setBonus] = useState("");
  const [answer1Title, setAnswer1Title] = useState("");
  const [answer1Key, setAnswer1Key] = useState(false);
  const [answer2Title, setAnswer2Title] = useState("");
  const [answer2Key, setAnswer2Key] = useState(false);
  const [answer3Title, setAnswer3Title] = useState("");
  const [answer3Key, setAnswer3Key] = useState(false);
  const [answer4Title, setAnswer4Title] = useState("");
  const [answer4Key, setAnswer4Key] = useState(false);
  const [questions, setQuestion] = useState<any[]>([]);
  useHideFooter();
  const handleAddSubject = () => {
    if (
      !title ||
      !answer1Title ||
      !answer2Title ||
      !answer3Title ||
      !answer4Title
    ) {
      toast.error("Nhập thiếu thông tin rồi bờ rô");
      return;
    }
    if (!answer1Key && !answer2Key && !answer3Key && !answer4Key) {
      toast.error("Chưa chọn đáp án rồi bờ rô");
      return;
    }
    setQuestion([
      ...questions,
      {
        title,
        bonus,
        answers: [
          {
            title: answer1Title,
            isKey: answer1Key,
            idx: 1,
          },
          {
            title: answer2Title,
            isKey: answer2Key,
            idx: 2,
          },
          {
            title: answer3Title,
            isKey: answer3Key,
            idx: 3,
          },
          {
            title: answer4Title,
            isKey: answer4Key,
            idx: 4,
          },
        ],
      },
    ]);
    setTitle("");
    setBonus("");
    setAnswer1Title("");
    setAnswer1Key(false);
    setAnswer2Title("");
    setAnswer2Key(false);
    setAnswer3Title("");
    setAnswer3Key(false);
    setAnswer4Title("");
    setAnswer4Key(false);
  };
  return (
    <div className={classes.root}>
      <div className={classes.inputLeft}>
        <div>
          <label>Tiêu đề</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={"Tiêu đề"}
          />
        </div>
        <div>
          <label>Đáp án A</label>
          <input
            value={answer1Title}
            onChange={(e) => setAnswer1Title(e.target.value)}
            placeholder={"Đáp án A"}
          />
          <input
            type={"checkbox"}
            checked={answer1Key}
            onChange={(e) => setAnswer1Key(e.target.checked)}
          />
        </div>
        <div>
          <label>Đáp án B</label>
          <input
            value={answer2Title}
            onChange={(e) => setAnswer2Title(e.target.value)}
            placeholder={"Đáp án B"}
          />
          <input
            checked={answer2Key}
            onChange={(e) => setAnswer2Key(e.target.checked)}
            type={"checkbox"}
          />
        </div>
        <div>
          <label>Đáp án C</label>
          <input
            value={answer3Title}
            onChange={(e) => setAnswer3Title(e.target.value)}
            placeholder={"Đáp án C"}
          />
          <input
            checked={answer3Key}
            onChange={(e) => setAnswer3Key(e.target.checked)}
            type={"checkbox"}
          />
        </div>
        <div>
          <label>Đáp án D</label>
          <input
            value={answer4Title}
            onChange={(e) => setAnswer4Title(e.target.value)}
            placeholder={"Đáp án D"}
          />
          <input
            checked={answer4Key}
            onChange={(e) => setAnswer4Key(e.target.checked)}
            type={"checkbox"}
          />
        </div>
        <div>
          <label>Bonus</label>
          <input
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
            placeholder={"Bonus"}
          />
        </div>
        <LoadingButton onClick={handleAddSubject} className={classes.addButton}>
          Thêm
        </LoadingButton>
      </div>
      <div className={classes.resultRight}>
        <label>Dữ liệu</label>
        <textarea placeholder={"Dữ liệu"} value={JSON.stringify(questions)} />
      </div>
      <ToastContainer />
    </div>
  );
}

export default QuestionConverter;
