<template>
  <div>
   <v-container grid-list-md>
      <v-layout row wrap>
        <stats-card
          flex="md4"
          icon="layers"
          color="red"
          :value="machines"
          :unit="$t('stats.units')"
          :label="$t('stats.instances')"
        ></stats-card>
        <stats-card
          flex="md4"
          icon="mdi-cpu-64-bit"
          color="green"
          :value="vcpus"
          :unit="$t('stats.units')"
          :label="$t('stats.total_cpu')"
        ></stats-card>
        <stats-card
          flex="md4"
          icon="memory"
          color="blue"
          :value="memory"
          unit="GB"
          :label="$t('stats.total_memory')"
        ></stats-card>
      </v-layout>
   </v-container>
   <v-container grid-list-md>
      <v-layout>
        <stats-card
          flex="md6"
          v-if="showDisk"
          icon="storage"
          color="orange"
          :value="disk"
          unit="GB"
          :label="$t('stats.total_disk')"
        ></stats-card>
        <stats-card
          flex="md6"
          v-if="showPrice"
          icon="account_balance"
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
        return this.stats.memory && this.stats.memory.memory_count;
      },
      disk() {
        return this.stats.disk && this.stats.disk.disk_count;
      },
      price() {
        return this.stats.price && this.stats.price.price_count;
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
