<template lang="">
  <div>
    <CompTemplate :itemProps="itemProps">
      
      <template v-slot:view>
        <Content :itemProps="itemProps"/>
      </template>

      <!-- <template v-slot:dialog="{close}">
        <LoaderTextPre
            @loaderAction="loaderAction"
            @closeDialog="close"
        />
      </template>  -->
    </CompTemplate>
  </div>
</template>
<script>
import CompTemplate from '@/components/Common/Template'
import LoaderTextPre from './LoaderTextPre'
import Content from './Content'

export default {
  props: {
    itemProps: {
      type: Object, 
      required: true, 
    }
  },
  components: {
    CompTemplate,
    LoaderTextPre, 
    Content,  
  },
  methods: {
    loaderAction(e){
      alert(this.dialog)
      console.log("check e!!!"); 
      console.log(e)
      if(e.status == "success"){
        delete e.status
        e.selected.cardId = this.itemProps.id
        this.$store.dispatch('loadertext/addCorpus', e.selected)
      }
      this.dialog = false;
    },
  }
}
</script>
<style lang="">
  
</style>