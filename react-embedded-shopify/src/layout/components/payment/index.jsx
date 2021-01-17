import React from 'react'
import styles from './payment.module.css'

const Payments = ({ payment }) => {

  return (
    <div className={`${styles.payment}`}>
      {
        payment.map(info => (
          <div key={info.hash} className={`${styles.paymentInfo}`}>
            <div>
              <div>Name on card: {info.cardholder_name}</div>
              <div>Mastercard ending in {info.card_last4}</div>
              <div>Expires {info.card_exp_month}/{info.card_exp_year}</div>
            </div>
            <div>
              <button className={`btn btn-theme ${styles.btnEdit}`}><a rel="noopener norefer" target="_blank" href={`/tools/recurring/customers/${info.hash}/card`}>Edit</a></button>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default Payments
