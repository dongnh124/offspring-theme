import React from 'react'
import './modal.css'

const Modal = ({ title, open, onClose, onDone, children }) => {
  if (!open) return null

  return (
    <div
      className="my-modal"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <span className="btn-close" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-body">
          {children}
        </div>
        { onDone && <div className="modal-footer">
          <button className={`btn btn-theme`} onClick={onDone}>Ok</button>
        </div> }
      </div>
    </div>
  )
}

export default Modal
