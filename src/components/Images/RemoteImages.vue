<template>
  <v-card
    color="blue lighten-2"
    dark
  >
    <v-card-title class="headline blue lighten-1">
      Search for Public Images
    </v-card-title>
    <v-card-text>
      Explore hundreds of official LXD images from
      <a
        class="grey--text text--lighten-3"
        href="https://uk.images.linuxcontainers.org"
        target="_blank"
      >Linux Containers - Image server</a>.
    </v-card-text>
    <v-card-text>
      <v-autocomplete
        v-model="model"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        color="white"
        hide-no-data
        hide-selected
        item-text="description"
        item-value="API"
        label="Public images"
        placeholder="Start typing to Search"
        prepend-icon="mdi-database-search"
        return-object
      ></v-autocomplete>
    </v-card-text>
    <v-divider></v-divider>
    <v-expand-transition>
      <v-list v-if="model" class="blue lighten-3">
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title v-text="model.name"></v-list-tile-title>
            <v-list-tile-sub-title v-text="model.description"></v-list-tile-sub-title>
            <v-list-tile-sub-title v-text="model.target"></v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-expand-transition>
    <v-card-text>
      <v-text-field
        v-if="model"
        v-model="aliasName"
        label="Alias name"
        :placeholder="model.name"
      ></v-text-field>
      <v-text-field
        v-if="model"
        v-model="aliasDescription"
        label="Alias description"
        :placeholder="model.description"
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!model"
        color="grey darken-3"
        @click="model = null"
      >
        Clear
        <v-icon right>mdi-close-circle</v-icon>
      </v-btn>
      <v-btn
        :disabled="!model"
        color="grey darken-3"
        @click="save"
      >
        Add
        <v-icon right>mdi-close-circle</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
    export default {
      name: 'RemoteImages',
      data: () => ({
        descriptionLimit: 60,
        entries: [],
        isLoading: false,
        model: null,
        search: null,
        aliasName: null,
        aliasDescription: null
      }),

      computed: {
        fields() {
          if (!this.model) return [];
          console.log(this.model);
          return Object.keys(this.model).map(key => ({
            key,
            value: this.model[key] || 'n/a'
          }));
        },
        items() {
          console.log(this.entries);
          // console.log(this.entries.map((entry) => {
          //  const description = entry.description;
          //  return Object.assign({}, entry, { description });
          // }));
          // return this.entries.map((entry) => {
          //  const description = entry.description;
          //  return Object.assign({}, entry, { description });
          // });
          return this.entries;
        }
      },

      methods: {
        save() {
          this.$store.dispatch('createImage', {
            fingerprint: this.model.target,
            aliasName: this.aliasName ? this.aliasName : this.model.name,
            aliasDescription: this.aliasDescription ? this.aliasDescription : this.model.description
          });
          this.dialog = false;
        }
      },

      watch: {
        search() {
          this.$store.dispatch('fetchRemoteImages');
          this.entries = this.$store.getters.remoteImages;
        }
      },
      mounted() {
        this.$store.dispatch('fetchRemoteImages');
      }
    };
</script>
