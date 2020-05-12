<template>
  <div v-if="!me.admin">
      <v-container grid-list-md>
        <v-layout row wrap>
          <v-flex md6 sm6 xs12 class="mb-1">
            <v-btn
              large
              block
              color="blue"
              dark
              class="elevation-3"
              @click="$store.dispatch('openInstanceCreateDialog')"
            >
              {{ $t('instances.actions.new') }}
              <v-icon large right dark>plus_one</v-icon>
            </v-btn>
          </v-flex>
          <v-flex md6 sm6 xs12 class="mb-1">
            <v-btn
              large
              block
              color="green"
              dark
              class="elevation-3"
              @click.native="$store.dispatch('openInstanceUpgradeDialog')"
            >
              {{ $t('instances.actions.upgrade') }}
              <v-icon large right dark>build</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
      <order-create></order-create>
      <order-upgrade></order-upgrade>
  </div>
</template>

<script>
  import OrderCreate from './OrderCreate';
  import OrderUpgrade from './OrderUpgrade';

  export default {
    components: {
      'order-create': OrderCreate,
      'order-upgrade': OrderUpgrade
    },
    computed: {
      me() {
        return this.$store.getters['auth/me'];
      }
    }
  };
</script>
