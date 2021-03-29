// ----------------------------------------------------------------------------
// Copyright (c) Ben Coleman, 2020
// Licensed under the MIT License.
//
// Modal popup for showing pre-formatted text
// ----------------------------------------------------------------------------

import React from 'react'

export default class DetailsModal extends React.Component {
  render() {
    let link = this.props.link ? (
      <a className="button is-primary is-pulled-right" rel="noopener noreferrer" target="_blank" href={this.props.link}>
        {this.props.link}
      </a>
    ) : null

    let preStyle = typeof this.props.content != 'object' ? { whiteSpace: 'pre-wrap', wordWrap: 'break-word' } : {}
    let preContent =
      typeof this.props.content == 'object' ? JSON.stringify(this.props.content, null, 2) : this.props.content

    return (
      <div className={`banner ${this.props.active ? 'modal is-active' : 'modal'}`}>
        <div className="modal-background" onClick={() => this.props.onClose()}></div>
        <div className="modal-content" style={{ width: '80%' }}>
          <div className="notification is-info is-light">
            <button className="delete" onClick={() => this.props.onClose()}></button>

            <h5 className="title is-5">
              {this.props.title} {link}
            </h5>

            <pre style={preStyle}>{preContent}</pre>
          </div>
        </div>
      </div>
    )
  }
}
