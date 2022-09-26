import moment from "moment";

const globalMixin = {
  data() {
    return {
      timeIntervals: [
        {
          value: "15M",
          interval: "minute",
          period: "15",
          timeRange: this.timerangeAsMiliseconds(15 * 15),
          timeFormat: "YYYY-MM-DD-HH:MM",
        },
        {
          value: "1H",
          interval: "hourly",
          period: "1",
          timeRange: this.timerangeAsMiliseconds(60 * 15),
          timeFormat: "YYYY-MM-DD-HH:MM",
        },
        {
          value: "1D",
          interval: "daily",
          period: "1",
          timeRange: this.timerangeAsMiliseconds(60 * 24 * 15),
          timeFormat: "YYYY-MM-DD",
        },
        {
          value: "1W",
          interval: "daily",
          period: "1",
          chartSlot: 15,
          timeRange: this.timerangeAsMiliseconds(60 * 24 * 7 * 15),
          timeFormat: "YYYY-MM-DD",
        },
        {
          value: "1M",
          interval: "daily",
          period: "1",
          chartSlot: 12, //chart slot is 12 because of maximum request range is 1 year
          timeRange: this.timerangeAsMiliseconds(60 * 24 * 30 * 12),
          timeFormat: "YYYY-MM-DD",
        },
      ],
    };
  },
  methods: {
    getObjKey(obj, value) {
      return Object.keys(obj).find((key) => obj[key] === value);
    },
    timerangeAsMiliseconds(value) {
      return 1000 * 60 * value; //1000 * 60 :minute as milisecs
    },
    generateRequestParams(value) {
      const intervalProps = this.timeIntervals.find(
        (element) => element.value === value
      );

      return (
        "&interval=" +
        intervalProps.interval +
        "&period=" +
        intervalProps.period +
        "&start_date=" +
        moment(moment().valueOf() - intervalProps.timeRange)
          .utc()
          .format(intervalProps.timeFormat) +
        "&end_date=" +
        moment(moment().valueOf() - this.timerangeAsMiliseconds(1))
          .utc()
          .format(intervalProps.timeFormat)
      );
    },
    generateChartData(data, timeInterval) {
      const intervalProps = this.timeIntervals.find(
        (element) => element.value === timeInterval
      );

      if (!intervalProps.chartSlot) {
        return data.map((elm) => elm.close);
      } else {
        // for weekly and monthly data we have
        const filteredData = data.filter(
          (elm, index) =>
            index % Math.round(data.length / intervalProps.chartSlot) === 0 ||
            index === data.length - 1
        ); //
        return filteredData.map((elm) => elm.close);
      }
    },
  },
};

export default globalMixin;
