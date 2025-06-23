import { userInformation, UserContext } from "./const";

export const UserInformationProvider = ({ children }) => {
  return (
    <UserContext.Provider value={userInformation}>
      {children}
    </UserContext.Provider>
  );
};
