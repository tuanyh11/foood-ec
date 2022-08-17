import React from 'react'
import { Container, Row, Col} from 'reactstrap'
import {CommonSection} from '../components'
import { useOrderSlice } from '../redux/hooks'

const Orders = () => {

  const [orders, orderActions] = useOrderSlice()
  const showItems = []
  return (
    <div>
        <CommonSection title={'Checkout'}/>
        <Container>
              <Row>
                <Col lg={12}>
                  <div className="tableCartPage overflow-auto shadow  p-3 rounded-sm">
                    <table className="w-full border-spacing-y-4 border-separate table-auto" >
                      <thead className="bg-gray-50 shadow-md  border-b-2 border-gray-200">
                        <tr>
                          <th className="p-2 ">
                          </th>
                          <th className='p-2 text-lg font-semibold'>Product</th>
                          <th className='p-2 text-lg font-semibold'>Name</th>
                          <th className='p-2 text-lg font-semibold'>Extras</th>
                          <th className='p-2 text-lg font-semibold'>Price</th>
                          <th className="p-2 text-lg font-semibold text-center">Quantity</th>
                          <th className="p-2 text-lg font-semibold">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* {showItems.map((item, i) => (
                          <tr key={i} className="hover:bg-slate-200 transition p-2" >
                            <td className="p-2">
                              <input  type="checkbox" checked={item?.isChecked || false} name={item.cartId} onChange={handleChecked}/>
                            </td>
                            <td className="whitespace-nowrap">
                              <img className="w-20 h-20 shadow-md border border-slate-500 rounded-[50%]" src={item.product.imageUrl} alt="" />
                            </td>
                            <td className="whitespace-nowrap">
                              <p>
                                {item.product.name} 
                              </p>
                            </td>
                            <td className="whitespace-nowrap">
                              <p>
                                {item.size}
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
                        ))} */}
                      </tbody>
                    </table>
                  </div>
                </Col>
              </Row>
            </Container>
    </div>
  )
}

export default Orders