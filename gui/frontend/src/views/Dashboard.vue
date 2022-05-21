<template>
    <div 
      class="dashboard-container"
      @dragover="dragOver"
      @drop="dropHandler"
      @mousemove="mouseMove"
      @mouseup="mouseUp"
     
      > 
      <div class="background-canvas">
          <svg
            class="svg-canvas"
          >
            <LinkComp 
              v-for="path in link.links"
              :link="path"
              :key="path.id"
               :v-if="ready"
              @rightClick="rightClick"
            />
          </svg>
          <v-menu
            v-model="showRightClickMenu"
            :position-x="rightMenuX"
            :position-y="rightMenuY"
            absolute
            offset-y
          >
            <RightClickMenu 
              :vue="this" 
              :container="123" 
              :itemProps="linkItem"
              store="link"
            /> 
          </v-menu>
      </div>
      <MenuBar/>
      <ul class="corpus-components-list">
          <li
            :is="loadertext.component"
            v-for="item in loadertext.cards"
            :key="item.id"
            :itemProps="item"
          >
        </li>
      </ul>
      <ul class="loadergraph-components-list">
        <li :is="loadergraph.component"
            v-for="item in loadergraph.cards"
            :key="item.id"
            :itemProps="item">

        </li>
      </ul>
  </div>
</template>

<script>
// import Scatter from './components/Scatter';
import MenuBar from '@/components/Common/Menu/MenuBar';
import LinkComp from '@/components/Common/Link/LinkComp';
import RightClickMenu from '@/components/Common/RightClick/RightClickMenu';
import {mapState} from 'vuex'
export default {
  name: 'App',

  components: {
    MenuBar,
    LinkComp,
    RightClickMenu
  },

  data: () => ({
    //
    showRightClickMenu: false,
    rightMenuX:0,
    rightMenuY: 0,
    ready: false,

    linkItem: undefined
  }),
 
  methods:{
    dragOver(e){
      e.preventDefault();
      return false;
      // console.log(e)
    },
    dropHandler(e){
      const currentX = e.clientX;
      const currentY = e.clientY; 
      if(!e.dataTransfer.getData('item-id')){
        return false; 
      }
      const initialLeft = e.dataTransfer.getData('initialLeft');
      const initialTop = e.dataTransfer.getData('initialTop');
      const id = e.dataTransfer.getData('item-id'); //
      const el = document.querySelector(`#${id}`);
      // this.updatePos(currentX-initialX, currentY-initialY, el);
      el.style.left = (currentX + parseInt(initialLeft)) + 'px';
      el.style.top = (currentY + parseInt(initialTop)) + 'px';
      if(this.currentDragging){
        this.currentDragging.marginLeft = el.style.left;
        this.currentDragging.marginTop = el.style.top;
      }
      e.preventDefault();
      return false;
    },
    mouseMove(){
      if(this.drawLink === true){
        // console.log('linking')
      }
    },
    mouseUp(){
      if(this.drawLink === true){
        console.log('Finish drawing'); 
        this.$store.dispatch('changeLinkDrawingStatus', false);
      }
    },
    rightClick(x, y, linkData){
      this.showRightClickMenu = true;
      this.rightMenuX = x; 
      this.rightMenuY = y;
      this.linkItem = linkData;
    }
  },
  computed:{
    ...mapState([
      'loadertext','loadergraph','link']), 
  },
  created(){
      console.log('dddd')
      console.log(this.link)
  },
  watch:{
    link(newVal, oldVal){
      console.log(newVal, oldVal)
      this.ready = true
    },
    
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

