// import { userInformationRegister } from "./register";
// import { userInformationLogin } from "./login";
import { createContext, useState } from "react";

// User Context . That will contain User Informations after login such as his name ..

// export const userContextRegister = createContext();
// export const userContextLogin = createContext();

export const userContextInformation = createContext();

// export const UserInformationRegisterProvider = ({ children }) => {
//   const [userInformation, setUserInformation] = useState({
//     ...userInformationRegister,
//   });
//   return (
//     <userContextRegister.Provider value={{ userInformation }}>
//       {children}
//     </userContextRegister.Provider>
//   );
// };

// export const UserInformationLoginProvider = ({ children }) => {
//   const [userInformation, setUserInformation] = useState({
//     ...userInformationLogin,
//   });
//   return (
//     <userContextLogin.Provider value={{ userInformation }}>
//       {children}
//     </userContextLogin.Provider>
//   );
// };

export const UserInformationProvider = ({ children }) => {
  const [userInformation, setUserInformation] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });

  const updateUserInformation = (newData) => {
    setUserInformation((prev) => ({ ...prev, ...newData }));
  };
  return (
    <userContextInformation.Provider
      value={{ userInformation, setUserInformation, updateUserInformation }}
    >
      {children}
    </userContextInformation.Provider>
  );
};
