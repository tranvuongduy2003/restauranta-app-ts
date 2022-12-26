import * as React from 'react';
import { status } from 'constants/status';

interface IStatusProps {
  statusProps?: string;
  children?: React.ReactElement;
}

const Status: React.FunctionComponent<IStatusProps> = ({
  statusProps = '',
  children,
}) => {
  if (statusProps === status.ACCEPTED)
    return (
      <span className="px-5 py-3 font-medium rounded-lg bg-primary bg-opacity-20 text-primary">
        Accepted
      </span>
    );

  if (statusProps === status.REJECTED)
    return (
      <span className="px-5 py-3 font-medium text-red-600 bg-red-100 rounded-lg">
        Rejected
      </span>
    );

  return (
    <span className="px-5 py-3 font-medium text-yellow-600 bg-yellow-100 rounded-lg">
      Pending
    </span>
  );
};

export default Status;
