<template>
  <div>
    <appconfig></appconfig>
  </div>
</template>

<script>
  import AppConfig from '../../components/AppConfig/Tabs';

  export default {
    name: 'container',
    components: {
      appconfig: AppConfig
    },
    data() {
      return {

      };
    }
  };
</script>
