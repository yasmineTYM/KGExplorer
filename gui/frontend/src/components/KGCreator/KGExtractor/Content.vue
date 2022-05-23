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
    
      <!-- <v-row> -->
        <v-col key="1" cols="4">
          <v-btn  @click="loadData">
             <v-icon>mdi-arrow-up-circle</v-icon>{{selectedCorpusName}}
          </v-btn>
        </v-col>
        <v-col key="2" cols="2">
          <v-select
          :items="options_columns"
          v-model = "selected_column"
          label="Column (to embed)"
        ></v-select>
        </v-col>
        <v-col key="3" cols="2">
           <v-select
          :items="options_encoder"
          v-model = "selected_encoder"
          label="Encoder (to process)"
        ></v-select>
        </v-col>
        <v-col key="4" cols="2">
          <v-btn  @click="Process">
             <v-icon>mdi-arrow-right-drop-circle</v-icon>Process
          </v-btn>
        </v-col>
      <!-- </v-row> -->
      
      <v-dialog
        v-model="dialog"
        max-width="800"
      >
        <LoaderTextPre
          @loaderAction="loaderAction"
        />
      </v-dialog>
      <!-- {{selectedCorpusName}} -->
    </v-card-text>
  </div>
</template>
<script>
import LoaderTextPre from './LoaderTextPre.vue'
import {mapState} from 'vuex'
export default {
  props: {
    itemProps: {
      type: Object, 
      required: true, 
    }, 
  }, 
  components:{
    LoaderTextPre
  },
  data(){
    return {
      dialog: false,
      // options_columns: [],
      options_encoder: ['phrase','bio','dygiepp','NER'],
      selected_encoder: '',
      selected_column: ''
    }
  },
  methods:{
    cardDoubleClick(){
      console.log('check this!')
      console.log(this.itemProps.maximized)
      if(this.itemProps.maximized==false){
        this.$router.push(`/component/${this.itemProps.id}`)
        this.$store.dispatch('loadertext/convert_flag', this.itemProps.id)
      }else{
        this.$router.push({name:'Dashboard'})
        this.$store.dispatch('loadertext/convert_flag', this.itemProps.id)
      }
    },
    // prompt LoaderTextPre to select data 
    loadData(){
      this.dialog = true
    },
    // after loading file from LoaderTextPre
    loaderAction(e){ 
      if(e.status == "success"){
        delete e.status
        e.selected.cardId = this.itemProps.id
        console.log(e)
        this.$store.dispatch('loadertext/addCorpus', e.selected)
      }
      this.dialog = false;
    },
    //
    
    // after selecting everything 
    Process(){
      if(this.selected_encoder == "" || this.selected_column==""){
        alert('please choose all options!')
      }else{
        this.$store.dispatch('extractor/process', {
          'dataset': this.itemProps.data,
          'embedColumn': this.selected_column,
          'encoder': this.selected_encoder
        })
      }
    }
  },
  watch:{
    'itemProps.data'(newVal, oldVal){
      console.log('data changed ', newVal)
    
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
    options_columns(){
      return this.itemProps.data.tableNames
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