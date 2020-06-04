<template>
      <v-dialog v-model="dialogVal" max-width="750px">
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Group name" :rules="nameRules" v-model="itemName" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-row>
                  <v-col cols="12" sm="4" md="4">
                    <v-switch
                      label="Required abilities for lxdmanager"
                      color="red"
                      readonly
                      v-model="switchValue"
                      :value="switchValue"
                      hide-details
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-switch
                      label="Default admin values"
                      color="blue"
                      readonly
                      v-model="switchValue"
                      :value="switchValue"
                      hide-details
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-switch
                      label="Default user values"
                      color="green"
                      readonly
                      v-model="switchValue"
                      :value="switchValue"
                      hide-details
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-flex>
                <v-container fluid>
                  <span>Users abilities</span>
                    <v-row>
                      <v-col v-for="column in numberOfColumns" :key="usersAbilities.id" cols="12" sm="4" md="4">
                        <v-switch
                          v-for="row in rowNum(column, usersAbilities)" :key="usersAbilities.id"
                          :label="row.name"
                          :color="row.color"
                          v-model="abilitiesUserList"
                          :value="row.name"
                          :disabled="row.disabled"
                          hide-details
                        ></v-switch>
                      </v-col>
                    </v-row>
                </v-container>
                <v-container fluid>
                  <span>Groups abilities</span>
                    <v-row>
                      <v-col v-for="column in numberOfColumns" :key="groupsAbilities.id" cols="12" sm="4" md="4">
                        <v-switch
                          v-for="row in rowNum(column, groupsAbilities)" :key="groupsAbilities.id"
                          :label="row.name"
                          :color="row.color"
                          v-model="abilitiesUserList"
                          :value="row.name"
                          :disabled="row.disabled"
                          hide-details
                        ></v-switch>
                      </v-col>
                    </v-row>
                </v-container>
                <v-container fluid>
                  <span>Abilities abilities</span>
                    <v-row>
                      <v-col v-for="column in numberOfColumns" :key="abilitiesAbilities.id" cols="12" sm="4" md="4">
                        <v-switch
                          v-for="row in rowNum(column, abilitiesAbilities)" :key="abilitiesAbilities.id"
                          :label="row.name"
                          :color="row.color"
                          v-model="abilitiesUserList"
                          :value="row.name"
                          :disabled="row.disabled"
                          hide-details
                        ></v-switch>
                      </v-col>
                    </v-row>
                </v-container>
                <v-container fluid>
                  <span>Requests abilities</span>
                    <v-row>
                      <v-col v-for="column in numberOfColumns" :key="requestsAbilities.id" cols="12" sm="4" md="4">
                        <v-switch
                          v-for="row in rowNum(column, requestsAbilities)" :key="requestsAbilities.id"
                          :label="row.name"
                          :color="row.color"
                          v-model="abilitiesUserList"
                          :value="row.name"
                          :disabled="row.disabled"
                          hide-details
                        ></v-switch>
                      </v-col>
                    </v-row>
                </v-container>
                <v-container fluid>
                  <span>Instances abilities</span>
                    <v-row>
                      <v-col v-for="column in numberOfColumns" :key="instancesAbilities.id" cols="12" sm="4" md="4">
                        <v-switch
                          v-for="row in rowNum(column, instancesAbilities)" :key="instancesAbilities.id"
                          :label="row.name"
                          :color="row.color"
                          v-model="abilitiesUserList"
                          :value="row.name"
                          :disabled="row.disabled"
                          hide-details
                        ></v-switch>
                      </v-col>
                    </v-row>
                </v-container>
                <v-container fluid>
                  <span>Snapshots abilities</span>
                    <v-row>
                      <v-col v-for="column in numberOfColumns" :key="snapshotsAbilities.id" cols="12" sm="4" md="4">
                        <v-switch
                          v-for="row in rowNum(column, snapshotsAbilities)" :key="snapshotsAbilities.id"
                          :label="row.name"
                          :color="row.color"
                          v-model="abilitiesUserList"
                          :value="row.name"
                          :disabled="row.disabled"
                          hide-details
                        ></v-switch>
                      </v-col>
                    </v-row>
                </v-container>
                <v-container fluid>
                  <span>Images abilities</span>
                    <v-row>
                      <v-col v-for="column in numberOfColumns" :key="imagesAbilities.id" cols="12" sm="4" md="4">
                        <v-switch
                          v-for="row in rowNum(column, imagesAbilities)" :key="imagesAbilities.id"
                          :label="row.name"
                          :color="row.color"
                          v-model="abilitiesUserList"
                          :value="row.name"
                          :disabled="row.disabled"
                          hide-details
                        ></v-switch>
                      </v-col>
                    </v-row>
                </v-container>
                <v-container fluid>
                  <span>Other abilities</span>
                    <v-row>
                      <v-col v-for="column in numberOfColumns" :key="otherAbilities.id" cols="12" sm="4" md="4">
                        <v-switch
                          v-for="row in rowNum(column, otherAbilities)" :key="otherAbilities.id"
                          :label="row.name"
                          :color="row.color"
                          v-model="abilitiesUserList"
                          :value="row.name"
                          :disabled="row.disabled"
                          hide-details
                        ></v-switch>
                      </v-col>
                    </v-row>
                </v-container>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click.native="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click.native="save" :disabled="!valid" >Save</v-btn>
        </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
</template>

