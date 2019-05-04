import React from 'react'
import { connect } from 'react-redux'

import Login from './login'

class ModalConductor extends React.Component {
  render() {
    const { stack } = this.props.modals

    if (stack.length === 0) return null
    return (
      <div>
        {stack.map(({ name }, i) => {
          switch (name) {
            case 'login':
              return <Login key={i} />
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
