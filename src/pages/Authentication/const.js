import { createContext } from "react";

// UserInformation

export const userInformation = {
  firstName: "",
  lastName: " ",
  email: " ",
  phoneNumber: "",
};

// User Context . That will contain User Informations after login such as his name ..

export const UserContext = createContext();

// Constants
export const CAMEROON_COLORS = {
  green: "#009639",
  red: "#CE1126",
  yellow: "#FCDD09",
};

export const ANIMATION_DELAY_BASE = 100;
