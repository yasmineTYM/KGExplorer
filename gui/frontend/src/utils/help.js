function getComponentType(componentId){
    return componentId.split('-')[1]
  }
  
  function compareArrays(arr1, arr2) {
    let res = false
    if (arr1.length != arr2.length) {
      return res
    } else {
      for(let i = 0; i < arr1.length; i++) {
        if (arr2.includes(arr1[i])) {
          continue 
        }else {
          return res
        }
      }
      res = true
    }
  
    return res   
  }
  
  export {getComponentType, compareArrays}