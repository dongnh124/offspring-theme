import React from 'react'
import './loading.css'

const Loading = () => {

  return (
    <div className="cf-react-target">
      <div className="cf-preload">

        <div className="cf-preload-label cf-preload-item"></div>
        <div className="cf-preload-field cf-preload-item"></div>
        <div className="cf-preload-label cf-preload-item"></div>
        <div className="cf-preload-field cf-preload-item"></div>
        <div className="cf-preload-label cf-preload-item"></div>
        <div className="cf-preload-field cf-preload-item"></div>

        <span className="cf-preload-button cf-preload-item"></span>
        <span className="cf-preload-button cf-preload-item"></span>

      </div>
    </div>
  )
}

export default Loading
