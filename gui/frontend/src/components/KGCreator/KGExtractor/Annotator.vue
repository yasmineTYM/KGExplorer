<template>
    <div>
        <div style="margin-left:10px">
            <v-annotator
            :dark="$vuetify.theme.dark"
            :text = "currentDoc.text"
            :entities = "currentDoc.annotations"
            :entity-labels="entityLabels"
            :v-if="show"
        />
        </div>
    </div>

</template>
<script>
import {mapState} from 'vuex';
import VAnnotator from 'v-annotator'
import LabelingMenu from './LabelingMenu.vue'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { TypedChainedSet } from 'webpack-chain';

export default{
    props: {
        annoData: {
            type: Object,
            required: true
        }
    },
    components:{
        VAnnotator,
        LabelingMenu
    },
    data(){
        return {
            allowOverlapping: false,
            // entityLabels: [
            //     {
            //     id: 0,
            //     text: 'noun phrase',
            //     prefixKey: null,
            //     suffixKey: 'l',
            //     color: '#7c20e0',
            //     textColor: '#ffffff',
            //     }
            // ],
            show:false,
            currentDoc: {}
        }
    },
    methods:{
      
        // computeData(){

        // }
    },
    watch:{
        annoData(){
            var output = {
                id: this.annoData.Doc_ID,
                text: this.annoData.Abstract,
                annotations: [],
                meta: { wikiPageId: 2 },
                annotation_approver: null
            }
            var phrase_ids = this.annoData.ExtOutput
            console.log(phrase_ids)
            // console.log(this.extractor.currentLabel[phrase_ids[0]])
            for(let i=0; i<phrase_ids.length; i++){
                var temp = this.extractor.currentLabel[phrase_ids[i]]
                // console.log(temp)
                var idx = this.extractor.uniqueLabels.indexOf(temp.label)
                output.annotations.push({
                    id: phrase_ids[i],
                    prob: 1.0,
                    label: idx,
                    startOffset: temp.startOffset,
                    endOffset: temp.endOffset,
                    user: 1
                })
            }
            console.log('data!!!!',output)
            this.currentDoc = output 
            this.show = true
        }
    },
    created(){

    },
    computed:{
        entityLabels(){
            var output = []
            
            var colors = ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9",'#bc80bd','#ccebc5',"#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99"]

            for(let i=0; i<this.extractor.uniqueLabels.length; i++){
                output.push({
                    id: i,
                    text: this.extractor.uniqueLabels[i],
                    color: colors[i],
                    textColor: '#ffffff'
                })
            }
            console.log('eneitylabel',output)
            return output
        },
        // currentDoc(){
            
            
        // },
         currentLabel() {
            if (this.entity) {
                const label = this.entityLabels.find((label) => label.id === this.entity.label)
                return label
            } else {
                return null
            }
        },

        currentRelationLabel() {
            if (this.relation) {
                const label = this.relationLabels.find((label) => label.id === this.relation.labelId)
                return label
            } else {
                return null
            }
        },
        ...mapState(['extractor'])
    }

}
</script>
<style scoped>
/* @import '~vue-annotator/style.css'; */
.annotation-text {
  font-size: 1.25rem !important;
  font-weight: 500;
  line-height: 2rem;
  font-family: "Roboto", sans-serif !important;
  opacity: 0.6;
}
</style>
