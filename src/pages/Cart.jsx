import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import {CommonSection, Message} from '../components'
import { useAuthSlice, useCartSlice, useCheckoutSlice } from '../redux/hooks'
import { useEffect, useState } from "react";
import {useLocation, useNavigate} from 'react-router-dom'
import { checkAllItem, getCartByUserId, IMG_URL, updateCartItem } from '../assets/Api';
import Checkout from './Checkout';


// This values are the props in the UI




const Cart = () => {

  const [_, {addToCart}, dispatch] = useCartSlice()

  const [showItems, setShowItems] = useState([])

  const [error, setError] = useState() 

  const [isCheckout, setIsCheckOut] = useState(false) 

  const navigate = useNavigate();


  const state = useLocation()?.state


  const getItemsCart = async () => {
    try {
      const {data} = await getCartByUserId()
      dispatch(addToCart(data.data.products))
      setShowItems(data.data.products)
    } catch (error) {
      console.log(error)
    }
  }


  

  useEffect(() => {
    getItemsCart()
    if(state) setIsCheckOut(state)
  }, [state])


  const handleChecked =async (check, data, type) => {
    try {
      if(type === "check_all") 
        await checkAllItem({checkout: check})
      else 
        await updateCartItem({...data, checkout: check})
      getItemsCart()
      setError({})
    } catch (error) {
      
    }

  }

  
  
  const productCheckout = showItems.filter(item => item.checkout)
  
  const totalPayments = productCheckout.reduce((a, b) =>  a + Number(b.price) * Number(b.quantity), 0)
  
  const handleConfirmSlected = () => {
    if(totalPayments > 0) {
      setIsCheckOut(true)
    } else {
      setError({type: 'checkout', message: 'Please select a product to checkout'})
    }
  }

  return (
    <div className="">
      <CommonSection title={'Cart'}/>

      {showItems.length === 0  ? 
        (
          <div className='flex justify-center h-20 items-center mt-[80px]'>
            <h1 className="font-extrabold text-2xl text-slate-800 flex items-center"><span className='text-[100px]'>&#128528;</span> Your cart is empty </h1>
          </div>
        )  :
        (
          <div className="mt-10">
            <Container>
              <Row>
                <Col lg={12}>
                  <div className="tableCartPage overflow-auto shadow  p-3 rounded-sm">
                    <table className="w-full border-spacing-y-4 border-separate table-auto" >
                      <thead className="bg-gray-50 shadow-md  border-b-2 border-gray-200">
                        <tr>
                          <th className="p-2 ">
                            <input 
                              type="checkbox" 
                              name="selectedAll"
                              className='!w-5 !h-5' 
                              onChange={(e) => handleChecked(e.target.checked, null, "check_all")} 
                              checked={showItems?.every(item => item.checkout)} 
                            />
                          </th>
                          <th className='p-2 text-lg font-semibold'>Product</th>
                          <th className='p-2 text-lg font-semibold'>Name</th>
                          <th className='p-2 text-lg font-semibold'>Variant</th>
                          <th className='p-2 text-lg font-semibold'>Price</th>
                          <th className="p-2 text-lg font-semibold text-center">Quantity</th>
                          <th className="p-2 text-lg font-semibold">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {showItems.map((item, i) => (
                          <tr key={i} className="hover:bg-slate-200 transition p-2" >
                            <td className="p-2">
                              {console.log(item.checkout)}
                              <input  type="checkbox" className='!w-5 !h-5' checked={item.checkout} name={item._id} onChange={(e) => handleChecked(e.target.checked, item)}/>
                            </td>
                            <td className="whitespace-nowrap">
                              <img className="w-20 h-20 shadow-md border border-slate-500 rounded-[50%]" src={IMG_URL+item?.image} alt="" />
                            </td>
                            <td className="whitespace-nowrap">
                              <p>
                                {item.name} 
                              </p>
                            </td>
                            <td className="whitespace-nowrap">
                              <p>
                                {item.option}
                              </p>
                            </td>
                            <td className="whitespace-nowrap">
                              <p>
                                {item.price}
                              </p>
                            </td>
                            <td className="whitespace-nowrap">
                              <p className="text-center">
                                {item.quantity}
                              </p>
                            </td>
                            <td className="whitespace-nowrap">
                              <p>
                                {Number(item.price) * Number(item.quantity)}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Col>
                <Col lg={12} className="mt-10">
                  <div className="flex justify-center items-center flex-col lg:block">
                    <h1 className="text-lg font-semibold">Total: <span className="text-main text-xl ml-2">${totalPayments}</span></h1>
                    <div className="mt-2 lg:mb-10">
                        <button onClick={handleConfirmSlected}  className="p-[18px_20px] bg-main text-white rounded-md">Checkout</button>
                    </div>
                  </div>
                </Col>
                {isCheckout &&<Col>
                    <Checkout
                      products={productCheckout}
                      totalPayments={totalPayments}
                    />
                </Col>}
                {error?.type === 'checkout' &&
                  <Col>
                    <Message message={error.message}/>
                  </Col>
                }
              </Row>
            </Container>
          </div>
        )
      }

    </div>
  )
}

export default Cart