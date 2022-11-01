import {useState, useEffect} from 'react'
import {RiCloseFill, RiAddFill, RiSubtractFill} from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import {ConfirmBox} from '../../'
import { IMG_URL, updateCartItem, delItemCart } from '../../../assets/Api'


const CartItem = ({data, handleQuantity, deleteCart}) => {

  const dispatch = useDispatch()

  const {availableQty, size, quantity} = data


  const [inputQuantity, setInputQuantity] = useState(0)

  const [showConfirmBox, setShowConfirmBox] = useState(false)

  useEffect(() => {
    setInputQuantity(quantity)
  }, [quantity])


  const handleNumberQuantity = (e) => {
    const quantity = Number(e.target.value)
    if(!/^[0-9]*$/.test(e.target.value)) return alert("Product quantity must be a number")
    if(quantity <= availableQty) 
     setInputQuantity(quantity)
    else {
      setInputQuantity(availableQty)
      alert('The quantity you selected has reached the maximum of this product')
    }
  }

  const updateQuantity = async function(quantity) {
    try {
      await updateCartItem({...data, quantity: quantity})
    } catch (error) {
      console.log(error)
    }
  }

  const decQuantity = () => {
    setInputQuantity(pre => pre - 1 === 0 ? 1 : pre - 1)
    const value =  inputQuantity - 1 === 0 ? 0 : inputQuantity - 1
    if(value === 0) setShowConfirmBox(true)
    else updateQuantity(value)
    
  }


  const incQuantity = () => {

    const value =  inputQuantity + 1
    if(value > availableQty) {
      alert('The quantity you selected has reached the maximum of this product')
    } else {
      updateQuantity(value)
      setInputQuantity(pre => pre + 1)
    }
  }

  const delProductItem = async () => {
    try {
      await delItemCart( data?._id)
      dispatch(deleteCart({_id: data?._id}))
    } catch (error) {
      
    }
  }

  const handleAccept = () => {
    delProductItem()
    setShowConfirmBox(false)
  }

  return (
    <div className="p-2  h-[150px] flex  transition">

      {/* cart items confirm  */}

      {showConfirmBox && 
        (
          <div className="fixed !top-0 right-0 left-0 !bottom-0 !z-[9999999]">
              <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <ConfirmBox
                  confirmTitle={'Are you sure you want to quit this product?'}
                  confirmLabel={'yes'}
                  handleAccept={handleAccept}
                  handleDeny={() => setShowConfirmBox(false)}
                />
              </div>
          </div> 
        )
      }


      <div className="flex border border-solid shadow-sm rounded lg:hover:bg-white transition  gap-4  items-center w-full">
        <img className="w-12 h-12 m-[0_10px]" src={IMG_URL+data?.image} alt="" />
        {/* content */}
        <div className="flex gap-4 flex-[1] "> 
            <div className="">
              <h2 className="text-xl font-extrabold text-slate-800 capitalize limit" >{data?.name}</h2>
              <div className="flex items-center gap-2">
                <p className=" text-sm font-bold">{quantity}x <span className="text-base text-main ml-1">{data?.price}</span></p>
                <p className="capitalize  text-base font-bold text-emerald-500">{size}</p>
              </div>
              {/* warning */}
              {/* {isWarning && <p className='text-main text-base normal-case'> </p>} */}
              <div className="flex items-center mt-2 gap-4 p-2 bg-emerald-200 justify-evenly rounded-sm">
                <button className='w-6 h-6' onClick={decQuantity}>
                  <RiSubtractFill className='w-6 h-6'/>
                </button>
                <input onChange={handleNumberQuantity} onBlur={() => dispatch(handleQuantity({cartId: data.cartId, quantity: inputQuantity}))} className="text-base font-bold w-12 text-center" value={inputQuantity} />
                <button className='w-6 h-6' onClick={incQuantity} >
                  <RiAddFill className='w-6 h-6'/>
                </button>
              </div>
            </div>
            <button className="ml-auto mr-[20px]" onClick={() => setShowConfirmBox(true)}>
              <RiCloseFill  className='w-6 h-6 cursor-pointer' />
            </button>
        </div>
      </div>
    </div>
  )
}

export default CartItem