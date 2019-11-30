<template>
  <div>
    <appconfig></appconfig>
  </div>
</template>

<script>
  import AppConfig from '../../components/AppConfig/AppConfig';

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
