import React, { useEffect, useState } from 'react'
import { getJSON, } from 'jquery'
import styles from './test.module.css'
import './styles.css'

import Loading from './components/loading'
import Order from './components/order'
import Subscription from './components/subscription'

const TYPE_ORDER = 'order'
const TYPE_SUBSCRIPTION = 'subscription'
const TYPE_PAYMENT = 'payment'

const Layout = () => {
  const [loading, setLoading] = useState(true)
  const [subscriptions, setSubscriptions] = useState([])
  const [payment, setPayment] = useState([])
  const [contentType, setContentType] = useState(TYPE_ORDER)

  const fetchData = () => {
    (async () => {
      try {
        const subscriptions = await getJSON(`${LINK_FETCH}/customers/${shopify_customer_id}/subscriptions`)
        // const payment = await getJSON(`${LINK_FETCH}/customers/${shopify_customer_id}/payments`)
        setSubscriptions(subscriptions)
        // setPayment(payment)
        setLoading(false)
      } catch (error) {
        setSubscriptions([])
        // setPayment([])
        setLoading(false)
      }
    })()
  }

  useEffect(() => {
    console.log('COMPONENT DID MOUNT')
    fetchData()
  }, [])

  return (
    <>

      <div className={`${styles.heading}`}>
        <h1>{`Welcome back, ${customerFistName}`}</h1>
        <h3>Manage your account, update your details and more.</h3>
      </div>

      <div className={`${styles.wrap}`}>
        <div className={`${styles.sidebar}`}>
          <ul>
            <li
              className={`${contentType === TYPE_ORDER ? 'active' : ''}`}
              onClick={() => setContentType(TYPE_ORDER)}
            >Order History</li>
            <li
              className={`${contentType === TYPE_SUBSCRIPTION ? 'active' : ''}`}
              onClick={() => setContentType(TYPE_SUBSCRIPTION)}
            >Subscription Plan</li>
            {/* <li
              className={`${contentType === TYPE_PAYMENT ? 'active' : ''}`}
              onClick={() => setContentType(TYPE_PAYMENT)}
            >Payment Infomation</li> */}
          </ul>
        </div>
        <div className={`${styles.content}`}>
        {
          loading
            ? <Loading />
            : <>
            <div>
              <div className={`${styles.contentHeader}`}>
                { contentType === TYPE_ORDER && `Order History` }
                { contentType === TYPE_SUBSCRIPTION && `Subscription Plan` }
                { contentType === TYPE_PAYMENT && `Payment Information` }
              </div>
              <div className={`${styles.contentTitle}`}>
                { contentType === TYPE_ORDER && `Order History` }
                { contentType === TYPE_SUBSCRIPTION && `Subscription Plan` }
                { contentType === TYPE_PAYMENT && `Payment Information` }
              </div>
              <hr />
              <div className={`${styles.contentDescription}`}>
                { contentType === TYPE_ORDER && `Review your order or billing history by plan, see details, download invoices, and more.` }
                { contentType === TYPE_SUBSCRIPTION && `This is where you can view the status or modify your subscription plan.` }
                { contentType === TYPE_PAYMENT && '' }
              </div>
            </div>
            { contentType === TYPE_ORDER && <Order orders={allOrders} /> }
            { contentType === TYPE_SUBSCRIPTION && <Subscription subscriptions={subscriptions} refetch={fetchData} setLoading={setLoading} /> }
            { contentType === TYPE_PAYMENT && <Order orders={allOrders} /> }
            </>
        }
        </div>
      </div>
    </>
  )
}

export default Layout
