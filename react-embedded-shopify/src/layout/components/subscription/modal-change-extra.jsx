import React, { useState, useEffect } from 'react'
import { ajax } from 'jquery'

import Modal from '../modal'

const CHOOSE_PRODUCT = 1
const CHOOSE_VARIANT = 2
const SHOW_CONFIRM = 3

const clearSelection = () => {
  if(document.selection && document.selection.empty) {
    document.selection.empty();
  } else if(window.getSelection) {
    var sel = window.getSelection();
    sel.removeAllRanges();
  }
}

const ModalChangeSize = ({ addressId, openModalChangeExtra, setLoading, setOpenModalChangeExtra, refetch }) => {
  const [extraProducts, setExtraProducts] = useState(extraProductsRaw.map(c => ({
    ...c,
    quantity: 0,
    variants: c.variants.map(d => ({ ...d, quantity: 0 })),
  })))
  const [step, setStep] = useState(CHOOSE_VARIANT)


  useEffect(() => {
    setStep(CHOOSE_VARIANT)
    setExtraProducts(extraProductsRaw.map(c => ({
      ...c,
      quantity: 0,
      variants: c.variants.map(d => ({ ...d, quantity: 0 })),
    })))
  }, [openModalChangeExtra])

  const handleChangeExtra = () => {
    setLoading(true)
    setOpenModalChangeExtra(false)
    const variants = []
    extraProducts.filter(c => c.quantity).forEach(product => {
      variants.push({ id: product.variants[0].id, quantity: product.quantity, productId: product.id })
    })
    const dataSubscription = {
      variants,
    }
    ajax({
      type : 'PUT',
      url : `${LINK_FETCH}/customers/${shopify_customer_id}/subscriptions/${addressId}/change-extra`,
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
    <Modal
      title="Change extra product"
      open={openModalChangeExtra}
      onClose={() => setOpenModalChangeExtra(false)}
    >
    <div>
      <div className="container-fluid"
        onMouseDown={(e) => {
          e.preventDefault()
          clearSelection()
        }}
      >
        <div className="row">
          <div className="col-12 bundle-col-right">
            {/* <!-- STEP 1 - GENERATE PRODUCT --> */}
            {CHOOSE_VARIANT === step && <div className="row js-step-wrap js-to-cart px-3 py-5"
              id="step-2">
              <div className="col-md-12">
                <div className="step-content">
                  <h3 className="step-title">Select extra</h3>

                  <div className="py-5">
                    <div
                      className="row mb-5 js-bundle-product"
                    >
                    {extraProducts.map((product, index) => {
                      return (
                        <div key={CHOOSE_VARIANT + product.id} className={`b-variant-item col-6 col-lg-4 ${product.available ? '' : 'disabled'}`}>
                          <div className="step-variant js-step-item mb-4">
                            <div
                              className="step-item__image "
                              onClick={() => {
                                const cur = extraProducts.reduce((cur, acc) => cur += (acc.quantity || 0), 0)
                                if (cur >= extraMaxQuantity) return
                                console.log(cur)
                                const newArr = extraProducts.map(c => ({
                                  ...c,
                                  quantity: c.id === product.id
                                    ? (c.quantity || 0) + 1
                                    : c.quantity,
                                }))
                                setExtraProducts(newArr)
                              }}
                            >
                              <img src={product.featured_image} />
                            </div>
                            <div className="js-step-quantity-box">
                              <span
                                className=""
                                onClick={() => {
                                  const newArr = extraProducts.map(c => ({
                                    ...c,
                                    quantity: c.id === product.id
                                    ? (c.quantity || 1) - 1 > 0 ? (c.quantity || 1) - 1 : 0
                                    : c.quantity,
                                  }))
                                  setExtraProducts(newArr)
                                }}
                              >-</span>
                              <span
                                className="js-step-quantity"
                              >{product.quantity || 0}</span>
                              <span
                                className=""
                                onClick={() => {
                                  const cur = extraProducts.reduce((cur, acc) => cur += (acc.quantity || 0), 0)
                                  if (cur >= extraMaxQuantity) return
                                  const newArr = extraProducts.map(c => ({
                                    ...c,
                                    quantity: c.id === product.id
                                      ? (c.quantity || 0) + 1
                                      : c.quantity,
                                  }))
                                  setExtraProducts(newArr)
                                }}
                              >+</span>
                            </div>
                          </div>
                          <h4 className="step-product__title fz-n1 text-center mb-0 ">
                            {product.title}
                          </h4>
                        </div>
                      )
                    })}
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-row-reverse justify-content-between align-items-center pt-3 border-top">
                  <div>
                    <button
                      className="btn btn-theme nextBtn btn-lg pull-right js-next-btn"
                      type="button"
                      onClick={() => {
                        setStep(SHOW_CONFIRM)
                      }}
                    >Next</button>
                  </div>
                  <div className="step-total-quantity">
                    <span className="step-2 step-number js-step-total-quantity">{extraProducts.reduce((cur, acc) => cur += (acc.quantity || 0), 0)}</span>
                    <span className="step-text">of</span>
                    <span className="step-number js-step-max-quantity">{extraMaxQuantity}</span>
                    <div className="step-text-pack js-package"></div>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>}

            {SHOW_CONFIRM === step && <div className="row js-step-wrap js-to-cart px-3 py-5"
              id="step-3"
              data-index="3">
              <div className="col-md-12">
                <div className="step-content">
                  <h3 className="step-title">Confirm</h3>
                  {
                    extraProducts.filter(c => c.quantity).length
                      ? extraProducts.filter(c => c.quantity).map(c => (
                        <div key={SHOW_CONFIRM + c.id}>
                          {c.title} x {c.quantity}
                        </div>
                      ))
                      : (
                        <div>You don't have select any extra products. By clicking Confirm, you will remove all current extra product subscription!</div>
                      )
                  }
                </div>
                <div className="d-flex flex-row-reverse justify-content-between align-items-center pt-3 border-top">
                  <div>
                    <button
                      className="btn btn-theme nextBtn btn-lg pull-right js-next-btn"
                      type="button"
                      onClick={handleChangeExtra}
                    >CONFIRM</button>
                  </div>
                  <div className="step-total-quantity">
                    <span className="step-3 step-number js-step-total-quantity">{extraProducts.reduce((cur, acc) => cur += (acc.quantity || 0), 0)}</span>
                    <span className="step-text">of</span>
                    <span className="step-number js-step-max-quantity">{extraMaxQuantity}</span>
                    <div className="step-text-pack js-package"></div>
                  </div>
                  <div>
                    <button
                      className="btn btn-theme prevBtn btn-lg pull-right"
                      type="button"
                      onClick={() => {
                        setStep(CHOOSE_VARIANT)
                      }}
                    >Prev</button>
                  </div>
                </div>
              </div>
            </div>}

          </div>
        </div>
      </div>
    </div>
    </Modal>
  )
}

export default ModalChangeSize
