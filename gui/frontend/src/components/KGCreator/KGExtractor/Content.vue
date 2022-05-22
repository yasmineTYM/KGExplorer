<template lang="">
  <div>
    <v-card-text v-if="!itemProps.selectedTable" class="card-name">
          <v-icon>
            mdi-database  
          </v-icon>
          {{selectedCorpusName}}
    </v-card-text>
    <v-card-text v-else class="card-name title-mini">
      <v-icon>
        mdi-database  
      </v-icon>
      {{selectedCorpusName}}
    </v-card-text>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  props: {
    itemProps: {
      type: Object, 
      required: true, 
    }, 
  }, 
  data(){
    return {
    }
  },
  computed: {
    ...mapState(['drawLink']),

    // Determine Whether the component is draggable
    // Not allowed when resizing and drawling link
    draggable(){
      return !(this.drawLink || this.resizingStatus);
    }, 

    selectedCorpusName(){
      if(this.itemProps.selectedTable){
        const tableName = this.itemProps.selectedTable.table
        this.width = 56 + 8*tableName.length
        return tableName
      }else{
        return 'No Corpus'
      }
    }
  }
}
</script>
<style scoped>
.card-name{
  text-align: center;
  display: flex; 
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  height: 100%;
}
.title-mini {
  color: steelblue!important;
  font-weight: bold;
}  
</style>