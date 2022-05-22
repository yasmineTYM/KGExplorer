import axios from 'axios'

export default{
    namespaced: true,
    state:{
        dataset: [],
        embedColumn: '',
        encoder: '',
        extOutput: [],
        currentLabel: {},
        label2Phrase: {}

    },
    mutations: {
        SET_DATASET(state, data){
            state.dataset = data
        },
        SET_EMBEDCOLUMN(state, data){
            state.embedColumn = data
        },
        SET_ENCODER(state, data){
            state.encoder = data
        },
        SET_EXTOUTPUT(state, data){
            state.extOutput = data
        },
        SET_CURRENTLABEL(state, data){
            state.currentLabel = data
        },
        SET_LABEL2PHRASE(state, data){
            state.label2Phrase = data 
        }
    },
    actions: {
        // click process button to extracr phrases 
        async process({commit, state}, data){
            console.log('process store', data)
            commit('SET_DATASET', data.dataset)
            commit('SET_EMBEDCOLUMN', data.embedColumn)
            commit('SET_ENCODER', data.encoder)

            let extOutput = await axios.post('http://127.0.0.1:5000/extractor', data)
            console.log(extOutput)
        }
    }
}