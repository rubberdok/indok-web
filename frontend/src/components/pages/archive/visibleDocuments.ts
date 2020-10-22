/* import React, { Component } from 'react'

import Documents from './allDocuments'
import { documents } from '../test/data'

class VisiblePoets extends Component {
  constructor() {
    super()
    this.state = {
      documents: [],
      filteredDocuments: []
    }
  }

  componentWillMount() {
    this.setState({
      documents,
      filteredDocuments: documents
    })
  }

  filterPoets = (documentFilter) => {
    let filteredDocuments = this.state.documents
    filteredDocuments = filteredDocuments.filter((document) => {
      let poetName = document.title.toLowerCase()
      return poetName.indexOf(
        documentFilter.toLowerCase()) !== -1
    })
    this.setState({
      filteredDocuments
    })
  }

  render() {
    return (
      <Documents documents={this.state.filteredDocuments} match={this.props.match} onChange={this.filteredDocuments} />
    )
  }
}

export default VisibleDocuments; */
