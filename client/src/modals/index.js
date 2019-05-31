import React from 'react'
import { connect } from 'react-redux'

import Login from './login'
import Signup from './signup'

class ModalConductor extends React.Component {
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

export default connect(mapStateToProps)(ModalConductor)
