<template>
  <div id="app">
    <v-container>
      <v-col cols="12">
        <div class="title">Forex Exchange</div>
        <div class="subTitle">
          Check out for the current price for a currency pair
        </div>
      </v-col>

      <div class="exchange">
        <v-col cols="12" sm="4" class="exchange-pairs">
          <ForexDropdown
            :defaultVal="firstValOfPair"
            @currency-onchange="firstPairChange"
          />
          <ForexDropdown
            :defaultVal="secondValOfPair"
            @currency-onchange="secondPairChange"
          />
        </v-col>

        <v-col cols="12" sm="8" class="exchange-chart-wrapper">
          <ForexPairChart />
        </v-col>
      </div>
    </v-container>
  </div>
</template>

<script>
import store from "@/store";
import ForexDropdown from "@/components/ForexDropdown";
import ForexPairChart from "@/components/ForexPairChart";

export default {
  name: "App",
  components: {
    ForexDropdown,
    ForexPairChart,
  },
  computed: {
    firstValOfPair() {
      return store.getters.getFirstValOfPair;
    },
    secondValOfPair() {
      return store.getters.getSecondValOfPair;
    },
    currencies() {
      return store.getters.getCurrencies;
    },
  },
  mounted() {
    store.dispatch("setCurrencies");
    store.dispatch("setLiveCurrency");
    store.dispatch(
      "setChartValue",
      this.generateRequestParams(store.getters.getTimeInterval)
    );
  },
  methods: {
    firstPairChange(val) {
      store.dispatch("setFirstValOfPair", val);
      this.updateLiveCurrency();
    },
    secondPairChange(val) {
      store.dispatch("setSecondValOfPair", val);
      this.updateLiveCurrency();
    },
    updateLiveCurrency() {
      store.dispatch("setLiveCurrency");
      store.dispatch(
        "setChartValue",
        this.generateRequestParams(store.getters.getTimeInterval)
      );
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<style lang="scss" scoped>
.title {
  font-size: 2.25rem;
  font-weight: bold;
}

.subTitle {
  font-weight: bold;
  color: #5f5f5f;
}

.exchange {
  display: flex;
  flex-direction: column;

  @media (min-width: 600px) {
    flex-direction: row;
  }

  &-pairs {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &-chart-wrapper {
    -webkit-box-shadow: 0px 20px 62px -40px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 20px 62px -40px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 20px 62px -40px rgba(0, 0, 0, 0.75);
    padding: 0px;
    border-radius: 8px;

    @media (min-width: 600px) {
      margin: 12px;
    }
  }
}

.forexDropdown {
  width: calc(100% - 24px);
  margin: 12px;
}
</style>
