<template>
  <div>
    <v-app-bar
      app
      dense
    > 
      <v-btn 
          class="ma-1 menu-btn"
          @click="toggleMenuBar"
          icon
          small
        >
          <v-icon
          :color="indicator?'blue-grey':'black'"
          >
            mdi-reorder-horizontal
          </v-icon>
      </v-btn>
      <v-toolbar-title>DoxCompass-beta</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        rounded
      >
        {{'Dashboard'}}
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data(){
    return {
      indicator: true, 
    }
  },
  methods: {
    toggleMenuBar() {
      this.indicator = !this.indicator 
      console.log(this.indicator)
      this.$store.dispatch('menu/toggleMenuBar')
    }
  }
}
</script>

<style>

</style>