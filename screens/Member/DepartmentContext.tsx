import React, {createContext, useContext, useState} from 'react';

type DepartmentContextType = {
  college: string;
  department: string;
  setCollege: (college: string) => void;
  setDepartment: (department: string) => void;
};

const DepartmentContext = createContext<DepartmentContextType | undefined>(
  undefined,
);

export const DepartmentProvider = ({children}: {children: React.ReactNode}) => {
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');

  return (
    <DepartmentContext.Provider
      value={{college, department, setCollege, setDepartment}}>
      {children}
    </DepartmentContext.Provider>
  );
};

export const useDepartment = () => {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error('useDepartment must be used within DepartmentProvider');
  }
  return context;
};
