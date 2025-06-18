import dbConnection from "../db_connection";
import { baseURI } from "../db_connection";

class UserService{

    constructor() {
    //this.apiClient = dbConnection;
    this.baseEndpoint = `${baseURI}/user-applications`; // Updated to use menu endpoints
  }

  async createClientUser(userData) {

    try{
  const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(userData)
};

     const response = await fetch(`${this.baseEndpoint}`,options)//this.apiClient.post(`${this.baseEndpoint}/`, { userData });
       
     return response ;

    }
    catch(error){
        console.error('Erreur lors de la création du plat:', error);
    }
  }
}

const UserServices = new UserService();

export {UserServices};