const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GOOD':
        const addGood = {
          good : state.good + 1,
          ok : state.ok,
          bad : state.bad
        }
      return addGood
    case 'OK':
        const addNeutral = {
          good : state.good,
          ok : state.ok + 1,
          bad : state.bad
        }
        return addNeutral
    case 'BAD':
      const addBad = {
        good : state.good,
        ok : state.ok,
        bad : state.bad + 1
      }
    return addBad
    case 'ZERO':
      return initialState
    default: 
      return state
  }
  
}

export default counterReducer