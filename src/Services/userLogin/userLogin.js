import dbConnection from "../db_connection";
import { baseURI } from "../db_connection";

class UserService {
  constructor() {
    //this.apiClient = dbConnection;
    this.baseEndpoint = `${baseURI}/user-applications`; // Updated to use menu endpoints
  }

  async createUser(userData) {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      };

      const response = await fetch(`${this.baseEndpoint}`, options); //this.apiClient.post(`${this.baseEndpoint}/`, { userData });

      return response;
    } catch (error) {
      console.error("Erreur lors de la création du plat:", error);
    }
  }

  async getClientUserLogin(userData) {
    try {
      const userLoginPath = "by-login";
      const response = await fetch(
        `${this.baseEndpoint}/${userLoginPath}/${userData.email}`
      );
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la recuperation de l"utilisateur:', error);
    }
  }

  async getAllUSer() {
    try {
      const response = await fetch(`${this.baseEndpoint}`);

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la recuperation des utilisateurs:", error);
    }
  }

  async updateUserInfo(userData) {
    try {
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      };

      const responseUser = await fetch(`${this.baseEndpoint}`, options);

      return await responseUser.json();
    } catch (error) {
      console.error(
        'Erreur lors de la mise a jour des informations de l"utilisateur ',
        error
      );
    }
  }

  async deleteUserInfo(userData) {
    try {
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const responseUser = await fetch(
        `${this.baseEndpoint}/${userData}`,
        options
      );

      return await responseUser.json();
    } catch (error) {
      console.error(
        'Erreur lors de la mise a jour des informations de l"utilisateur ',
        error
      );
    }
  }
}

const UserServices = new UserService();

export { UserServices };