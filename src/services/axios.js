import axios from "axios";

// axios.defaults.baseURL = "https://skupstina.azurewebsites.net/";
// axios.defaults.baseURL = "http://45.84.0.116:5005/";

/* http://52.158.47.57 */
axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || "http://52.158.47.57:8080";

const signInUser = async (props) => {
  try {
    var result = await axios.post("/api/login/", props, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    localStorage.setItem("token", result.data.token);
    localStorage.setItem("userName", result.data.name);
    localStorage.setItem("userId", result.data.id);
    //wait for 1 second
    return result.data;
  } catch (error) {
    return error.response;
  }
};

const getAgenda = async (props) => {
  try {
    var result = await axios.get("/api/get_agenda/", props, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (error) {
    return error.response;
  }
};

const getUser = async (props) => {
  try {
    var result = await axios.post("/api/users/", props, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (error) {
    return error.response;
  }
};

const handleVote = async (props) => {
  try {
    var result = await axios.post("/api/vote/", props, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (error) {
    return error.response;
  }
};

const getVote = async (props) => {
  try {
    var result = await axios.get("/api/get_vote/", props, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (error) {
    return error.response;
  }
};

const startVote = async (props) => {
  try {
    var result = await axios.post("/api/start_vote/", props, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (error) {
    return error.response;
  }
};

const closeVote = async (props) => {
  try {
    var result = await axios.post("/api/close_vote/", props, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (error) {
    return error.response;
  }
};

const resetVote = async (props) => {
  try {
    var result = await axios.post("/api/reset_vote/", props, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (error) {
    return error.response;
  }
};

export {
  signInUser,
  getAgenda,
  getUser,
  handleVote,
  getVote,
  startVote,
  closeVote,
  resetVote,
};
