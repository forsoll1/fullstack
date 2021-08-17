import React from 'react'
import { filterMaker } from '../reducers/filterReducer'
import { connect } from 'react-redux'

const Filter = (props) => {

  const filter = props.filter
  const handleChange = (event) => {
    const val = event.target.value
    props.filterMaker(val)
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input name="filterInput" value={filter} onChange={handleChange} />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    filter: state.filter
  }
}
const mapDispatchToProps = {
  filterMaker,
}

const ConnectedFilter = connect(mapStateToProps, mapDispatchToProps)(Filter)

export default ConnectedFilter