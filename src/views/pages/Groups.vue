<template>
  <div>
    <groups></groups>
  </div>
</template>

<script>
  import Groups from '../../components/Groups/Groups';

  export default {
    name: 'container',
    components: {
      groups: Groups
    },
    data() {
      return {

      };
    }
  };
</script>
