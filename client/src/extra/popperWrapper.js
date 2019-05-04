import React from 'react'
import Popper from '@material-ui/core/Popper'
import Grow from '@material-ui/core/Grow'
import Fade from '@material-ui/core/Fade'
import Paper from '@material-ui/core/Paper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

const PopperWrapper = props => {
  const content = () => {
    return props.onClickAway ? (
      <Paper>
        <ClickAwayListener onClickAway={props.onClickAway}>
          <div>{props.children}</div>
        </ClickAwayListener>
      </Paper>
    ) : (
      <Paper>
        <div>{props.children}</div>
      </Paper>
    )
  }

  //placements
  // 'bottom-end', 'bottom-start',
  // 'bottom', 'left-end',
  // 'left-start', 'left',
  // 'right-end', 'right-start',
  // 'right', 'top-end',
  // 'top-start', 'top'

  return (
    <Popper
      open={props.open}
      placement={props.placement || 'bottom'}
      anchorEl={props.anchorEl}
      transition
      disablePortal
    >
      {({ TransitionProps, placement }) => {
        switch (props.transition) {
          case 'fade':
            return (
              <Fade {...TransitionProps} timeout={200}>
                {content()}
              </Fade>
            )
          default:
            return (
              <Grow
                {...TransitionProps}
                style={{ transformOrigin: 'top right' }}
              >
                {content()}
              </Grow>
            )
        }
      }}
    </Popper>
  )
}

export default PopperWrapper
