import React, { useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import { motion, useAnimation, usePresence } from "framer-motion";
import { deleteEntry, stopTimer } from "../services/api";
import { FaStop, FaShare, FaTrash } from "react-icons/fa";
import copy from "copy-to-clipboard";
import { encode } from "../utils/base64";

const MotionContainer = styled(motion.div)`
  background: #f0f0f0;
  padding: 1em;
  border-radius: 12px;
  height: 4em;
  box-shadow: 0 0 16px 8px #00000008;
  display: flex;
  align-items: center;
  position: absolute;
  width: 90%;
  margin: 1em 5%;

  & > * {
    margin: 0.2em;
  }
`;

const Input = styled.input`
  border: none;
  border-radius: 8px;
  padding: 0.4em 0.8em;
  font-size: 16px;
  background: transparent;

  :focus {
    background: white;
  }
`;

const Description = styled(Input)`
  flex: 1;
`;

const Time = styled(Input)`
  max-width: 6em;
`;

const Stop = styled.button`
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
  font-size: 14px;
  color: #808080;
  padding: 0.4em;
  border-radius: 4px;

  :hover {
    color: #424242;
    background: #f8f8f8;
  }
`;

const Entry = ({
  id,
  index,
  description,
  timeInterval,
  onDelete: removeEntry,
  updateEntry,
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
      }, 500);

      return () => {
        clearInterval(interval);
      };
    }
  }, [timeInterval, getDelta]);

  useEffect(() => {
    setTimeout(
      () =>
        controls.start({
          scale: 1,
        }),
      index * 50
    );
    // index is here bc of eslint but it should'nt
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
    const url = `${window.location.host}/${encode({
      description,
      ...timeInterval,
    })}`;
    copy(url);
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
      <Description defaultValue={description} readOnly />
      <Time value={delta} readOnly />
      <SmallButton onClick={handleShare}>
        <FaShare />
      </SmallButton>
      <SmallButton onClick={handleDelete}>
        <FaTrash />
      </SmallButton>
      {!timeInterval.end && (
        <Stop onClick={handleStop}>
          <FaStop />
        </Stop>
      )}
    </MotionContainer>
  );
};

export default Entry;
