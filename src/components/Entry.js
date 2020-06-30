import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';

const Container = styled.form`
  background: #f0f0f0;
  padding: 1em;
  border-radius: 12px;
  height: 4em;
  box-shadow: 0 0 16px 8px #00000008;
  display: flex;
  align-items: center;
  margin: 2em 1em;

  & > * {
    margin: 0.5em;
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

const Entry = ({ description, timeInterval }) => {
  const delta = useMemo(() => {
    return dayjs(dayjs(timeInterval.end) - dayjs(timeInterval.start))
      .add(3, 'hour')
      .format('HH:mm:ss');
  }, [timeInterval]);

  return (
    <Container>
      <Description defaultValue={description} />
      <Time defaultValue={delta} />
    </Container>
  );
};

export default Entry;
