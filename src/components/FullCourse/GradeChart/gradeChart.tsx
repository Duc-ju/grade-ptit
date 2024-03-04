import React, { useContext } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FileContext,
  FileContextType,
} from "../../../context-api/FileProvider";
import calculateNewCPAToSemester from "../../../utils/calculateNewCPAToSemester";
import classes from "./gradeChart.module.css";
import calculateNewGPASemester from "../../../utils/calculateNewGPASemester";
import ReactTooltip from "react-tooltip";

export default function GradeChart() {
  const { semesterState } = useContext(FileContext) as FileContextType;
  const data = semesterState.map((semester, index) => {
    return {
      name: semester.name,
      "Điểm GPA học kỳ": calculateNewGPASemester(semester).gpa.toFixed(2),
      "Điểm CPA": calculateNewCPAToSemester(index, semesterState).gpa.toFixed(
        2
      ),
    };
  });

  return (
    <div className={classes.root}>
      <LineChart
        width={Math.floor(
          window.innerWidth > 1000 ? 1000 * 0.9 : window.innerWidth * 0.9
        )}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="Điểm GPA học kỳ"
          stroke="#FF9999"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="Điểm CPA" stroke="#bb2019" />
      </LineChart>
      <ReactTooltip />
    </div>
  );
}
