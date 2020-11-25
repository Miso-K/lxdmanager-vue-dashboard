<template>
  <div>
   <v-container grid-list-md>
      <v-layout row wrap>
        <stats-card
          icon="mdi-checkbox-multiple-blank"
          color="red"
          :value="machines"
          :unit="$t('stats.units')"
          :label="$t('stats.instances')"
        ></stats-card>
        <stats-card
          icon="mdi-cpu-64-bit"
          color="green"
          :value="vcpus"
          :unit="$t('stats.units')"
          :label="$t('stats.total_cpu')"
        ></stats-card>
        <stats-card
          icon="mdi-memory"
          color="blue"
          :value="memory && memory[0]"
          :unit="memory && memory[1]"
          :label="$t('stats.total_memory')"
        ></stats-card>
        <stats-card
          v-if="showDisk"
          icon="mdi-harddisk"
          color="orange"
          :value="disk && disk[0]"
          :unit="disk && disk[1]"
          :label="$t('stats.total_disk')"
        ></stats-card>
        <stats-card
          v-if="showPrice"
          icon="mdi-currency-eur"
          color="purple"
          :value="price"
          unit="€"
          :label="$t('stats.total_price')"
        ></stats-card>
      </v-layout>
   </v-container>
  </div>
</template>

<script>
  import StatsCard from './StatsCard';
  import { hBinaryPrefix } from '../../libraries/utils/helpers';
  import formatStats from '../../libraries/utils/format/stats';
  // import Stats from '../../libraries/store/modules/stats';

  export default {
    components: {
      'stats-card': StatsCard
    },
    computed: {
      loading() {
        return this.$store.state.loading;
      },
      stats() {
        return this.$store.getters.instancesTableData
          && formatStats(this.$store.getters.instancesTableData);
      },
      machines() {
        return this.stats.instancesTotal;
      },
      vcpus() {
        return this.stats.cpuTotal;
      },
      memory() {
        return this.stats.memoryTotalRaw && hBinaryPrefix(
          this.stats.memoryTotalRaw,
          this.getMemory.limits_unit,
          this.getMemory.limits_unit_show
        );
      },
      disk() {
        return this.stats.diskTotalRaw && hBinaryPrefix(
          this.stats.diskTotalRaw,
          this.getStorage.limits_unit,
          this.getStorage.limits_unit_show
        );
      },
      price() {
        return this.stats.price && this.stats.price.price_total;
      },
      getMemory() {
        return this.$store.getters.appconfig.memory;
      },
      getStorage() {
        return this.$store.getters.appconfig.storage;
      },
      showPrice() {
        return this.$store.getters.appconfig.price.enabled === 'True';
      },
      showDisk() {
        return this.$store.getters.appconfig.storage.enabled === 'True';
      }
    },
    created() {
      this.$store.dispatch('fetchInstances');
    }
  };
</script>
