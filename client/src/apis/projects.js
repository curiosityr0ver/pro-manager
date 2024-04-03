import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;


export const createProject = async (newProject) => {
    // const accessToken = localStorage.getItem("accessToken");
    // console.log(newProject);
    try {
        const response = await axios.post(`${backendUrl}/projects/`, {
            ...newProject
        },
            // {
            //     headers: {
            //         Authorization: `Bearer ${accessToken}`
            //     }
            // }
        );
        const { data } = response;
        return { data: data, error: "" };
    } catch (error) {
        return { data: null, error: error.response?.data?.message || "Something went wrong" };
    }
};
