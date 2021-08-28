import React from 'react'
import { useSelector } from 'react-redux'



const Notification = () => {

  const notification = useSelector(state => state.notification)

  if(!notification){
    return null
  }
  if(notification.style==='confirmation'){
    return (
      <div className="confirmation">
        <p>CONFIRMATION: {notification.message}</p>
      </div>
    )
  }
  if(notification.style==='error'){
    return (
      <div className="error">
        <p>ERROR: {notification.message}</p>
      </div>
    )
  }
}

export default Notification