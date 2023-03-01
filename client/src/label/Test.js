import React, { useEffect, useState } from 'react';

const Test = () => {
  const [state, setState] = useState('Hiiii');
  useEffect(() => {
    console.log(state);
  }, []);

  return (
    <>
      <div>HIII I am Hook</div>
    </>
  );
};

export default Test;
