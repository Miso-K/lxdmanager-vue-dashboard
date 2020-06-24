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
          :value="memory"
          :unit="getMemory.limits_unit_show"
          :label="$t('stats.total_memory')"
        ></stats-card>
        <stats-card
          v-if="showDisk"
          icon="mdi-harddisk"
          color="orange"
          :value="disk"
          :unit="getStorage.limits_unit_show"
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
  import { BToGB, BToGiB, BToMB, BToMiB } from '../../libraries/utils/helpers';
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
        return this.$store.getters.stats;
      },
      machines() {
        return this.stats.instances && this.stats.instances.count;
      },
      vcpus() {
        return this.stats.cpus && this.stats.cpus.cpus_count;
      },
      memory() {
        if (this.getMemory.limits_unit === 'MiB') {
          return this.stats.memory && BToMiB(this.stats.memory.memory_count_bytes);
        }
        return this.stats.memory && BToMB(this.stats.memory.memory_count_bytes);
      },
      disk() {
        if (this.getStorage.limits_unit === 'GiB') {
          return this.stats.disk && BToGiB(this.stats.disk.disk_count_bytes);
        }
        return this.stats.disk && BToGB(this.stats.disk.disk_count_bytes);
      },
      price() {
        return this.stats.price && this.stats.price.price_count;
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
    mounted() {
      // console.log(this.$store.getters.appconfig);
      this.$store.dispatch('fetchStats');
      this.$store.dispatch('fetchAppConfig');
    },
    created() {
      // this.$store.registerModule('stats', Stats);
    }
  };
</script>
