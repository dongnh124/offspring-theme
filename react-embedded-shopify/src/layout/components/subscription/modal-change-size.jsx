import React, { useState, useEffect } from 'react'
import { ajax } from 'jquery'

import Modal from '../modal'

const TYPE_DIAPER = 'diapers'
const TYPE_PANTS = 'pants'
const TYPE_MIX = 'diapers,pants'

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


const ModalChangeSize = ({ addressId, openModalChangeSize, setLoading, setOpenModalChangeSize, refetch }) => {
  const [sizeChange, setSizeChange] = useState([])
  const [sizeType, setSizeType] = useState(TYPE_DIAPER)
  const [extraChange, setExtraChange] = useState([])
  const [diaperProducts, setDiaperProducts] = useState(diaperProductsRaw.map(c => ({
    ...c,
    quantity: 0,
    variants: c.variants.map(d => ({ ...d, quantity: 0 })),
  })))
  const [step, setStep] = useState(CHOOSE_PRODUCT)
  const [showVariantsOfSecondProduct, setShowVariantsOfSecondProduct] = useState(false)
  const [isDisabledStep, setIsDisabledStep] = useState(true)

  useEffect(() => {
    setStep(CHOOSE_PRODUCT)
    setDiaperProducts(diaperProductsRaw.map(c => ({
      ...c,
      quantity: 0,
      variants: c.variants.map(d => ({ ...d, quantity: 0 })),
    })))
    setShowVariantsOfSecondProduct(false)
    setIsDisabledStep(true)
  }, [openModalChangeSize])
  const getTotalVariants = () => {
    const currentQuantity = diaperProducts
    .filter(c => c.quantity)
    .reduce((cur, acc) => {
      const currentQuantity = acc.variants.reduce((cur2, acc2) => cur2 += (acc2.quantity || 0), 0)
      return cur += currentQuantity
    }, 0)
    return currentQuantity
  }

  const handleChangeSize = () => {
    if (getTotalVariants() < maxQuantity) return
    setLoading(true)
    setOpenModalChangeSize(false)
    const variants = []
    diaperProducts.filter(c => c.quantity).forEach(product => {
      product.variants.forEach(variant => {
        if (variant.quantity) variants.push({ id: variant.id, quantity: variant.quantity, productId: product.id })
      })
    })
    const dataSubscription = {
      variants,
    }
    ajax({
      type : 'PUT',
      url : `${LINK_FETCH}/customers/${shopify_customer_id}/subscriptions/${addressId}/change-size`,
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
  const handleChangeType = (e) => {
    setSizeType(e.target.value)
    setDiaperProducts(diaperProducts.map(c => ({
      ...c,
      quantity: 0,
      variants: c.variants.map(d => ({ ...d, quantity: 0 })),
    })))
    setIsDisabledStep(true)
  }
  return (
    <Modal
      title="Change bundle type"
      open={openModalChangeSize}
      onClose={() => setOpenModalChangeSize(false)}
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
            {CHOOSE_PRODUCT === step && <div className="row js-step-wrap px-3 py-5"
                id="step-1"
                data-index="1">
              <div className="col-md-12">
                <div className="step-content">
                  <h3 className="step-title fz-10 fw-600 mb-4">
                    1. Select Bundle Type
                  </h3>
                  <div className="pb-3 mb-3 pl-4 fw-700">
                    <div className="form-check js-select-bundle">
                      <input className="form-check-input"
                        data-type="single"
                        data-bundle="diapers"
                        name="type-bundle-diapers"
                        type="radio"
                        id="type-bundle-diapers"
                        value={TYPE_DIAPER}
                        checked={sizeType === TYPE_DIAPER}
                        onChange={handleChangeType}
                      />
                      <label className="form-check-label" htmlFor="type-bundle-diapers">
                        Diapers
                      </label>
                    </div>
                    <div className="form-check js-select-bundle">
                      <input className="form-check-input"
                        data-type="single"
                        data-bundle="pants"
                        name="type-bundle-pants"
                        type="radio"
                        id="type-bundle-pants"
                        value={TYPE_PANTS}
                        checked={sizeType === TYPE_PANTS}
                        onChange={handleChangeType}
                      />
                      <label className="form-check-label" htmlFor="type-bundle-pants">
                        Training Pants
                      </label>
                    </div>
                    <div className="form-check js-select-bundle">
                      <input className="form-check-input"
                        data-type="mix"
                        name="type-bundle-mix"
                        type="radio"
                        id="type-bundle-mix"
                        value={TYPE_MIX}
                        checked={sizeType === TYPE_MIX}
                        onChange={handleChangeType}
                      />
                      <label className="form-check-label" htmlFor="type-bundle-mix">
                        Mix bundle <span className="fw-300">(Only 2 sizes allowed)</span>
                      </label>
                    </div>
                  </div>

                  <div className="step-products">
                    <div className="row">
                      {diaperProducts.filter(c => sizeType.includes(c.type.toLowerCase())).map(product => (
                        <div key={CHOOSE_PRODUCT + product.id} className="col-6 col-lg-3">
                          <div className={`step-product ${product.available ? '' : 'disabled'} js-step-item mb-5 product-type-${sizeType} ${sizeType === TYPE_MIX && (diaperProducts.filter(c => c.quantity).length >= 2 || diaperProducts.reduce((cur, acc) => cur += (acc.quantity || 0), 0) === maxQuantity) && !product.quantity && 'disabled'} ${sizeType !== TYPE_MIX && product.quantity && 'active'}`}
                            onClick={() => {
                              if (sizeType === TYPE_MIX) {
                                const currentQuantity = diaperProducts.reduce((cur, acc) => cur += (acc.quantity || 0), 0)
                                if (currentQuantity === maxQuantity) return

                                setDiaperProducts(diaperProducts.map(c => ({
                                  ...c,
                                  quantity: c.id === product.id ? (product.quantity || 0) + 1 : c.quantity,
                                  variants: c.variants.map(d => ({ ...d, quantity: 0 })),
                                })))
                                return
                              }
                              setDiaperProducts(diaperProducts.map(c => ({
                                ...c,
                                quantity: c.id === product.id ? maxQuantity : 0,
                                variants: c.variants.map(d => ({ ...d, quantity: 0 })),
                              })))
                            }}
                          >
                            <h4 className="step-product__title fz-n1 text-center mb-0 ">
                              {product.title}
                            </h4>
                            <div className="step-item__image ">
                              <img className="lazyload" src={product.featured_image}/>
                            </div>
                            {sizeType === TYPE_MIX && <div className="js-step-quantity-box">
                              <span className=""
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setDiaperProducts(diaperProducts.map(c => ({
                                    ...c,
                                    quantity: c.id === product.id ? (product.quantity || 1) - 1 > 0 ? (product.quantity || 1) - 1 : 0 : c.quantity,
                                    variants: c.variants.map(d => ({ ...d, quantity: 0 })),
                                  })))
                                  return
                                }}
                              >-</span>
                              <span
                                className="js-step-quantity"
                              >{product.quantity || 0}</span>
                              <span className=""
                                onClick={() => {
                                  const currentQuantity = diaperProducts.reduce((cur, acc) => cur += (acc.quantity || 0), 0)

                                  if (currentQuantity === maxQuantity) return

                                  setDiaperProducts(diaperProducts.map(c => ({
                                    ...c,
                                    quantity: c.id === product.id ? (product.quantity || 0) + 1 : c.quantity,
                                    variants: c.variants.map(d => ({ ...d, quantity: 0 })),
                                  })))
                                  return
                                }}
                              >+</span>
                            </div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-row-reverse justify-content-between align-items-center pt-3 border-top">
                  <div>
                    <button
                      className="btn btn-theme nextBtn btn-lg pull-right js-next-btn"
                      type="button"
                      disabled={diaperProducts.reduce((cur, acc) => cur += (acc.quantity || 0), 0) < maxQuantity}
                      onClick={() => setStep(CHOOSE_VARIANT)}
                    >Next</button>
                  </div>
                  <div className="step-total-quantity">
                    <span className="step-1 step-number js-step-total-quantity">{diaperProducts.reduce((cur, acc) => cur += (acc.quantity || 0), 0)}</span>
                    <span className="step-text">of</span>
                    <span className="step-number js-step-max-quantity">{maxQuantity}</span>
                    <div className="step-text-pack js-package"></div>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>}

            {CHOOSE_VARIANT === step && <div className="row js-step-wrap js-to-cart px-3 py-5"
              id="step-2">
              <div className="col-md-12">
                <div className="step-content">
                  <h3 className="step-title">Select design</h3>

                  <div className="py-5">
                    {diaperProducts.filter(product => product.quantity).map((product, index) => {
                      if (
                        0 === index && !showVariantsOfSecondProduct
                        || 1 === index && showVariantsOfSecondProduct
                      ) return (
                        <div
                          key={CHOOSE_VARIANT + product.id}
                          className="row mb-5 js-bundle-product"
                        >
                          {product.variants.map(variant => (
                            <div key={CHOOSE_VARIANT + variant.id} className="b-variant-item col-6 col-lg-4">
                              <div className="step-variant js-step-item mb-4">
                                <div
                                  className="step-item__image "
                                  onClick={() => {
                                    const currentQuantity = product.variants.reduce((cur, acc) => cur += (acc.quantity || 0), 0)
                                    if (currentQuantity >= product.quantity) {
                                      setIsDisabledStep(false)
                                      return
                                    }
                                    if (currentQuantity + 1 === product.quantity) {
                                      setIsDisabledStep(false)
                                    } else {
                                      setIsDisabledStep(true)
                                    }
                                    const newArr = diaperProducts.map(c => ({
                                      ...c,
                                      variants: c.id === product.id
                                        ? c.variants.map(d => {
                                          return ({
                                            ...d,
                                            quantity: d.id === variant.id
                                              ? (d.quantity || 0) + 1
                                              : (d.quantity || 0)
                                          })
                                        })
                                        : c.variants,
                                    }))
                                    setDiaperProducts(newArr)
                                  }}
                                >
                                  <img src={variant.featured_image && variant.featured_image.src} />
                                </div>
                                <div className="js-step-quantity-box">
                                  <span
                                    className=""
                                    onClick={() => {
                                      if (variant.quantity > 0) {
                                        setIsDisabledStep(true)
                                      }
                                      const newArr = diaperProducts.map(c => ({
                                        ...c,
                                        variants: c.id === product.id
                                          ? c.variants.map(d => ({
                                            ...d,
                                            quantity: d.id === variant.id
                                              ? (d.quantity || 1) - 1 > 0 ? (d.quantity || 1) - 1 : 0
                                              : (d.quantity || 0)
                                          }))
                                          : c.variants,
                                      }))
                                      setDiaperProducts(newArr)
                                    }}
                                  >-</span>
                                  <span
                                    className="js-step-quantity"
                                  >{variant.quantity || 0}</span>
                                  <span
                                    className=""
                                    onClick={() => {
                                      const currentQuantity = product.variants.reduce((cur, acc) => cur += (acc.quantity || 0), 0)
                                      if (currentQuantity >= product.quantity) {
                                        setIsDisabledStep(false)
                                        return
                                      }
                                      if (currentQuantity + 1 === product.quantity) {
                                        setIsDisabledStep(false)
                                      } else {
                                        setIsDisabledStep(true)
                                      }
                                      const newArr = diaperProducts.map(c => ({
                                        ...c,
                                        variants: c.id === product.id
                                          ? c.variants.map(d => {
                                            return ({
                                              ...d,
                                              quantity: d.id === variant.id
                                                ? (d.quantity || 0) + 1
                                                : (d.quantity || 0)
                                            })
                                          })
                                          : c.variants,
                                      }))
                                      setDiaperProducts(newArr)
                                    }}
                                  >+</span>
                                </div>
                              </div>
                              <h4 className="step-product__title fz-n1 text-center mb-0 ">
                                {variant.title}
                              </h4>
                            </div>
                          ))}
                        </div>
                      )
                      return null
                    })}
                  </div>
                </div>
                <div className="d-flex flex-row-reverse justify-content-between align-items-center pt-3 border-top">
                  <div>
                    <button
                      className="btn btn-theme nextBtn btn-lg pull-right js-next-btn"
                      type="button"
                      disabled={isDisabledStep}
                      onClick={() => {
                        if (TYPE_MIX === sizeType && diaperProducts.filter(product => product.quantity).length === 2 && !showVariantsOfSecondProduct) {
                          setShowVariantsOfSecondProduct(true)

                          if (diaperProducts
                            .filter(c => c.quantity)
                            .reduce((cur, acc) => cur += (acc.variants.reduce((cur2, acc2) => cur2 += (acc2.quantity || 0), 0) || 0), 0) < maxQuantity) {
                              setIsDisabledStep(true)
                            }
                          return
                        }
                        setStep(SHOW_CONFIRM)
                      }}
                    >Next</button>
                  </div>
                  <div className="step-total-quantity">
                    {diaperProducts.filter(product => product.quantity).map((product, index) => {
                      if (
                        0 === index && !showVariantsOfSecondProduct
                        || 1 === index && showVariantsOfSecondProduct
                      ) return (
                        <>
                          <span className="step-2 step-number js-step-total-quantity">{product.variants.reduce((cur, acc) => cur += (acc.quantity || 0), 0)}</span>
                          <span className="step-text">of</span>
                          <span className="step-number js-step-max-quantity">{product.quantity}</span>
                          <div className="step-text-pack js-package"></div>
                        </>
                      )
                    })}
                  </div>
                  <div>
                    <button
                      className="btn btn-theme prevBtn btn-lg pull-right"
                      type="button"
                      onClick={() => {
                        if (TYPE_MIX === sizeType && showVariantsOfSecondProduct) {
                          setShowVariantsOfSecondProduct(false)
                          setIsDisabledStep(false)
                          return
                        }
                        setStep(CHOOSE_PRODUCT)
                      }}
                    >Prev</button>
                  </div>
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
                    diaperProducts.filter(c => c.quantity).map(c => (
                      <div key={SHOW_CONFIRM + c.id}>
                        {c.title}
                        {
                          c.variants.filter(d => d.quantity).map(d => (
                            <div key={SHOW_CONFIRM + d.id}>- {d.title} x {d.quantity}</div>
                          ))
                        }
                      </div>
                    ))
                  }
                </div>
                <div className="d-flex flex-row-reverse justify-content-between align-items-center pt-3 border-top">
                  <div>
                    <button
                      className="btn btn-theme nextBtn btn-lg pull-right js-next-btn"
                      type="button"
                      disabled={diaperProducts
                        .filter(c => c.quantity)
                        .reduce((cur, acc) => cur += (acc.variants.reduce((cur2, acc2) => cur2 += (acc2.quantity || 0), 0) || 0), 0) < maxQuantity}
                      onClick={handleChangeSize}
                    >CONFIRM</button>
                  </div>
                  <div className="step-total-quantity">
                    <span className="step-3 step-number js-step-total-quantity">{
                      diaperProducts
                        .filter(c => c.quantity)
                        .reduce((cur, acc) => cur += (acc.variants.reduce((cur2, acc2) => cur2 += (acc2.quantity || 0), 0) || 0), 0)
                    }</span>
                    <span className="step-text">of</span>
                    <span className="step-number js-step-max-quantity">{maxQuantity}</span>
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
