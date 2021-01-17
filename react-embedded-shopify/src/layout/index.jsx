import React, { useEffect, useState } from 'react'
import { getJSON, } from 'jquery'
import styles from './test.module.css'
import './styles.css'

import Loading from './components/loading'
import Order from './components/order'
import Subscription from './components/subscription'
import Payments from './components/payment'
import Account from './components/account'

const TYPE_ORDER = 'order'
const TYPE_SUBSCRIPTION = 'subscription'
const TYPE_PAYMENT = 'payment'
const TYPE_ACCOUNT = 'account'

const Layout = () => {
  const [loading, setLoading] = useState(true)
  const [subscriptions, setSubscriptions] = useState([])
  const [payment, setPayment] = useState([])
  const [contentType, setContentType] = useState(TYPE_ORDER)

  const fetchData = () => {
    (async () => {
      try {
        // const subscriptions = await getJSON(`${LINK_FETCH}/customers/${shopify_customer_id}/subscriptions`)
        // const payment = await getJSON(`${LINK_FETCH}/customers/${shopify_customer_id}/payments`)
        const [
          subscriptions,
          payment,
        ] = await Promise.all([
          getJSON(`${LINK_FETCH}/customers/${shopify_customer_id}/subscriptions`),
          getJSON(`${LINK_FETCH}/customers/${shopify_customer_id}/payments`),
        ])
        console.log(payment)
        setSubscriptions(subscriptions)
        setPayment(payment)
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
        <h1>MY ACCOUNT</h1>
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
            <li
              // className={`${contentType === TYPE_ACCOUNT ? 'active' : ''}`}
              // onClick={() => setContentType(TYPE_ACCOUNT)}
            >
              <a href="/account/addresses">
                Address
              </a>
            </li>
            <li
              className={`${contentType === TYPE_ACCOUNT ? 'active' : ''}`}
              onClick={() => setContentType(TYPE_ACCOUNT)}
            >
              Account Info
            </li>
            <li
              className={`${contentType === TYPE_PAYMENT ? 'active' : ''}`}
              onClick={() => setContentType(TYPE_PAYMENT)}
            >Payment</li>
          </ul>
        </div>
        <div className={`${styles.content}`}>
        {
          loading
            ? <Loading />
            : <>
            <div>
              {/* <div className={`${styles.contentHeader}`}>
                { contentType === TYPE_ORDER && `Order History` }
                { contentType === TYPE_SUBSCRIPTION && `Subscription Plan` }
                { contentType === TYPE_ACCOUNT && `Account Info` }
                { contentType === TYPE_PAYMENT && `Payment Information` }
              </div> */}
              <div className={`${styles.contentTitle}`}>
                { contentType === TYPE_ORDER && `Order History` }
                { contentType === TYPE_SUBSCRIPTION && `Subscription Plan` }
                { contentType === TYPE_ACCOUNT && `Reset your password` }
                { contentType === TYPE_PAYMENT && `Payment Information` }
              </div>
              <hr />
              <div className={`${styles.contentDescription}`}>
                { contentType === TYPE_ORDER && `Review your order or billing history by plan, see details, download invoices, and more.` }
                { contentType === TYPE_SUBSCRIPTION && `This is where you can view the status or modify your subscription plan.` }
                { contentType === TYPE_ACCOUNT && '' }
                { contentType === TYPE_PAYMENT && '' }
              </div>
            </div>
            { contentType === TYPE_ORDER && <Order orders={allOrders} /> }
            { contentType === TYPE_SUBSCRIPTION && <Subscription subscriptions={subscriptions} refetch={fetchData} setLoading={setLoading} /> }
            { contentType === TYPE_ACCOUNT && <Account /> }
            { contentType === TYPE_PAYMENT && <Payments payment={payment} /> }
            </>
        }
        </div>
      </div>
    </>
  )
}

export default Layout
