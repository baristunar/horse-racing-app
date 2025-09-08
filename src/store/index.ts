import { createStore } from 'vuex'
import results from './modules/results'
import horses from './modules/horses'
import schedule from './modules/schedule'
import race from './modules/race'

export default createStore({
  modules: {
    results,
    horses,
    schedule,
    race,
  },
})
