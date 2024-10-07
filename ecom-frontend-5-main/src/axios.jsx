import axios from "axios";

const API = axios.create({
  baseURL: " http://192.168.77.227:8080/api",
  // http://192.168.77.227:8080/jwtcheck
});
delete API.defaults.headers.common["Authorization"];
export default API;
// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:8080/api",
// });
// delete API.defaults.headers.common["Authorization"];
// export default API;
