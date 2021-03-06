import React, { useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import {
  motion,
  useAnimation,
  usePresence,
  AnimatePresence,
} from "framer-motion";
import { deleteEntry, stopTimer, updateDescription } from "../services/api";
import { FaStop, FaShare, FaTrash } from "react-icons/fa";
import copy from "copy-to-clipboard";
import { encode } from "../utils/base64";
import Project from "./Project";
import Tags from "./Tags";

const MotionContainer = styled(motion.div)`
  background: #e8eaec;
  padding: 1em;
  border-radius: 12px;
  height: 4em;
  box-shadow: 0 4px 8px -4px #00000020;
  display: flex;
  align-items: center;
  position: absolute;
  width: 90%;
  margin: 1em 5%;

  & > * {
    margin: 0.5em;
  }
`;

const Input = styled.input`
  border: none;
  border-radius: 8px;
  padding: 0.4em;
  margin: 0 0.2em;
  font-size: 16px;
  background: transparent;

  :focus {
    background: white;
  }
`;

const Description = styled(Input)`
  flex: 1;
  transition: all 0.2s ease-in;
`;

const Time = styled(Input)`
  max-width: 6em;
`;

const Stop = styled(motion.button)`
  background: #f72e50;
  border-radius: 50%;
  border: none;
  height: 40px;
  width: 40px;
  box-shadow: 0 0 8px 0px #f72e5040;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: 0.2s ease-in;

  :hover {
    box-shadow: 0 0 12px 8px #00000010;
  }
`;

const SmallButton = styled.button`
  border: none;
  background: none;
  font-size: 12px;
  color: #808080;
  padding: 0.6em;
  border-radius: 4px;
  transition: 0.2s ease-in;

  :hover {
    color: #424242;
  }
`;

const Entry = ({
  id,
  index,
  description,
  timeInterval,
  onDelete: removeEntry,
  updateEntry,
  projectId,
  billable,
  tagIds,
}) => {
  const getDelta = useCallback(
    () =>
      dayjs(dayjs(timeInterval.end || dayjs()) - dayjs(timeInterval.start))
        .add(3, "hour")
        .format("HH:mm:ss"),
    [timeInterval]
  );

  const [delta, setDelta] = useState(getDelta());

  const controls = useAnimation();
  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    if (!timeInterval.end) {
      const interval = setInterval(() => {
        setDelta(getDelta());
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [timeInterval, getDelta]);

  useEffect(() => {
    if (timeInterval.end == null) {
      const time = delta.replace(/00:/g, "");
      const suffix = { 2: "sec", 5: "min" }[time.length] || "";

      document.title = `${time} ${suffix} • ftfy`;
    }

    return () => (document.title = `ftfy`);
  }, [delta, timeInterval.end]);

  useEffect(() => {
    setTimeout(
      () =>
        controls.start({
          scale: 1,
        }),
      index * 50
    );
  }, [controls, index]);

  useEffect(() => {
    if (!isPresent) {
      controls.start({
        scale: 0.4,
        opacity: 0,
      });

      setTimeout(safeToRemove, 500);
    }
  }, [isPresent, safeToRemove, controls]);

  useEffect(() => {
    controls.start({
      y: index * 80,
    });
  }, [index, controls]);

  const handleDelete = () => {
    deleteEntry(id).then(() => removeEntry(id));
  };

  const handleStop = () => {
    stopTimer().then(updateEntry);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/${encode({
      description,
      ...timeInterval,
      projectId,
      billable,
    })}`;
    copy(url);
  };

  const handleDescriptionUpdate = (event) => {
    const { value } = event.target;
    updateDescription(id, { description: value }).then(updateEntry);
  };

  return (
    <MotionContainer
      initial={{ scale: 0, y: 0 }}
      animate={controls}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
    >
      <Project id={projectId} />
      <Tags ids={tagIds || []} />
      <Description
        defaultValue={description}
        onBlur={handleDescriptionUpdate}
      />
      <Time value={delta} readOnly />
      <SmallButton onClick={handleShare}>
        <FaShare />
      </SmallButton>
      <SmallButton onClick={handleDelete}>
        <FaTrash />
      </SmallButton>
      <AnimatePresence>
        {!timeInterval.end && (
          <Stop
            key="stop"
            onClick={handleStop}
            exit={{ width: 0, height: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <FaStop />
          </Stop>
        )}
      </AnimatePresence>
    </MotionContainer>
  );
};

export default Entry;

