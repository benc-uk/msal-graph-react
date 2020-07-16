import React from 'react'

export default class DetailsModal extends React.Component {
  render() {
    return <div className={`banner ${this.props.active ? 'modal is-active' : 'modal'}`}>
      <div className="modal-background"></div>
      <div className="modal-content" style={{ width: '80%' }}>

        <div className="notification is-info is-light">
          <button className="delete" onClick={() => this.props.onClose()}></button>
          <h5 className="title is-5">{this.props.title}</h5>
          <pre style={typeof this.props.content != 'object' ? { whiteSpace: 'pre-wrap', wordWrap:'break-word' } : {}}>
            {typeof this.props.content == 'object' ? JSON.stringify(this.props.content, null, 2) : this.props.content}
          </pre>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={() => this.props.onClose()}></button>
    </div>
  }
}
