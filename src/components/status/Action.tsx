import * as React from 'react';
import { action } from 'constants/action';

interface IActionProps {
  actionProps?: string;
  children?: React.ReactElement;
}

const Action: React.FunctionComponent<IActionProps> = ({
  actionProps = '',
  children,
}) => {
  if (actionProps === action.CANCLE.id)
    return <span>{action.CANCLE.title}</span>;

  if (actionProps === action.DELIVERING.id)
    return <span>{action.DELIVERING.title}</span>;

  if (actionProps === action.HANDLING.id)
    return <span>{action.HANDLING.title}</span>;

  if (actionProps === action.PREPARING.id)
    return <span>{action.PREPARING.title}</span>;

  return <span>{action.PAID.title}</span>;
};

export default Action;
