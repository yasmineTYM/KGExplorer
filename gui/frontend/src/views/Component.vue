<template>
  <div>
    <a :is="component" :itemProps="loadertext.cards[0]"/>
  </div> 
</template>

<script>
// import Scatter from './components/Scatter';
// import KGExtractor from '@/components/KGCreator/KGExtractor/Content'
import {mapState} from 'vuex'
export default {
  name: 'App',
  props: {
    compId: {
      type: String, 
      required: true, 
    }
  },
  components: {
    // KGExtractor
  },

  data: () => ({
    //
    component: () => import ('@/components/KGCreator/KGExtractor/Content')
  }),
  created() {
    alert('created')
    console.log(this.loadertext.cards[0])
  },
  computed: {
    ...mapState(['loadertext'])
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

