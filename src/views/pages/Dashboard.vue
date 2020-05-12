<template>
  <div>
    <div v-if="!me.admin">
      <stats></stats>
      <order></order>
      <dashboard_instances></dashboard_instances>
    </div>
    <div v-if="me.admin">
      <admin_stats></admin_stats>
    </div>
  </div>
</template>

<script>
  import Stats from '../../components/Stats/Stats';
  import Order from '../../components/Order/Order';
  import AdminStats from '../../components/AdminStats/AdminStats';
  import DashboardInstances from '../../components/Instances/DashboardInstances';

  export default {
    name: 'Dashboard',
    components: {
      stats: Stats,
      order: Order,
      admin_stats: AdminStats,
      dashboard_instances: DashboardInstances
    },
    computed: {
      me() {
        return this.$store.getters['auth/me'];
      }
    },
    data() {
      return {

      };
    }
  };
</script>
