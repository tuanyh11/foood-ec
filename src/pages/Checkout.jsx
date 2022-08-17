import {useState} from 'react'
import { Container, Row, Col} from 'reactstrap'
import {CommonSection} from '../components'
import {ButtonWrapper} from '../components'
import { useCartSlice, useCheckoutSlice } from '../redux/hooks'

import {PayPalScriptProvider} from "@paypal/react-paypal-js";


const Checkout = () => {

  const [checkout, checkoutActions, dispatch] = useCheckoutSlice()

  const [openPaypal, setOpenPaypal] = useState(false)
  
  const [carts, cartActions, dispatchCart] = useCartSlice()

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
                                <input className="w-full border-b-2 outline-none p-[10px_8px] mt-3" type="text" name="name" placeholder="Enter your name" />
                            </div>
                            <div>
                                <input className="w-full border-b-2 outline-none p-[10px_8px] mt-3" type="email" name="email" placeholder="Enter your email" />
                            </div>
                            <div>
                                <input className="w-full border-b-2 outline-none p-[10px_8px] mt-3" type="tel" name="phone" placeholder="Enter your phone" />
                            </div>
                            <div>
                                <input className="w-full border-b-2 outline-none p-[10px_8px] mt-3" type="text" name="address" placeholder="Enter your delivery address" />
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
                                dispatchAction={() => dispatchCart(cartActions.clearCart())}
                            />
                        </PayPalScriptProvider>
                        <div className=" w-full ">
                            <button   className="w-full p-[14px_10px] rounded-md bg-emerald-500 text-white ">Only cash</button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default Checkout