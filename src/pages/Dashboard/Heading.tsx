import Button from 'components/Button';
import React from 'react';

interface IHeadingProps {
  title: string;
  desc: string;
  addUrl?: string;
  addTitle?: string;
  deleteUrl?: string;
  deleteTitle?: string;
  backUrl?: string;
  backTitle?: string;
}

const Heading: React.FC<IHeadingProps> = ({
  title = '',
  desc = '',
  addUrl = '',
  addTitle = '',
  deleteUrl = '',
  deleteTitle = '',
  backUrl = '',
  backTitle = '',
}) => {
  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <h1 className="text-2xl font-semibold mb-[5px] text-black">{title}</h1>
        <p className="text-sm text-gray80">{desc}</p>
      </div>
      <div className="flex gap-x-2">
        {deleteUrl && (
          <Button to={deleteUrl} type="button" color="bg-red-400">
            {deleteTitle}
          </Button>
        )}
        {addUrl && (
          <Button to={addUrl} type="button">
            {addTitle}
          </Button>
        )}
        {backUrl && (
          <Button to={backUrl} type="button" color="bg-slate-400">
            {backTitle}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Heading;
