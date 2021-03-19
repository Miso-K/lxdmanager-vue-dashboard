<template>
    <v-container grid-list-md>
  <v-tabs icons-and-text fixed-tabs>
    <v-tab
      v-for="s in servers.length"
      :key="s"
      :href="'#tab-' + s">
      {{ servers[s-1].name }}
      <v-icon>mdi-server</v-icon>
    </v-tab>
    <v-tab-item
      v-for="i in servers.length"
      :key="i"
      :value="'tab-' + i"
    >
        <images-card :serverName=servers[i-1].name></images-card>
    </v-tab-item>
  </v-tabs>
    </v-container>
</template>

<script>
  import ImagesCard from './ImagesCard';

  export default {
    name: 'Images',
    components: {
      'images-card': ImagesCard
    },
    data() {
      return {};
    },
    computed: {
      servers() {
        // console.log(this.$store.getters.serversTableData[2]);
        return this.$store.getters.serversTableData;
      }
    },
    mounted() {
      this.$store.dispatch('fetchServers');
    }
  };
</script>

