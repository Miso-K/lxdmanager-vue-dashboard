<template>
  <div>
    <requests></requests>
  </div>
</template>

<script>
  import Requests from '../../components/Requests/Requests';

  export default {
    name: 'container',
    components: {
      requests: Requests
    },
    data() {
      return {

      };
    }
  };
</script>
