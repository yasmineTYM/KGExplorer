import {getComponentType} from '@/utils/help'
import axios from 'axios'

function createNewCorpusCard(id){
  return {
    id: `card-loadertext-${id}`,
    sourceLink: [], //
    selectedTable: undefined, 
    marginLeft: null, 
    marginTop: null, 
    width: null, 
    height: null,
    data: {data:null, tableNames:[]},
    loadingStatus: false, 
    maximized: false,
    dataset: [],
    embedColumn: '',
    encoder: '',
    extOutput: [],
    currentLabel: {},
    label2Phrase: {},
    uniqueLabels: [],

    loading: false, 
  }
}

export default {
  namespaced: true,
  state: {
    nextAvailableIndex: 0,
    cards: [],
    component: () => import('@/components/KGCreator/KGExtractor'), 
    inner_component: () => import('@/components/KGCreator/KGExtractor/Content')
  }, 
  mutations: {
    CONVERT_FLAG(state, id){
      for(let i in state.cards){
        if(state.cards[i].id == `${id}`){
          if(state.cards[i].maximized==true){
            state.cards[i].maximized = false
            
          }else{
            state.cards[i].maximized = true
          }
        }
      }
      
    },
    ADD_COMPONENT(state){
      const nextIndex = state.nextAvailableIndex;
      state.nextAvailableIndex += 1
      state.cards.push(createNewCorpusCard(nextIndex));
    },
    DELETE_COMPONENT(state, id){
      for(let i in state.cards){
        if(state.cards[i].id == `${id}`){
          state.cards.splice(i, 1);
          console.log(id + ' has been deleted')
          break
        }
      }

    }, 
    ADD_SOURCE_LINK(state, linkData){
      for(let i in state.cards){
        if(state.cards[i].id == linkData.source){
          state.cards[i].sourceLink.push(linkData);
        }
      }
    },
    UPDATE_SOURCE(state, linkData){
      for(let i in state.cards){
        if(state.cards[i].id == linkData.source){
          for(let j in state.cards[i].sourceLink){
            if(state.cards[i].sourceLink[j].id == linkData.id){
              state.cards[i].sourceLink[j] = linkData
            }
          }
        }
      }
    },
    UPDATE_TARGET(state, linkData){
      for(let i in state.cards){
        if(state.cards[i].id == linkData.target){
          for(let j in state.cards[i].targetLink){
            if(state.cards[i].targetLink[j].id == linkData.id){
              state.cards[i].targetLink[j] = linkData
            }
          }
        }
      }
    },
    REMOVE_SOURCELINK(state, linkData){
      for(let i in state.cards){
        if(state.cards[i].id == linkData.source){
          for(let j in state.cards[i].sourceLink){
            if(state.cards[i].sourceLink[j].id == linkData.id){
              state.cards[i].sourceLink.splice(j,1);
            }
          }
        }
      }
    },
    UPDATE_LOADING_STATUS(state, {id, status}){
      for(let i in state.cards){
        if(state.cards[i].id == id){
          state.cards[i].loadingStatus = status;
        }
      } 
    },
    ADD_DATA(state, data){
      for(let i in state.cards){
        if(state.cards[i].id == data.cardId){
          state.cards[i].selectedTable = data;
        }
      }
    },

    LOAD_DATA(state, {id, data}){
      for(let i in state.cards){
        if(state.cards[i].id == id){
          state.cards[i].data = data;
        }
      }
    },

    // extractor...
    SET_DATASET(state, {id,data}){
      state.cards[id].dataset = data
    },
    SET_EMBEDCOLUMN(state, {id,data}){
        state.cards[id].embedColumn = data
    },
    SET_ENCODER(state, {id,data}){
        state.cards[id].encoder = data
    },
    SET_EXTOUTPUT(state, {id,data}){
        state.cards[id].extOutput = data
    },
    SET_CURRENTLABEL(state, {id,data}){
        state.cards[id].currentLabel = data
    },
    SET_LABEL2PHRASE(state, {id, data}){
        state.cards[id].label2Phrase = data 
    },
    CHANGE_LOADING(state,{id,data}){
        state.cards[id].loading = data
    },
    SET_UNIQUELABELS(state, {id,data}){
        state.cards[id].uniqueLabels = data
    }
  }, 
  actions: {
    convert_flag({commit}, id){
      // const toConvert = state.cards.filter(card => card.id == id)[0];
      commit('CONVERT_FLAG', id)
    },
    addComp({commit}, ){
      console.log('adding')
      commit('ADD_COMPONENT');
    },
    checkExist({state}, compid){
      console.log("checking " + compid)
      if (state.cards.filter(item => item.id == compid).length > 0){
        return true 
      }else {
        return false
      }
    },
    getComponent({state}) {
      return state.component 
    },
    getComponentInner({state}) {
      return state.inner_component
    }, 
    deleteComp({commit, state, dispatch}, id){
      const toDeletedComp = state.cards.filter(card => card.id == id)[0];
      
      const toDeleteSourceLink = [...toDeletedComp.sourceLink];
      
      toDeleteSourceLink.forEach(link => {
        console.log(link)
        dispatch('link/deleteComp', link.id, {root: true})
      })
      console.log('deleting' + id)
      commit('DELETE_COMPONENT', id);
    },
    addLink({commit, dispatch}, linkData){
      if(linkData.status == "source"){
        commit('ADD_SOURCE_LINK', linkData)
        dispatch('outputHandler', linkData)
      }else{
        alert('Corpus card has to be the starting point');
        dispatch('link/deleteComp', linkData.id, {root: true});
      }
    },
    updateLink({commit}, linkData){
      if(linkData.status == 'source'){
        commit('UPDATE_SOURCE', linkData)
      }else{
        commit('UPDATE_TARGET', linkData)
      }
    },
    removeLink({commit}, linkData){
      if(linkData.status == 'source'){
        commit('REMOVE_SOURCELINK', linkData)
      }else{ 
        console.log('no use, trying to remove target link for corpus, which does not exist')
      }
    }, 

    async addCorpus({commit, dispatch, state}, data){
      for(let i in state.cards){
        if(state.cards[i].id == data.cardId && state.cards[i].selectedTable !== data){
          commit('ADD_DATA', data);
          commit('UPDATE_LOADING_STATUS', {id: data.cardId, status: true})
          const payload = {
            'filename': data['table']
          }
          let tabularData = await axios.post('http://127.0.0.1:5000/getTable', payload)
          let parsed = tabularData.data
          commit('LOAD_DATA', {id: data.cardId, data: {
            data: {...parsed} , 
            tableNames: Object.keys(parsed[0])
          }})
          commit('UPDATE_LOADING_STATUS', {id: data.cardId, status: false})
         
          for(let i in state.cards){
            if(state.cards[i].id == data.cardId){
              for(let j in state.cards[i].sourceLink){
                dispatch('outputHandler', state.cards[i].sourceLink[j])
              }
            }
          }
        }
      } 
    }, 
    // click process button to extracr phrases 
    async process({commit, state}, data){
      console.log('process store', data)
      var idx = data['id'].split('-')[2]
      commit('CHANGE_LOADING', {id: idx, data: true})
      commit('SET_DATASET', {id: idx, data:data.dataset})
      commit('SET_EMBEDCOLUMN', {id: idx, data: data.embedColumn})
      commit('SET_ENCODER', {id: idx, data:data.encoder})

      let extOutput = await axios.post('http://127.0.0.1:5000/extractor', data)
      commit('SET_CURRENTLABEL', {id: idx, data: extOutput['data']['currentLabel']})
      commit('SET_DATASET', {id: idx, data:extOutput['data']['dataset']})
      commit('SET_LABEL2PHRASE', {id: idx, data:extOutput['data']['label2phrase']})
      commit('SET_UNIQUELABELS', {id: idx, data:extOutput['data']['uniqueLabels']})
      // console.log(extOutput)
      commit('CHANGE_LOADING', {id: idx, data:false})
    },

    outputHandler({commit, dispatch, state}, linkData){
      // Need to handler output since self is source
      const targetCompType = getComponentType(linkData.target);
      for(let i in state.cards){
        if(state.cards[i].id == linkData.source){
          dispatch(`${targetCompType}/inputHandler`, {link: linkData, inputData: state.cards[i].data}, {root: true})
          // return;
        }
      }
    }    
  }
}
