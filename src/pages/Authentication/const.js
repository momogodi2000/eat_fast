import { createContext } from "react";

// UserInformation

export let userInformation = {
  first_name: "",
  last_name: " ",
  email: " ",
  phone_number: "",
};

// export const setUserInformation = (info) => {
//   userInformation = { ...info };
// };

// Constants
export const CAMEROON_COLORS = {
  green: "#009639",
  red: "#CE1126",
  yellow: "#FCDD09",
};

export const ANIMATION_DELAY_BASE = 100;

export const redirection = (role, navigate) => {
  switch (role) {
    case "client":
      navigate("/clients");
      break;
    case "admin":
      navigate("/admin");
      break;
    case "restaurant_manager":
      navigate("/restaurants_manager");
      break;
    case "livreur":
      navigate("/delivery");
      break;
    default:
      navigate("/");
      break;
  }
};
