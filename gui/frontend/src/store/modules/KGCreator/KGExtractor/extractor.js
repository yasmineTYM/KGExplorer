import axios from 'axios'

export default{
    namespaced: true,
    state:{
        dataset: [],
        embedColumn: '',
        encoder: '',
        extOutput: [],
        currentLabel: {},
        label2Phrase: {},
        uniqueLabels: [],

        loading: false,
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
        },
        CHANGE_LOADING(state, data){
            state.loading = data
        },
        SET_UNIQUELABELS(state, data){
            state.uniqueLabels = data
        }
    },
    actions: {
        // click process button to extracr phrases 
        async process({commit, state}, data){
            console.log('process store', data)
            commit('CHANGE_LOADING', true)
            commit('SET_DATASET', data.dataset)
            commit('SET_EMBEDCOLUMN', data.embedColumn)
            commit('SET_ENCODER', data.encoder)

            let extOutput = await axios.post('http://127.0.0.1:5000/extractor', data)
            commit('SET_CURRENTLABEL', extOutput['data']['currentLabel'])
            commit('SET_DATASET', extOutput['data']['dataset'])
            commit('SET_LABEL2PHRASE', extOutput['data']['label2phrase'])
            commit('SET_UNIQUELABELS', extOutput['data']['uniqueLabels'])
            console.log(extOutput)
            commit('CHANGE_LOADING', false)
        }
    }
}