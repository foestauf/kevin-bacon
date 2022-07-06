import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NDQ5OGE2NmI5NzM0ZWE5ZmEwYzgwZjQzNzQ1YzU4OSIsInN1YiI6IjYyNDBmNzE4NGNiZTEyMDA0OGFlMjQzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AYveS0an1zqTZLkgpS4WcAB-80RwzD22iabvgt_76h4`,
  },
});
