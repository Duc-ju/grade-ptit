import React, { useState } from "react";
// @ts-ignore
import mergeClassNames from "merge-class-names";
import snowman from "../../../static/img/snowman.png";
import classes from "./snowMan.module.css";

function SnowMan() {
  const audioTunes = [
    "./music/All-I-Want-For-Christmas-Is-Yo-M.mp3",
    "./music/Feliz-Navidad-Boney-M-NhacPronet.mp3",
    "./music/Jingle-Bells-Crazy-Frog-NhacPron.mp3",
    "./music/Mary-s-Boy-Child-Oh-My-Lord-Bone.mp3",
    "./music/We-Wish-You-A-Merry-Christmas-Cr.mp3",
  ];

  const [currentAudio, setCurrentAudio] = useState<number>(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = React.createRef<HTMLAudioElement>();

  const handleSnowmanClick = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      const randomIndex = Math.floor(Math.random() * 5);
      audioRef.current.load();
      audioRef.current.play();
      setCurrentAudio(randomIndex);
    }
    setPlaying((oldPlaying) => !oldPlaying);
  };

  return (
    <>
      <audio id="audio" ref={audioRef}>
        <source src={audioTunes[currentAudio]} />
        Your browser does not support the <code>audio</code> element.
      </audio>
      <div
        className={mergeClassNames(
          classes.snowman,
          playing ? classes.isPlaying : ""
        )}
        onClick={handleSnowmanClick}
        data-tip={"Nhạc Noel"}
      >
        <img alt={"snow-man"} src={snowman} />
      </div>
    </>
  );
}

export default SnowMan;
