import React, { cloneElement, useEffect } from 'react'
import $ from 'jquery'

const Account = () => {

  useEffect(() => {
    const wrap = $('#react-account-info')
    // const accountEle = $('#AddressForm')
    const resetPassEle = $('#RecoverPasswordForm')
    function handleAddNewAddress(e) {
      console.log('aaaaaaaa')
    }

    function handleCancelAddNew(e) {
      console.log('bbbbbbbb')
    }

    // accountEle
    //   .appendTo(wrap)
    resetPassEle
      .appendTo(wrap)

    // const accountClone = $('#AddressForm', wrap)
    const resetPassClone = $('#RecoverPasswordForm', wrap)
    resetPassClone
      .removeClass('hide')
    $('#HideRecoverPasswordLink', wrap)
      .addClass('hide')
    // accountClone.removeClass('hide')

    // const addNewAddressBtn = $('.add-new.address-new-toggle', accountClone)
    // const cancelAddNewBtn = $('.link-accent-color.address-new-toggle', accountClone)

    // addNewAddressBtn.on('click', handleAddNewAddress)
    // cancelAddNewBtn.on('click', handleCancelAddNew)

    return () => {
      // addNewAddressBtn.off('click', handleAddNewAddress)
      // cancelAddNewBtn.off('click', handleCancelAddNew)
      // accountClone
      //   .addClass('hide')
      //   .appendTo('body')
      resetPassClone
        .addClass('hide')
        .appendTo('body')
    }
  }, [])

  return (
    <div id="react-account-info"></div>
  )
}

export default Account
