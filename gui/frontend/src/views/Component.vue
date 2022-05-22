<template>
  <div>
    <a :is="compState.inner_component" :itemProps="itemProps"/>
  </div> 
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'App',
  props: {
    compid: {
      type: String, 
      required: true, 
    }, 
    comp_type: {
      type: String, 
      required: true, 
    }
  },
  data: () => ({
    //
    component: undefined,
    itemProps: undefined, 
  }),
  created() {
    this.itemProps = 
      this.compState.cards.filter(card => card.id == this.compid)[0]
  },
  computed: {
    ...mapState({
      compState: function(state){
        return state[this.comp_type]
      }
    })
  },
  methods:{

  }
};
</script>
<style>
 .dashboard-container{
    height: 100%
  }
  .svg-canvas{
    position: absolute; 
    top: 0;
    left: 0;
    width: 100%; 
    height: 100%;
  }

  ul{
    list-style-type: none;
  }
  </style>

