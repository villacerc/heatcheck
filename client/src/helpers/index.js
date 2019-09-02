import axios from '../services/axios'
import store from '../reducer'

import { updateUser, showModal, popModal } from '../actions'

export const abandonGameDialog = callback => {
  const confirmCallback = async () => {
    const user = store.getState().user.payload

    user.createdGame
      ? await axios.delete('/api/delete-game')
      : await axios.post('/api/leave-game')

    await store.dispatch(updateUser())
    store.dispatch(popModal())

    callback()
  }
  store.dispatch(
    showModal('dialog', {
      type: 'confirmation',
      body: 'This will cause you to abandon your current game. Continue?',
      disableCloseInCallback: true,
      confirmCallback
    })
  )
}
