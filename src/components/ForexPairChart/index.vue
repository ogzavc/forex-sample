<template>
  <div class="exchange-chart">
    <div class="exchange-parity">
      <div class="exchange-flags">
        <div
          class="currency-flag currency-flag-lg exchange-flag"
          :class="flagClass(firstValOfPair)"
        ></div>
        <div
          class="currency-flag currency-flag-lg exchange-flag"
          :class="flagClass(secondValOfPair)"
        ></div>
        <v-chip small> <strong>Forex.com</strong></v-chip>
      </div>

      <div class="exchange-value">
        <div class="exchange-value--pair">
          {{ firstValOfPair }}/{{ secondValOfPair }}
        </div>
        <div class="exchange-value--currency">{{ liveCurrency }}</div>
      </div>

      <div class="exchange-difference" :class="changeClass()">
        {{ calculateChange() }} ({{ calculateChangePercent() }}%)
      </div>
    </div>

    <v-sparkline
      class="exchange-sparkline"
      :value="chartData"
      smooth="0"
      auto-draw
      :fill="true"
    ></v-sparkline>

    <div class="exchange-buttons">
      <v-btn
        v-for="(item, index) in timeIntervals"
        :key="index"
        class="exchange-button"
        :class="[item.value === timeInterval && 'exchange-button--active']"
        plain
        @click="timeClickHandler(item.value)"
      >
        {{ item.value }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import store from "../../store";
import globalMixin from "@/mixins/globalMixin";

export default {
  name: "ForexPairChart",
  mixins: [globalMixin],
  computed: {
    firstValOfPair() {
      return store.getters.getFirstValOfPair;
    },
    secondValOfPair() {
      return store.getters.getSecondValOfPair;
    },
    timeInterval() {
      return store.getters.getTimeInterval;
    },
    liveCurrency() {
      return store.getters.getLiveCurrency;
    },
    chartData() {
      return this.generateChartData(
        store.getters.getChartData,
        this.timeInterval
      );
    },
  },
  methods: {
    flagClass(val) {
      return "currency-flag-" + val.toLowerCase();
    },
    timeClickHandler(val) {
      if (val !== this.timeInterval) {
        store.dispatch("setTimeInterval", {
          time: val,
          params: this.generateRequestParams(val),
        });
        store.dispatch("setLiveCurrency");
      }
    },
    calculateChange() {
      const rawData = store.getters.getChartData;
      if (rawData.length > 0) {
        return (rawData[0].close - rawData[rawData.length - 1].close).toFixed(
          6
        );
      }
    },
    calculateChangePercent() {
      const rawData = store.getters.getChartData;
      if (rawData.length > 0) {
        //using math absolute to calculate first and last value's percentage difference
        return Math.abs(
          (1 - rawData[0].close / rawData[rawData.length - 1].close) * 100
        ).toFixed(6);
      }
    },
    changeClass() {
      if (this.calculateChange() > 0) {
        return "rise";
      } else {
        return "fall";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.exchange {
  &-parity {
    padding: 24px;
  }
  &-flag {
    width: 24px !important;
    border-radius: 50%;
    background-position: center;
    margin-right: 8px;
  }

  &-flags {
    display: flex;
  }

  &-sparkline {
    max-width: 100%;
  }

  &-value {
    display: flex;
    justify-content: space-between;
    padding: 12px 0px;
    align-items: flex-start;

    &--pair {
      font-size: 1.75rem;
      font-weight: bold;
    }

    &--currency {
      font-size: 1.75rem;
    }
  }

  &-difference {
    display: flex;
    justify-content: flex-end;
    font-weight: bold;

    &.fall {
      color: #a70000;
    }

    &.rise {
      color: #3dcb6a;
    }
  }

  &-buttons {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
  }

  &-button {
    letter-spacing: normal !important;
    &--active {
      font-weight: bold !important;
      background: #b9d8f5;
      color: black !important;
    }
  }
}
</style>

<style scoped src="@/assets/currency-flags.min.css"></style>
