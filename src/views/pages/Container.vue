<template>
  <div>
    <tabs v-bind="$props"></tabs>
  </div>
</template>

<script>
  import Tabs from '../../components/Container/Tabs';

  export default {
    name: 'container',
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
