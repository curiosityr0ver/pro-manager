import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;


export const createProject = async (newProject) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await axios.post(`${backendUrl}/projects/`, {
            ...newProject
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const { task } = response.data.data;
        return { data: task, error: "" };
    } catch (error) {
        return { data: null, error: error.response?.data?.message || "Something went wrong" };
    }
};
