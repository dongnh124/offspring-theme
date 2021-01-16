import React, { useState, useEffect, use } from 'react'
import { ajax } from 'jquery'

import styles from './subscription.module.css'

import Modal from '../modal'
import ModalChangeSize from './modal-change-size'
import ModalChangeExtra from './modal-change-extra'

const CANCEL_ACTION = 'cancel'
const PAUSE_ACTION = 'pause'
const ACTIVATE_ACTION = 'activate'
const SKIP_ACTION = 'skip'
const CHANGE_FREQUENCY_ACTION = 'change_frequency'

const CANCELED_SUBSCRIPTION_STATUS = 'CANCELLED'
const EXPIRED_SUBSCRIPTION_STATUS = 'EXPIRED'
const ACTIVE_SUBSCRIPTION_STATUS = 'ACTIVE'

const COLLECTION_KEY = {
  diaperBundle: 'diaperBundle',
  freebieBundle: 'freebieBundle',
  extraBundle: 'extraBundle'
}

const FOTMAT_DATE = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}

const TYPE_DIAPER = 'diapers'
const TYPE_PANTS = 'pants'
const TYPE_MIX = 'diapers,pants'

const Subscription = ({ subscriptions, refetch, setLoading }) => {
  const [openModalManage, setOpenModalManage] = useState(false)
  const [openModalChangeSize, setOpenModalChangeSize] = useState(false)
  const [openModalChangeExtra, setOpenModalChangeExtra] = useState(false)
  const [addressSelected, setAddressSelected] = useState('')
  const [subscriptionByAddress, setSubscriptionByAddress] = useState()
  const [intervalFrequency, setIntervalFrequency] = useState('1')
  const [intervalUnit, setIntervalUnit] = useState('week')

  const uniqueAddress = [...new Set(subscriptions.map(c => c.address_id))]

  const handleOpenModalManage = (address) => {
    const subscription = subscriptions.find(c => c.address_id === address)
    setOpenModalManage(true)
    setAddressSelected(address)
    setSubscriptionByAddress(subscription)
    setIntervalFrequency(String(subscription.order_interval_frequency))
  }

  const handleOpenModalChangeSize = (address) => {
    const subscription = subscriptions.find(c => c.address_id === address)
    setOpenModalChangeSize(true)
    setAddressSelected(address)
    setSubscriptionByAddress(subscription)
  }

  const handleOpenModalChangeExtra = (address) => {
    const subscription = subscriptions.find(c => c.address_id === address)
    setOpenModalChangeExtra(true)
    setAddressSelected(address)
    setSubscriptionByAddress(subscription)
  }

  const handleSkip = () => {
    setLoading(true)
    setOpenModalManage(false)
    const dataSubscription = {
      action: SKIP_ACTION,
      addressId: addressSelected,
      cancellationData: {
        reason: 'Customer cancel',
        comment: '',
      },
    }
    ajax({
      type : 'PUT',
      url : `${LINK_FETCH}/customers/${shopify_customer_id}/subscriptions/${addressSelected}/status`,
      data : JSON.stringify(dataSubscription),
      contentType : 'application/json; charset=utf-8',
      dataType : 'json',
    }).done(() => {
      refetch()
    })
  }

  const handlePause = () => {
    setLoading(true)
    setOpenModalManage(false)
    const dataSubscription = {
      action: PAUSE_ACTION,
      addressId: addressSelected,
      cancellationData: {
        reason: 'Customer cancel',
        comment: '',
      },
    }
    ajax({
      type : 'PUT',
      url : `${LINK_FETCH}/customers/${shopify_customer_id}/subscriptions/${addressSelected}/status`,
      data : JSON.stringify(dataSubscription),
      contentType : 'application/json; charset=utf-8',
      dataType : 'json',
    }).done(() => {
      refetch()
    })
  }

  const handleResume = () => {
    setLoading(true)
    setOpenModalManage(false)
    const dataSubscription = {
      action: ACTIVATE_ACTION,
      addressId: addressSelected,
      cancellationData: {
        reason: 'Customer cancel',
        comment: '',
      },
    }
    ajax({
      type : 'PUT',
      url : `${LINK_FETCH}/customers/${shopify_customer_id}/subscriptions/${addressSelected}/status`,
      data : JSON.stringify(dataSubscription),
      contentType : 'application/json; charset=utf-8',
      dataType : 'json',
    }).done(() => {
      refetch()
    })
  }

  const handleCancel = () => {
    setLoading(true)
    setOpenModalManage(false)
    const dataSubscription = {
      action: CANCEL_ACTION,
      addressId: addressSelected,
      cancellationData: {
        reason: 'Customer cancel',
        comment: '',
      },
    }
    ajax({
      type : 'PUT',
      url : `${LINK_FETCH}/customers/${shopify_customer_id}/subscriptions/${addressSelected}/status`,
      data : JSON.stringify(dataSubscription),
      contentType : 'application/json; charset=utf-8',
      dataType : 'json',
    }).done(() => {
      refetch()
    })
  }

  const handleChangeInterval = () => {
    setLoading(true)
    setOpenModalManage(false)
    const dataSubscription = {
      action: CHANGE_FREQUENCY_ACTION,
      addressId: addressSelected,
      cancellationData: {
        reason: 'Customer cancel',
        comment: '',
      },
      intervalFrequency: Number(intervalFrequency),
      intervalUnit,
    }
    ajax({
      type : 'PUT',
      url : `${LINK_FETCH}/customers/${shopify_customer_id}/subscriptions/${addressSelected}/status`,
      data : JSON.stringify(dataSubscription),
      contentType : 'application/json; charset=utf-8',
      dataType : 'json',
    })
      .done(() => {
        refetch()
      })
      .fail(() => {
        refetch()
      })
  }

  return (
    <>
    {uniqueAddress.map(address => (
      <div key={address} className={`${styles.subscription}`}>
        <div className={`${styles.detail}`}>
          <img
            className={`${styles.detailImg}`}
            src='https://cdn.shopify.com/s/files/1/0271/9875/0764/products/1_428282bd-ad66-4324-bb1b-a55c4fd6da33.png?v=1603526189'
            alt='bundle image'
          />
          <div className={`${styles.detailContent}`}>
            <div className={`${styles.detailTitle}`}>
              {subscriptions.filter(c => c.address_id === address).map(sub => (
                <div key={sub.id} >
                  {sub.product_title} x {sub.quantity}
                </div>
              ))}
            </div>
            <br />
            <div className={`${styles.detailPrice}`}>
              Total {`${subscriptions.filter(c => c.address_id === address).reduce((cur, acc) => cur += parseFloat(acc.price) * parseInt(acc.quantity), 0).toFixed(2)}`}
            </div>
            <br />
            <div className={`${styles.editProduct}`}>
              <button
                className={`btn btn-theme`}
                onClick={() => handleOpenModalChangeSize(address)}
              >Change product</button>
              <button
                className={`btn btn-theme`}
                onClick={() => handleOpenModalChangeExtra(address)}
              >Edit extra product</button>
            </div>
          </div>
        </div>
        <div className={`${styles.manage}`}>
          {subscriptions.find(c => c.address_id === address).next_charge_scheduled_at
            ? (
              <div>
                <div>Next shipment</div>
                <div>{new Date(subscriptions.find(c => c.address_id === address).next_charge_scheduled_at).toLocaleDateString('en-US', FOTMAT_DATE)}</div>
                <div>Delivery every {subscriptions.find(c => c.address_id === address).order_interval_frequency} {subscriptions.find(c => c.address_id === address).order_interval_unit}s</div>
              </div>
            )
            : <div>Paused</div>}
          <button
            className={`btn btn-theme`}
            onClick={() => handleOpenModalManage(address)}
          >
            Manage
          </button>
        </div>
      </div>
    ))}
    <Modal
      title='Manage subscriptions'
      open={openModalManage}
      onClose={() => setOpenModalManage(false)}
    >
      <div>
        <div className={`${styles.modalAction}`}>

          <div className={`cancel ${styles.actionItem}`}>
            <div className={`${styles.actionDescription}`}>
              <div className={`${styles.changeInterval}`}>
                <label>
                  Delivery schedule
                  <select
                    name="interval"
                    className={`${styles.selectFrequency}`}
                    value={intervalFrequency}
                    onChange={(e) => setIntervalFrequency(e.target.value)}
                  >
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                    <option value='6'>6</option>
                    <option value='7'>7</option>
                    <option value='8'>8</option>
                  </select>
                  <select
                    className={`${styles.selectFrequency}`}
                    value={intervalUnit}
                    onChange={(e) => setIntervalUnit(e.target.value)}
                  >
                    <option value='week'>Weeks</option>
                  </select>
                </label>
              </div>
            </div>

            <button
              className='btn btn-theme'
              onClick={handleChangeInterval}
            >Change</button>
          </div>

          {subscriptionByAddress && subscriptionByAddress.canSkip ? (
            <div className={`skip ${styles.actionItem}`}>
              <div className={`${styles.actionDescription}`}>Content of action Skip</div>
              <button
                className='btn btn-theme'
                onClick={handleSkip}
              >Skip</button>
            </div>
          ) : (
            <div className={`skip ${styles.actionItem}`}>
              <div className={`${styles.actionDescription}`}>You cannot skip subscription in this time!</div>
              <button
                className='btn btn-theme'
                disabled
              >Skip</button>
            </div>
          )}

          {subscriptionByAddress && subscriptionByAddress.status === ACTIVE_SUBSCRIPTION_STATUS ? (
            <div className={`pause ${styles.actionItem}`}>
              <div className={`${styles.actionDescription}`}>Content of action Pause</div>
              <button
                className='btn btn-theme'
                onClick={handlePause}
              >Pause</button>
            </div>
          ) : (
            <div className={`skip ${styles.actionItem}`}>
              <div className={`${styles.actionDescription}`}>This subscription is paused!</div>
              <button
                className='btn btn-theme'
                disabled
              >Pause</button>
            </div>
          )}

          {subscriptionByAddress && subscriptionByAddress.status === CANCELED_SUBSCRIPTION_STATUS ? (
            <div className={`pause ${styles.actionItem}`}>
              <div className={`${styles.actionDescription}`}>Content of action Resume</div>
              <button
                className='btn btn-theme'
                onClick={handleResume}
              >Resume</button>
            </div>
          ) : (
            <div className={`skip ${styles.actionItem}`}>
              <div className={`${styles.actionDescription}`}>This subscription is actived!</div>
              <button
                className='btn btn-theme'
                disabled
              >Resume</button>
            </div>
          )}

          <div className={`cancel ${styles.actionItem}`}>
            <div className={`${styles.actionDescription}`}>Content of action Cancel</div>
            <button
              className='btn btn-theme'
              onClick={handleCancel}
            >Cancel</button>
          </div>
        </div>
      </div>
    </Modal>
    <ModalChangeSize
      openModalChangeSize={openModalChangeSize}
      setLoading={setLoading}
      setOpenModalChangeSize={setOpenModalChangeSize}
      refetch={refetch}
      addressId={addressSelected}
    />
    <ModalChangeExtra
      openModalChangeExtra={openModalChangeExtra}
      setLoading={setLoading}
      setOpenModalChangeExtra={setOpenModalChangeExtra}
      refetch={refetch}
      addressId={addressSelected}
    />
    </>
  )
}

export default Subscription
