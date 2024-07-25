import axios from "axios";

// axios.defaults.baseURL = "https://skupstina.azurewebsites.net/";
// axios.defaults.baseURL = "http://45.84.0.116:5005/";

/* http://52.158.47.57 */

axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:5005/"
  // "https://backend-eskupstina.azurewebsites.net/";

/*  axios.defaults.baseURL = "http://localhost:5005/";
 */ const signInUser = async (props) => {
  try {
    var result = await axios.post("/api/login/", props, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    localStorage.setItem("token", result.data.token);
    localStorage.setItem("userName", result.data.name);
    localStorage.setItem("userId", result.data.id);
    localStorage.setItem("role", result.data.role);
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
const getAgenda2 = async (props) => {
  try {
    var result = await axios.get(`/api/get_agenda/?id=${props}`, {
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


const getTvUsers = async (props) => {
  try {
    var result = await axios.get("/api/tv-users/", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (error) {
    return error.response;
  }
};

// ------------------------------------------------------
// Get users list
// ------------------------------------------------------

const usersList = async (page,search, sort) => {
  try {
    var result = await axios.get("/api/users/list/", {
      headers: {
        "Content-Type": "application/json",
      },
      params : {
        page : page,
        search : search,
        sort : sort,
      }
    });
    return result.data;
  } catch (error) {
    return error.response;
  }
};


// ------------------------------------------------------
// Get sessions list
// ------------------------------------------------------

const sessionsList = async (page,search,sort) => {
  try {
    var result = await axios.get("/api/sessions/list/", {
      headers: {
        "Content-Type": "application/json",
      },
      params : {
        page : page,
        search : search,
        sort : sort,
      }
    });
    return result.data;
  } catch (error) {
    return error.response;
  }
};

// ------------------------------------------------------
// Get agendas list
// ------------------------------------------------------

const agendasList = async (page,search) => {
  try {
    var result = await axios.get("/api/agendas/list/", {
      headers: {
        "Content-Type": "application/json",
      },
      params : {
        page : page,
        search : search
      }
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

const createAgenda = async (props,session) => {
  try {
    const formData = new FormData();
    formData.append("title", props.title);
    formData.append("description", props.description);
    formData.append("pdf_path", props.pdf_path);
    formData.append("agenda_type", props.agenda_type);
    formData.append("session",session);
    formData.append("position",props.position)
    const result = await axios.post("/api/agenda", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  } catch (error) {
    return error.response;
  }
};

const updateAgenda = async (props, id,session) => {
  try {
    const formData = new FormData();
    formData.append("title", props.title);
    formData.append("description", props.description);
    formData.append("pdf_path", props.pdf_path);
    formData.append("agenda_type", props.agenda_type);
    formData.append("session", session);
    formData.append("position",props.position)
    const result = await axios.put(`/api/update-agenda?id=${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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

const getSessions = async (props) => {
  try {
    var result = await axios.get("/api/get_sessions/", props, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (error) {
    return error.response;
  }
};
const getAgendas = async (id,type,text) => {
const params = new URLSearchParams();
 
    
    if (type) params.append('agenda_type', type);
if (id) params.append('session_id', id);
if (text) params.append('search', text);
  try {
    var result = await axios.get(`/api/get_all_agendas?${params}`, params, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (error) {
    return error.response;
  }
};
const deleteAgendaAPI = async (props) => {
  try {
    var result = await axios.delete(`/api/agenda/${props}`, props, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (error) {
    return error.response;
  }
};
const deleteSessionAPI = async (props) => {
  try {
    var result = await axios.delete(`/api/session/${props}`, props, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (error) {
    return error.response;
  }
};

const createSession = async (props) => {
  try {
    const result = await axios.post("/api/create-session", props, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (error) {
    return error.response;
  }
};
const updateSession = async (data, id) => {
  try {
    const result = await axios.put(`/api/update-session?id=${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (error) {
    return error.response;
  }
};

const deleteUserAPI = async (props) => {
  try {
    var result = await axios.delete(`/api/users/${props}`, props, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (error) {
    return error.response;
  }
};

const createUser = async (props) => {
  try {
    const result = await axios.post("/api/create-user", props, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (error) {
    return error.response;
  }
};

const updateUser = async (data, id) => {
  try {
    const result = await axios.put(`/api/update-user?id=${id}`, data, {
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
  deleteUserAPI,
  createSession,
  createUser,
  updateSession,
  updateAgenda,
  createAgenda,
  deleteAgendaAPI,
  getSessions,
  deleteSessionAPI,
  signInUser,
  getAgenda,
  getAgenda2,
  getUser,
  getTvUsers,
  handleVote,
  getVote,
  startVote,
  closeVote,
  resetVote,
  updateUser,
  usersList,
  sessionsList,
  agendasList,
getAgendas,
};
