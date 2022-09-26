import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currencies: {},
    firstValOfPair: "USD",
    secondValOfPair: "EUR",
    timeInterval: "15M",
    liveCurrency: "",
    chartData: [],
  },
  mutations: {
    setCurrencies(state, payload) {
      this.state.currencies = payload;
    },
    setFirstValOfPair(state, val) {
      this.state.firstValOfPair = val;
    },
    setSecondValOfPair(state, val) {
      this.state.secondValOfPair = val;
    },
    setTimeInterval(state, val) {
      this.state.timeInterval = val;
    },
    setLiveCurrency(state, val) {
      this.state.liveCurrency = val;
    },
    setChartData(state, val) {
      this.state.chartData = val;
    },
  },
  actions: {
    setCurrencies(state) {
      axios
        .get(
          process.env.VUE_APP_BASE_URL +
            "live_currencies_list?api_key=" +
            process.env.VUE_APP_API_KEY
        )
        .then((response) => {
          state.commit("setCurrencies", response.data.available_currencies);
        });
    },
    setLiveCurrency(state) {
      axios
        .get(
          process.env.VUE_APP_BASE_URL +
            "live?currency=" +
            this.state.firstValOfPair +
            this.state.secondValOfPair +
            "&api_key=" +
            process.env.VUE_APP_API_KEY
        )
        .then((response) => {
          state.commit("setLiveCurrency", response.data.quotes[0].ask);
        });
    },
    setChartValue(state, params) {
      axios
        .get(
          process.env.VUE_APP_BASE_URL +
            "timeseries?currency=" +
            this.state.firstValOfPair +
            this.state.secondValOfPair +
            "&api_key=" +
            process.env.VUE_APP_API_KEY +
            "&format=records" +
            params
        )
        .then((response) => {
          state.commit("setChartData", response.data.quotes);
        });
    },
    setFirstValOfPair(state, val) {
      state.commit("setFirstValOfPair", val);
    },
    setSecondValOfPair(state, val) {
      state.commit("setSecondValOfPair", val);
    },
    setTimeInterval(state, { time, params }) {
      axios
        .get(
          process.env.VUE_APP_BASE_URL +
            "timeseries?currency=" +
            this.state.firstValOfPair +
            this.state.secondValOfPair +
            "&api_key=" +
            process.env.VUE_APP_API_KEY +
            "&format=records" +
            params
        )
        .then((response) => {
          state.commit("setTimeInterval", time);
          state.commit("setChartData", response.data.quotes);
        });
    },
  },
  modules: {},
  getters: {
    getCurrencies: (state) => {
      return state.currencies;
    },
    getFirstValOfPair: (state) => {
      return state.firstValOfPair;
    },
    getSecondValOfPair: (state) => {
      return state.secondValOfPair;
    },
    getTimeInterval(state) {
      return state.timeInterval;
    },
    getLiveCurrency(state) {
      return state.liveCurrency;
    },
    getChartData(state) {
      return state.chartData;
    },
  },
});
