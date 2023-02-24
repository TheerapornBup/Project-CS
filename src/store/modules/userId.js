export default {
  namespaced: true,
  state: {
    userId: null,
  },
  getters: {
    getUserId: (state) => {
      return state.userId;
    },
  },
  actions: {
    logIn({ commit }, userId) {
      commit("setuserId", userId);
    },
    logOut({ commit }) {
      commit("setuserId", null);
    },
  },
  mutations: {
    setuserId(state, value) {
      state.userId = value;
    },
  },
};
