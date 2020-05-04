<template>
  <div>
    <tabs v-bind="$props"></tabs>
  </div>
</template>

<script>
  import Tabs from '../../components/Instance/Tabs';

  export default {
    name: 'instances',
    components: {
      tabs: Tabs
    },
    props: ['id'],
    data() {
      return {

      };
    }
  };
</script>