<script>
  export default {
    name: 'groupsEdit',
    props: ['itemId', 'itemName', 'abilitiesUserList', 'editedIndex', 'dialog'],
    data() {
      return {
        switchValue: true,
        valid: false,
        nameRules: [
          v => !!v || 'Name is required',
          v => (v && v.length <= 20) || 'Name must be less than 20 characters'
        ],
        numberOfColumns: 3,
        editedIndex: -1,
        editedItem: {
          id: '',
          abilities: '',
          abilitiesUserList: []
        },
        defaultItem: {
          name: '',
          abilities: ''
        },
        // abilitiesUserList: [],
        usersAbilities: [
          { name: 'users_infos_all', color: 'blue' },
          { name: 'users_create', color: 'blue' },
          { name: 'users_infos', color: 'blue' },
          { name: 'users_update', color: 'blue' },
          { name: 'users_delete', color: 'blue' }
        ],
        groupsAbilities: [
          { name: 'groups_infos_all', color: 'red', disabled: true },
          { name: 'groups_create', color: 'blue' },
          { name: 'groups_infos', color: 'blue' },
          { name: 'groups_update', color: 'blue' },
          { name: 'groups_delete', color: 'blue' }
        ],
        abilitiesAbilities: [
          { name: 'abilities_infos_all', color: 'red', disabled: true },
          { name: 'abilities_infos', color: 'blue' },
          { name: 'abilities_update', color: 'blue' }
        ],
        meAbilities: [
          { name: 'me_infos', color: 'red', disabled: true },
          { name: 'me_update', color: 'green' },
          { name: 'me_otp_create', color: 'green' }
        ],
        requestsAbilities: [
          { name: 'requests_infos_all', color: 'red', disabled: true },
          { name: 'requests_create', color: 'green' },
          { name: 'requests_infos', color: 'green' },
          { name: 'requests_update', color: 'green' },
          { name: 'requests_delete', color: 'green' }
        ],
        instancesAbilities: [
          { name: 'instances_infos_all', color: 'red', disabled: true },
          { name: 'instances_create', color: 'blue' },
          { name: 'instances_infos', color: 'green' },
          { name: 'instances_update', color: 'blue' },
          { name: 'instances_delete', color: 'blue' },
          { name: 'instances_console', color: 'green' },
          { name: 'instances_state_infos', color: 'green' },
          { name: 'instances_state_update', color: 'green' },
          { name: 'instances_start', color: 'green' },
          { name: 'instances_freeze', color: 'green' },
          { name: 'instances_unfreeze', color: 'green' },
          { name: 'instances_stop', color: 'green' },
          { name: 'instances_stop_force', color: 'green' },
          { name: 'instances_restart', color: 'green' }
        ],
        snapshotsAbilities: [
          { name: 'snapshots_infos_all', color: 'green' },
          { name: 'snapshots_create', color: 'green' },
          { name: 'snapshots_infos', color: 'green' },
          { name: 'snapshots_rename', color: 'green' },
          { name: 'requests_delete', color: 'green' },
          { name: 'requests_restore', color: 'green' }
        ],
        imagesAbilities: [
          { name: 'images_infos_all', color: 'red', disabled: true },
          { name: 'images_create', color: 'blue' },
          { name: 'images_infos', color: 'green' },
          { name: 'images_update', color: 'blue' },
          { name: 'images_delete', color: 'blue' },
          { name: 'images_aliases_infos_all', color: 'green' },
          { name: 'images_aliases_create', color: 'blue' },
          { name: 'images_aliases_infos', color: 'green' },
          { name: 'images_aliases_update', color: 'blue' },
          { name: 'images_aliases_delete', color: 'blue' },
          { name: 'images_remote_infos_all', color: 'blue' }
        ],
        otherAbilities: [
          { name: 'operations_infos', color: 'red', disabled: true },
          { name: 'lxd_infos', color: 'blue' },
          { name: 'resources_infos', color: 'blue' },
          { name: 'stats_infos', color: 'green' },
          { name: 'config_infos', color: 'green' },
          { name: 'config_update', color: 'blue' },
          { name: 'lxd_cert_create', color: 'blue' }
        ]
      };
    },
    computed: {
      dialogVal: {
        get() {
          return this.dialog;
        },
        set(val) {
          this.$emit('update:dialog', val);
        }
      },
      formTitle() {
        return this.editedIndex === -1 ? 'New Group' : 'Edit Group';
      },
      items() {
        return this.$store.getters.groupsTableData;
      },
      abilitiesId() {
        const abilities = this.$store.getters.abilitiessTableData;
        return abilities.map(ability => ({
          name: ability.name,
          id: ability.id
        }));
      }
    },
    watch: {
      dialog(val) {
        return val || this.close();
      }
    },
    methods: {
      rowCount(dt) {
        return Math.floor(((dt.length - 1) / this.numberOfColumns)) + 1;
      },
      rowNum(column, dt) {
        // console.log(dt);
        const colx = column * this.rowCount(dt);
        return dt.slice(colx - this.rowCount(dt), colx);
      },
      close() {
        this.dialogVal = false;
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        }, 300);
      },
      save() {
        if (this.$refs.form.validate()) {
          const filtered = this.abilitiesId.filter(
            item => this.abilitiesUserList.includes(item.name)
          );
          this.editedItem.id = this.itemId;
          this.editedItem.name = this.itemName;
          this.editedItem.abilities = filtered;

          if (this.editedIndex > -1) {
            // console.log(this.editedItem);
            this.$store.dispatch('updateGroup', this.editedItem);
            setTimeout(() => {
              this.$store.dispatch('fetchGroups');
            }, 500);
          } else {
            // this.items.push(this.editedItem);
            this.$store.dispatch('createGroup', this.editedItem);
            setTimeout(() => {
              this.$store.dispatch('fetchGroups');
            }, 500);
          }
          this.close();
        }
      }
    }
  };
</script>
