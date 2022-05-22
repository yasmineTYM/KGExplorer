<template lang="">
  <div @dblclick.stop="cardDoubleClick">
    <v-card-text v-if="!itemProps.maximized" class="card-name">
          <v-icon>
            mdi-database  
          </v-icon>
          <!-- <v-file-input
            truncate-length="5" accept=".csv"
          ></v-file-input> -->
          {{selectedCorpusName}}
    </v-card-text>
    <v-card-text v-else class="card-name title-mini">
      <!-- <v-icon>
        mdi-database  
      </v-icon> -->
    
      <v-row>
        <v-col key="1">
          <v-file-input
            truncate-length="5" accept=".csv"
            prepend-icon="mdi-database"
          ></v-file-input>
        </v-col>
        <v-col key="2">
          <v-select
          :items="options_columns"
          label="Column (to embed)"
        ></v-select>
        </v-col>
        <v-col key="3">
           <v-select
          :items="options_encoder"
          label="Column (to embed)"
        ></v-select>
        </v-col>
      </v-row>
      
      <!-- {{selectedCorpusName}} -->
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
  methods:{
    cardDoubleClick(){
      if(this.itemProps.maximized==false){
        this.$router.push({name:'Component'})
        this.$store.dispatch('loadertext/convert_flag', this.itemProps.id)
      }else{
        this.$router.push({name:'Dashboard'})
        this.$store.dispatch('loadertext/convert_flag', this.itemProps.id)
      }
    }
  },
  created(){
    // this.convertFlag = false
  },
  computed: {
    ...mapState(['drawLink',]),

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