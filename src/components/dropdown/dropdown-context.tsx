import React, { createContext, useContext, useState } from 'react';

export interface IDropdownContext {
  show?: boolean;
  setShow?: React.Dispatch<React.SetStateAction<boolean>>;
  toggle?: () => void;
}

const DropdownContext = createContext<IDropdownContext | null>(null);

type DropDown = {
  children?: React.ReactNode;
};

function DropdownProvider({ children }: DropDown) {
  const [show, setShow] = useState<boolean>(false);
  const toggle = () => {
    setShow(!show);
  };
  const values: IDropdownContext = { show, setShow, toggle };
  return (
    <DropdownContext.Provider value={values}>
      {children}
    </DropdownContext.Provider>
  );
}

function useDropdown(): IDropdownContext {
  const context = useContext(DropdownContext);
  if (typeof context === 'undefined') {
    throw new Error('useDropdown must be used within DropdownProvider');
  } else {
    return context as IDropdownContext;
  }
}

export { useDropdown, DropdownProvider };
