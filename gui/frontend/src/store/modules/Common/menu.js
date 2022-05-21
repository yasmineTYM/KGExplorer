//https://materialdesignicons.com/
export default {
  namespaced: true,
  state: {
    menuList: [
      {
        label: 'KGExtractor', 
        icon: 'mdi-file-document', 
        store: 'loadertext', 
        component: undefined,
      },
      {
        label: 'KGLoader', 
        icon: 'mdi-graphql', 
        store: 'loadergraph', 
        component: undefined,
      },
      // {
      //   label: 'Tabular', //
      //   icon: 'mdi-table',  
      //   store: 'documents',
      //   component: () => import('@/components/DocumentsComp')
      // }, 
      // {
      //   label: 'Document Map', 
      //   icon: 'mdi-chart-scatter-plot', 
      //   store: 'globalview', 
      //   component: () => import('@/components/GlobalViewComp')
      // },
      // {
      //   label: 'Flow View', 
      //   icon: 'mdi-vector-triangle',
      //   store: 'ontology',
      //   component: () => import('@/components/GlobalViewComp')
      // },
      // {
      //   label: 'Graph View', 
      //   icon: 'mdi-vector-polygon-variant',
      //   store: 'graphview',
      //   component: undefined, 
      // }, 
      // {
      //   label: 'Embedding Generator', 
      //   icon: 'mdi-package-variant-closed', 
      //   store: 'embeddinggenerator', 
      //   component: undefined, 
      // }
    ],
    showMenuBar: true, 
  },
  mutations: {
    TOGGLE_SHOW_MENU(state, ) {
      state.showMenuBar = !state.showMenuBar
    }
  },
  actions: {
    toggleMenuBar({commit}){
      commit('TOGGLE_SHOW_MENU')
    }
  }
}