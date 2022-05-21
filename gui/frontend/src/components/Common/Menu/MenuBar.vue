<template>
  <v-slide-y-transition>
    <template v-if="menu.showMenuBar">
      <div>
        <v-card
          class="dashboard-menu"
          outlined
        >
          <v-row
            v-for="menu in menu.menuList"
            :key="menu.label"
            no-gutters
          >
            <v-col>
              <MenuBtn
                :item="menu"
              />

            </v-col>
          </v-row>
        </v-card>
      </div>
    </template>
  </v-slide-y-transition>
</template>

<script>
import {mapState} from 'vuex'
import MenuBtn from '@/components/Common/Menu/MenuBtn'
export default {
  data(){
    return {
      items: []
    }
  },
  computed: {
    ...mapState(['menu',])
  },
  components: {
    MenuBtn
  },
  created(){
    
    console.log(this.menu);
  }
}
</script>

<style scoped>
  .dashboard-menu{
    position: absolute; 
    top: 20px;
    left: 10px;
  }
</style>