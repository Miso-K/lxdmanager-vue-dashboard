<template>
  <div>
    <div v-if="!me.admin">
      <stats></stats>
      <order></order>
      <dashboard_containers></dashboard_containers>
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
  import DashboardContainers from '../../components/Containers/DashboardContainers';

  export default {
    name: 'Dashboard',
    components: {
      stats: Stats,
      order: Order,
      admin_stats: AdminStats,
      dashboard_containers: DashboardContainers
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
