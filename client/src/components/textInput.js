import React from 'react'
import TextField from '@material-ui/core/TextField'

export default function(props) {
  console.log(props)
  return (
    <TextField
      autoFocus={props.autoFocus}
      id={props.name}
      name={props.name}
      helperText={props.touched[props.name] ? props.errors[props.name] : ''}
      error={props.touched[props.name] && Boolean(props.errors[props.name])}
      label={props.label}
      type={props.type}
      fullWidth={props.hasOwnProperty('fullWidth') ? props.fullWidth : true}
      value={props.values[props.name]}
      onChange={props.handleChange}
      onBlur={props.handleBlur}
      multiline={props.multiline}
      rows={props.rows}
      maxRows={props.maxRows}
    />
  )
}
