<template>
  <div>
    <v-container grid-list-md>
      <v-layout row wrap>
        <admin-stats-card
          icon="groups"
          color="brown"
          :value="usersCount"
          unit="users"
          label="User accounts"
          label_sub="Groups"
          :value_sub="groupsCount"
        ></admin-stats-card>
        <admin-stats-card
          icon="mdi-checkbox-multiple-blank"
          color="red"
          :value="machines"
          unit="units"
          label="Instances"
          label_sub="Running"
          :value_sub="runningMachines"
        ></admin-stats-card>
        <admin-stats-card
          v-if="showPrice"
          icon="mdi-currency-eur"
          color="purple"
          :value="priceTotal"
          unit="€"
          label="Price"
          label_sub="Instances with price"
          :value_sub="price"
        ></admin-stats-card>
      </v-layout>
   </v-container>
    <v-container grid-list-md>
      <v-layout row wrap>
        <host-stats-card
          icon="mdi-cpu-64-bit"
          color="green"
          :value="totalCpu"
          unit="cores"
          label="Host CPU"
          :value_sub="vcpus"
          unit_sub="cores"
          label_sub="Allocated CPUs"
        ></host-stats-card>
        <host-stats-card
          icon="mdi-memory"
          color="blue"
          :value="totalMemory && totalMemory[0]"
          :unit="totalMemory && totalMemory[1]"
          label="Total Memory"
          :value_sub="memory && memory[0]"
          :unit_sub="memory && memory[1]"
          label_sub="Allocated Memory"
        ></host-stats-card>
        <host-stats-card
          v-if="showDisk"
          icon="mdi-harddisk"
          color="orange"
          :value="totalDisk"
          unit=""
          label="Total Disk"
          :value_sub="disk && disk[0]"
          :unit_sub="disk && disk[1]"
          label_sub="Allocated Disk"
        ></host-stats-card>
      </v-layout>
   </v-container>
  </div>
</template>

<script>
  import AdminStatsCard from './AdminStatsCard';
  import HostStatsCard from './HostStatsCard';
  import { hBinaryPrefix } from '../../libraries/utils/helpers';
  // import Host from '../../libraries/store/modules/host';
  import formatStats from '../../libraries/utils/format/stats';

  export default {
    name: 'AdminStats',
    components: {
      'admin-stats-card': AdminStatsCard,
      'host-stats-card': HostStatsCard
    },
    computed: {
      loading() {
        return this.$store.state.loading;
      },
      usersCount() {
        return this.$store.getters.usersTableData.length;
      },
      groupsCount() {
        return this.$store.getters.groupsTableData.length;
      },
      stats() {
        return this.$store.getters.instancesTableData
          && formatStats(this.$store.getters.instancesTableData);
      },
      host() {
        return this.$store.getters.host;
      },
      machines() {
        return this.stats.instancesTotal;
      },
      runningMachines() {
        return this.stats.instancesRunning;
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
      totalCpu() {
        return this.host.cpu && this.host.cpu.total;
      },
      totalMemory() {
        return this.host.memory && hBinaryPrefix(
          this.host.memory.total,
          this.getMemory.limits_unit,
          this.getMemory.limits_unit_show
        );
      },
      totalDisk() {
        return this.$store.getters.appconfig.storage.total_size;
      },
      price() {
        return this.stats.price && this.stats.price.price_count;
      },
      priceTotal() {
        return this.stats.price && this.stats.price.price_total.toFixed(2);
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
      // console.log(this.$store.getters.stats);
      // console.log(this.$store.getters['auth/me']);
      // this.$store.registerModule('host', Host);
      // this.$store.dispatch('fetchStats');
      this.$store.dispatch('fetchInstances');
      this.$store.dispatch('fetchUsers');
      this.$store.dispatch('fetchHost');
    }
  };
</script>
