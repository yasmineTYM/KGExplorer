import {getComponentType} from '@/utils/help'
import axios from 'axios'

function createNewLoaderGraphCard(id){
  return {
    id: `card-loadergraph-${id}`,
    sourceLink: [], //
    selectedTable: undefined, 
    marginLeft: null, 
    marginTop: null, 
    width: null, 
    height: null,
    data: undefined,
    loadingStatus: false, 
  }
}

export default {
  namespaced: true,
  state: {
    nextAvailableIndex: 0,
    cards: [
       
    ],
    component: () => import('@/components/KGCreator/KGLoader/LoaderGraphComp'), 
  }, 
  mutations: {
    ADD_COMPONENT(state){
      const nextIndex = state.nextAvailableIndex;
      state.nextAvailableIndex += 1
      state.cards.push(createNewLoaderGraphCard(nextIndex));
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
  }, 
  actions: {
    addComp({commit}, ){
      console.log('adding')
      commit('ADD_COMPONENT');
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
        alert('loader grpah card has to be the starting point');
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
    //   for(let i in state.cards){
    //     if(state.cards[i].id == data.cardId && state.cards[i].selectedTable !== data){
    //       commit('ADD_DATA', data);
    //       commit('UPDATE_LOADING_STATUS', {id: data.cardId, status: true})
    //       console.log(data);
    //       let tabularData = await axios.get('http://127.0.0.1:5000/getTable')
    //       console.log(tabularData); 
    //       commit('LOAD_DATA', {id: data.cardId, data: {
    //         data: {...tabularData.data} , 
    //         tableNames: Object.keys(tabularData.data)
    //       }})
    //       commit('UPDATE_LOADING_STATUS', {id: data.cardId, status: false})
    //       console.log('adding corpusdata ############')
         
    //       for(let i in state.cards){
    //         if(state.cards[i].id == data.cardId){
    //           for(let j in state.cards[i].sourceLink){
    //             dispatch('outputHandler', state.cards[i].sourceLink[j])
    //           }
    //         }
    //       }
    //     }
    //   } 
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
