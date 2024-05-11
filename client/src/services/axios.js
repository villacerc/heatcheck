import axios from 'axios'

const instance = axios.create({
  baseURL: process.NODE_ENV === "prod" ? "http://35.192.41.48:8080" : ""
});

instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return error.response
  }
)

export default instance
