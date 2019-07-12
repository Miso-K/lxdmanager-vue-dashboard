<template>
  <div>
   <v-container grid-list-md>
      <v-layout row wrap>
        <stats-card
          icon="layers"
          color="red"
          :value="machines"
          unit=" units"
          label="Virtual Servers"
        ></stats-card>
        <stats-card
          icon="data_usage"
          color="green"
          :value="vcpus"
          unit=" units"
          label="Allocated CPUs"
        ></stats-card>
        <stats-card
          icon="memory"
          color="blue"
          :value="memory"
          unit=" GB"
          label="Memory"
        ></stats-card>
        <stats-card
          icon="storage"
          color="orange"
          :value="disk"
          unit=" GB"
          label="Disk"
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
        return this.stats.containers && this.stats.containers.count;
      },
      vcpus() {
        return this.stats.cpus && this.stats.cpus.cpus_count;
      },
      memory() {
        return this.stats.memory && this.stats.memory.memory_count;
      },
      disk() {
        return this.stats.disk && this.stats.disk.disk_count;
      }
    },
    mounted() {
      // console.log(this.$store.getters.stats);
      this.$store.dispatch('fetchStats');
    },
    created() {
      // this.$store.registerModule('stats', Stats);
    }
  };
</script>
