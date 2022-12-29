import * as React from 'react';
import { method } from 'constants/method';

interface IMethodProps {
  methodProps?: string;
  children?: React.ReactElement;
}

const Method: React.FunctionComponent<IMethodProps> = ({
  methodProps = '',
  children,
}) => {
  if (methodProps === method.BANKING.id)
    return <span>{method.BANKING.title}</span>;

  if (methodProps === method.DIRECT.id)
    return <span>{method.DIRECT.title}</span>;

  return <span>{method.MOMO.title}</span>;
};

export default Method;
