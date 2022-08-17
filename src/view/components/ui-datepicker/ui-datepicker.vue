<template>
  <datepicker :transitions="false"
              dark
              :format="formatDate"
  >

  </datepicker>
</template>

<script lang="ts" setup>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import moment from "moment";


const formatDate = (date: Date | Date[]): string | string[] => {
  const transformDate = (d: Date) => {
    const currentDate = moment(d);
    return currentDate.format("MM/DD/YYYY");
  };
  if (Array.isArray(date)) {
    const dateRange = [];
    for (let el of date as Array<Date>) {
      dateRange.push(transformDate(el));
    }
    return dateRange;
  }
  return transformDate(date);
};
</script>

<style lang="scss" scoped>

</style>