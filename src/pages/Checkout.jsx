import {useState} from 'react'
import { Container, Row, Col} from 'reactstrap'
import {CommonSection} from '../components'
import {ButtonWrapper} from '../components'
import { useCartSlice, useCheckoutSlice, useOrderSlice } from '../redux/hooks'
import { useNavigate } from 'react-router-dom'

import {PayPalScriptProvider} from "@paypal/react-paypal-js";
import { useEffect } from 'react'

const initForm = {
    name: '',
    email: '',
    phone: '',
    address: ''
} 

const Checkout = () => {

  const navigation = useNavigate()

  const [checkout, checkoutActions] = useCheckoutSlice()
  
  const [orders, orderActions] = useOrderSlice()  

  const [carts, cartActions, dispatch] = useCartSlice()

  const [formValue, setFormValue] = useState(initForm) 

  const [errors, setErrors] = useState({})

  const [isSubmit, setIsSubmit] = useState(false)

  const handleCheckError = (form) => {
    let error = {}

    if(form.name.length <= 1) {
        error = {...error, name: 'Your name must be more than 1 character!'}
    } 
    if(!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(form.email)) {
        error = {...error, email: 'Email is not valid!'}
    }
    if(!/(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(form.phone)) {
        error = {...error, phone: 'Your phone number is not valid! '}
    }
    if(form.address.length === 0) {
        error = {...error, address: 'The address cannot be left blank'}
    }
    return error
  }

  useEffect(() => {
    if(isSubmit && Object.keys(errors).length === 0) {
        const newOrders = checkout.selectedProducts.map((item) => ({...item, orderId: Math.random().toString(36).substr(2, 9), status: 'shipped', ...formValue}))
        dispatch(orderActions.addOrder(newOrders))
        navigation('/orders') 
        console.log(123)
    }
  }, [isSubmit])

  const handleSubmitCheckout = () => {
    // dispatch(cartActions.clearCart())
    setErrors(handleCheckError(formValue))
    setIsSubmit(true)
  }

  const handleSetFormValue = (e) => {
    const {name, value} = e.target
    setFormValue({...formValue, [name]: value})
  }

     
  return (
    <div >
        <CommonSection title={'Checkout'}/>
        <Container>
            <Row>
                <Col lg={12}>
                    <div className="mb-4 mt-10">
                        <h1 className='font-bold text-2xl'>Shipping address</h1>
                    </div>
                </Col>
                <Col lg={7}>
                    <div>
                        <form action="">
                            <div>
                                <input 
                                    onChange={handleSetFormValue}
                                    value={formValue.name} 
                                    className="w-full border-b-2 outline-none p-[10px_8px] mt-3" 
                                    type="text" 
                                    name="name" 
                                    placeholder="Enter your name" 
                                />
                                <p className="text-main text-sm font-middle">{errors.name}</p>
                            </div>
                            <div>
                                <input 
                                    onChange={handleSetFormValue}
                                    value={formValue.email} 
                                    className="w-full border-b-2 outline-none p-[10px_8px] mt-3" 
                                    type="email" 
                                    name="email" 
                                    placeholder="Enter your email" 
                                />
                                <p className="text-main text-sm font-middle">{errors.email}</p>
                            </div>
                            <div>
                                <input 
                                    onChange={handleSetFormValue}
                                    value={formValue.phone} 
                                    className="w-full border-b-2 outline-none p-[10px_8px] mt-3" 
                                    type="tel" 
                                    name="phone" 
                                    placeholder="Enter your phone" 
                                />
                                <p className="text-main text-sm font-middle">{errors.phone}</p>
                            </div>
                            <div>
                                <input 
                                    onChange={handleSetFormValue}
                                    value={formValue.address} 
                                    className="w-full border-b-2 outline-none p-[10px_8px] mt-3" 
                                    type="text" 
                                    name="address" 
                                    placeholder="Enter your delivery address" 
                                />
                                <p className="text-main text-sm font-middle">{errors.address}</p>
                            </div>
                        </form>

                    </div>
                </Col>
                <Col lg={5}>
                    <div className="bg-rgba_2 p-[30px_20px]">
                        <div className='mb-4 mt-2'>
                            <h1 className="text-lg font-semibold text-white">Total: <span className="text-main text-xl ml-2">${carts.totalAmount}</span></h1>
                        </div>
                        <PayPalScriptProvider
                            options={{
                                "client-id": "AQkV0L-mRdhjJC0b-enLRwR6D5PQp7IfuOSQPmbT8Z3EJ7iETU_wQaC8hmvIFB0gXHm-VPpbR8UMuNo-",
                                components: "buttons",
                                currency: "USD"
                            }}
                            >
                            <ButtonWrapper
                                currency={'USD'}
                                showSpinner={true}
                                style={{"layout":"vertical", "z-index": "1!important"}}
                                amount={checkout.totalPayments}
                                dispatchAction={() => handleSubmitCheckout()}
                            />
                        </PayPalScriptProvider>
                        <div className=" w-full ">
                            <button onClick={() => handleSubmitCheckout()}  className="w-full p-[14px_10px] rounded-md bg-emerald-500 text-white ">Only cash</button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default Checkout