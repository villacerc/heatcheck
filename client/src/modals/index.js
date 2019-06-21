import React from 'react'
import { connect } from 'react-redux'
import { clearModal } from '../actions'

import Login from './login'
import Signup from './signup'
import CreateGame from './createGame'
import InvitePlayers from './invitePlayers'
import DialogDisplay from './dialogDisplay'

class ModalConductor extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      //clear modal stack
      if (this.props.modals.stack[0]) {
        this.props.clearModal()
      }
    }
  }
  render() {
    const { stack } = this.props.modals

    if (stack.length === 0) return null
    return (
      <div>
        {stack.map(({ name, props }, i) => {
          switch (name) {
            case 'login':
              return <Login key={i} {...props} />
            case 'signup':
              return <Signup key={i} {...props} />
            case 'create game':
              return <CreateGame key={i} {...props} />
            case 'invite players':
              return <InvitePlayers key={i} {...props} />
            case 'dialog':
              return <DialogDisplay key={i} {...props} />
            default:
              return null
          }
        })}
      </div>
    )
  }
}

function mapStateToProps({ modals }) {
  return { modals }
}

export default connect(
  mapStateToProps,
  { clearModal }
)(ModalConductor)
