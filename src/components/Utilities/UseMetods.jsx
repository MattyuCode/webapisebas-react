import axios from "axios";
import React from "react";

export const UseMetods = () => {
  const API_Services = import.meta.env.VITE_APP_MY_API;
  const token = localStorage.getItem("access_token");

  const postPersonas = async (data) => {
    // debugger;
    try {
      const response = await axios.post(
        `${API_Services}/api/CRUDPERSONAS/CrearPersonas`,
        data,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 201) {
        return response.data;
      }
    } catch (error) {
      throw error.response || error;
    }
  };

  return { postPersonas };
};
