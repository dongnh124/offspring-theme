import React from 'react'
import styles from './order.module.css'

const Order = ({ orders }) => {
  return (
    <table className={`${styles.table}`}>
      <thead>
        <tr>
          <th>Order</th>
          <th>Date</th>
          <th>Payment status</th>
          <th>Fulfillment status</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
      {
        orders.map(order => (
          <React.Fragment key={order.name}>
            <tr>
              <td>{order.name}</td>
              <td>{order.createdAt}</td>
              <td>{order.financialStatusLabel}</td>
              <td>{order.fulfillmentStatus}</td>
              <td dangerouslySetInnerHTML={{ __html: order.totalPrice}} />
            </tr>
          </React.Fragment>
        ))
      }
      </tbody>
    </table>
  )
}

export default Order
