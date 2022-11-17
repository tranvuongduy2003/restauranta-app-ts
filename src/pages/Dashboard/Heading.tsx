import React from 'react';

interface IHeadingProps {
  title: string;
  desc: string;
}

const Heading: React.FC<IHeadingProps> = ({ title = '', desc = '' }) => {
  return (
    <div className="mb-10">
      <h1 className="text-2xl font-semibold mb-[5px] text-black">{title}</h1>
      <p className="text-sm text-gray80">{desc}</p>
    </div>
  );
};

export default Heading;
