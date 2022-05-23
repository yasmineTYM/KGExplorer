import store from '@/store'

function compid_parser(compId) {
  const [_, component, id] = compId.split('-')
  return {component, id}
}

async function CHECK_COMP_EXIST(comp, compid) {
  const EXIST_ =  await store.dispatch(`${comp}/checkExist`, compid)
  if(!EXIST_){
    alert(`component ${compid} does not exist`)
    return false
  }else{
    return true
  }
}

async function COMP_GARD(to, from, next) {
  // check params  
  let compid; 
  if (!(compid=to.params.compid)) {
    next('/')
  }
  const {component} = compid_parser(compid) 
  to.params.comp_type = component 
  const _EXIST = await CHECK_COMP_EXIST(component, compid) 
  if (_EXIST){
    next()
  }else{
    next('/')
  }
}


export {COMP_GARD}