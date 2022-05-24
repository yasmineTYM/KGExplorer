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
          <v-btn  @click="Process" :loading = "itemProps.loading">
             <v-icon>mdi-arrow-right-drop-circle</v-icon>Process
          </v-btn>
        </v-col>
      
      
      
      <v-dialog
        v-model="dialog"
        max-width="800"
      >
        <LoaderTextPre
          @loaderAction="loaderAction"
        />
      </v-dialog>
      <!-- {{selectedCorpusName}} -->
      <div class="full-height full-width">
        <v-card >
          scatterplot
        </v-card>
      </div>
      <div class="full-height full-width">
          <v-row justify="start">
            <v-col key="5" cols="5" lg="5">
              <v-card>
                <v-data-table
                :headers="headers"
                :items="tableData"
                :items-per-page="5"
                class="elevation-1"
                :show-select ="true"
                :single-select = "true"
                item-key="Doc_ID"
                @item-selected="clickTableRow"
                ></v-data-table>
              </v-card>
            </v-col>
          <v-col key="6" cols="7" lg="7">
            <v-card>
              <Annotator :annoData = "rowData" :itemProps="itemProps"/>
            </v-card>
          </v-col>
      </v-row>
      </div>
    </v-card-text>
    
  </div>
</template>
<script>
import LoaderTextPre from "./LoaderTextPre.vue";
import Annotator from './Annotator.vue';
import { mapState } from "vuex";
export default {
  props: {
    itemProps: {
      type: Object,
      required: true,
    },
  },
  components: {
    LoaderTextPre,
    Annotator
  },
  data() {
    return {
      dialog: false,
      // options_columns: [],
      options_encoder: ["noun phrase", "medical", "ner"],
      selected_encoder: "",
      selected_column: "",

      headers: [],
      tableData: [],

      rowData: {}
    };
  },
  methods: {
    cardDoubleClick() {
      //TODO: change to detech $route.path
      console.log("check this!");
      console.log(this.itemProps.maximized);
      if (this.itemProps.maximized == false) {
        this.$router.push(`/component/${this.itemProps.id}`); // minimized -> full size
        this.$store.dispatch("loadertext/convert_flag", this.itemProps.id);
      } else {
        this.$router.push({ name: "Dashboard" }); // full size -> minimized
        this.$store.dispatch("loadertext/convert_flag", this.itemProps.id);
      }
    },
    // prompt LoaderTextPre to select data
    loadData() {
      this.dialog = true;
    },
    // after loading file from LoaderTextPre
    loaderAction(e) {
      if (e.status == "success") {
        delete e.status;
        e.selected.cardId = this.itemProps.id;
        console.log(e);
        this.$store.dispatch("loadertext/addCorpus", e.selected);
      }
      this.dialog = false;
    },
    //

    // after selecting everything
    Process() {
      if (this.selected_encoder == "" || this.selected_column == "") {
        alert("please choose all options!");
      } else {
        this.$store.dispatch("loadertext/process", {
          id: this.itemProps.id,
          dataset: this.itemProps.data,
          embedColumn: this.selected_column,
          encoder: this.selected_encoder,
        });
      }
    },
    // click one row in the table 
    clickTableRow(raw){
      console.log('test')
      if(raw['value']==true){
        this.rowData = raw['item']
      }
      // console.log()
      // this.rowData = rawData
      
    }
  },
  watch: {
    "itemProps.data"(newVal, oldVal) {
      console.log("data changed ", newVal);
    },
    "itemProps.label2Phrase"(newVal) {
      var output = [];
      var target = ["Year", "Title", "Author", "Doc_ID", "AuthorNames"];
      for (let i = 0; i < this.itemProps.data.tableNames.length; i++) {
        if (target.includes(this.itemProps.data.tableNames[i]))
          output.push({
            text: this.itemProps.data.tableNames[i],
            value: this.itemProps.data.tableNames[i],
          });
      }
      this.headers = output;
      this.tableData = this.itemProps.dataset;
    },
  },
  created() {
    // this.convertFlag = false
  },
  computed: {
    // ...mapState(["drawLink", "extractor"]),

    // Determine Whether the component is draggable
    // Not allowed when resizing and drawling link
    draggable() {
      return !(this.drawLink || this.resizingStatus);
    },
    options_columns() {
      return this.itemProps.data.tableNames;
    },
    selectedCorpusName() {
      if (this.itemProps.selectedTable) {
        const tableName = this.itemProps.selectedTable.table;
        this.width = 56 + 8 * tableName.length;
        return tableName;
      } else {
        return "No Corpus";
      }
    },
    pageHeight() {
      return document.documentElement.scrollHeight.toString() + "px";
    },
  },
};
</script>
<style scoped>
.card-name {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  height: 100%;
}
.title-mini {
  color: steelblue !important;
  font-weight: bold;
}
.full-height {
  height: 100%;
}
.full-width {
  width: 100%;
}
.harf-height {
  height: 50%;
}
</style>