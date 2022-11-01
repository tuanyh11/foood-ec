import { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  CardProduct,
  Comments,
  CommonSection,
  Message,
  Pagination,
} from "../components";
import bannerImg from "../assets/images/img_1.png";
import Slider from "react-slick";
import {
  useCartSlice,
  useCommentSlice,
  useAuthSlice,
  useCheckoutSlice,
} from "../redux/hooks";
import { useDispatch } from "react-redux";
import { AddItemToCart, getProductByIdApi, IMG_URL } from "../assets/Api";
import { useMemo } from "react";

const initPreviewData = {
  size: "",
  quantity: 1,
  price: 0,
};

const initError = { type: "", errorMsg: "" };

const FoodDetail = () => {
  const param = useParams();

  const navigation = useNavigate();

  const [product, setProduct] = useState();

  const [tab, setTab] = useState("dsc");

  const [sameProducts, setSameProducts] = useState([]);

  const [selectVariant, setSelectVariant] = useState([]);

  const [error, setError] = useState(initError);

  const [previewData, setPreviewData] = useState({ quantity: 1 });

  const [addSuccess, setAddSuccess] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  //    redux hooks
  const dispatch = useDispatch();

  const [checkout, checkoutActions] = useCheckoutSlice();

  const [user] = useAuthSlice();

  const { addToCart } = useCartSlice()[1];

  const [
    { comments, length },
    { addComment, delComment, updateComment, initComment },
  ] = useCommentSlice();

  //    get product

  const getProductById = async function () {
    try {
      const { data } = await getProductByIdApi(param.id);
      setProduct(data.data);
      dispatch(
        initComment({
          comments: data.data.comments,
          length: data.data.commentLength,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProductById();
    window.scrollTo(0, 0);
    setSelectVariant([]);
    setPreviewData(initPreviewData);

    return () => {
      document.removeEventListener("click", () => {});
    };
  }, [param.id, dispatch]);

  //    slick settings

  const RightArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        onClick={onClick}
        style={{ ...style }}
        className={`${className} before:text-[36px] before:text-main before:content-['→'] z-8 translate-x-[-300%] translate-y-[-50%] `}
      />
    );
  };

  const LeftArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        onClick={onClick}
        style={{ ...style }}
        className={`${className} before:text-[36px] before:text-main before:content-['←'] z-8   translate-x-[225%] translate-y-[-50%] `}
      />
    );
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <RightArrow />,
    prevArrow: <LeftArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  //   set perviewProduct

  const handleQuantity = (action, data) => {
    if (action === "decr")
      setPreviewData((pre) => ({
        ...data,
        quantity: Number(pre.quantity) > 1 ? Number(pre.quantity) - 1 : 1,
      }));
    else if (action === "incr") {
      setPreviewData((pre) => ({
        ...data,
        quantity:
          pre.quantity + 1 > data.quantity ? pre.quantity : pre.quantity + 1,
      }));
    }
  };

  const handleQuantityNumber = (value, data) => {
    if (/^[0-9]*$/.test(value))
      setPreviewData((pre) => ({
        ...pre,
        quantity:
          Number(value) <= data.quantity ? Number(value) : previewData.quantity,
      }));
    else setPreviewData((pre) => ({ ...pre }));
  };

  const handleSelectVariant = (value, id) => {
    setSelectVariant((pre) => {
      if (pre?.length === 0)
        return [{ _id: id, value: value?.text, valueId: value._id }];

      if (pre.find((item) => item.valueId === value._id)) {
        return pre.filter((item) => item.valueId !== value._id);
      }

      let matchValue = pre?.map((item, index) => {
        if (item?._id === id && item.valueId !== value._id) {
          return { ...item, value: value?.text, valueId: value._id };
        }
        return item;
      });
      if (matchValue?.every((item) => item?._id !== id)) {
        return [
          ...matchValue,
          { _id: id, value: value?.text, valueId: value._id },
        ];
      }

      return matchValue;
    });
  };

  //   handle add to cart

  //   handle add product successfully
  useEffect(() => {
    let timeId;
    if (addSuccess) {
      timeId = setTimeout(() => {
        setAddSuccess(false);
      }, 1000);
    }
    return () => clearTimeout(timeId);
  }, [addSuccess]);

  //   handle add Comment

  const productSelected = useMemo(
    () =>
      product?.productItems?.find(
        (item) =>
          item.unique.toLowerCase() ===
          selectVariant
            .map((item) => item.value)
            .sort()
            .join("")
            .toLowerCase()
      ),
    [selectVariant, product]
  );

  const productQuantity = productSelected || product;

  const isMaxQuantity = productQuantity?.quantity === previewData?.quantity;

  const isHasVariant = productQuantity?.variants?.length > 0;

  const handleAddtoCart = async (data, isCheckOut) => {
    const { quantity, comments, ...rest } = data;
    !user?.token && navigation("/login");
    data = data?.image
      ? {
          ...rest,
          quantity: previewData?.quantity,
          availableQty: data.quantity,
          checkout: isCheckOut || false,
        }
      : {
          ...rest,
          image: product?.image,
          quantity: previewData?.quantity,
          name: product?.name,
          availableQty: data.quantity,
          checkout: isCheckOut || false,
        };

    try {
      const { data: cart } = await AddItemToCart(data);
      dispatch(addToCart(cart.data?.products));
      isCheckOut && navigation("/cart", {state: true})
      setError(initError);
      setAddSuccess(true);
    } catch (error) {
      setError({ type: "commonErr", errorMsg: error.message });
    }
  };

  const handleSetPagination = async (page) => {
    try {
      const { data } = await getProductByIdApi(param.id, { page: page });
      setProduct(data.data);
      dispatch(
        initComment({
          comments: data.data.comments,
          length: data.data.commentLength,
        })
      );
      setCurrentPage(page);
    } catch (error) {
      console.log(error);
    }
  };

  const checkBeforeOrder = (isCheckOut) =>
    !isHasVariant
      ? handleAddtoCart(productQuantity, isCheckOut)
      : !productSelected
      ? setError({
          type: "maximum",
          errorMsg: "You have to select options of this product",
        })
      : handleAddtoCart(productQuantity, isCheckOut);

  return (
    <div className="relative">
      {addSuccess ? (
        <div className="z-30  p-2 flex items-center fixed top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%] w-[200px] h-[100px] rounded-md">
          <Message type="success" message={"Product added successfully"} />
        </div>
      ) : null}
      {product ? (
        <div className="mt-10">
          <CommonSection title={product.name} bgUrl={bannerImg} />
          <section className="mt-20">
            <Container>
              <Row>
                <Col lg={5} md={6}>
                  {/* img */}
                  <div className="p-4 shadow rounded-md md:flex md:justify-center">
                    <img
                      className="w-[450px] h-[450px] object-scale-down "
                      src={IMG_URL + product.image}
                      alt=""
                    />
                  </div>
                </Col>
                <Col
                  lg={7}
                  md={6}
                  className="mt-10 lg:mt-0 md:m-0 md:flex md:justify-center md:items-center lg: lg:justify-start"
                >
                  <div className="lg:p-4 lg:!pl-10 md:p-4 p-2 capitalize ">
                    <h1 className="text-gray-800 text-3xl font-black mb-3">
                      {product.name}
                    </h1>
                    <p className="text-main text-lg font-bold mb-3">
                      Price:{" "}
                      <span className="text-2xl">
                        {product.priceMin !== product.priceMax &&
                        product.priceMin
                          ? `${product.priceMin} - ${product.priceMax}`
                          : product.price}
                      </span>
                    </p>
                    <p className="text-gray-800  text-base font-bold mb-3">
                      Category:{" "}
                      {product.categories?.map((item) => (
                        <span
                          key={item._id}
                          className="ml-2  bg-emerald-500 p-2 rounded-sm text-white"
                        >
                          {item?.name}
                        </span>
                      ))}
                    </p>
                    <div className="m-[40px_0]">
                      {product &&
                        product?.variants?.map((item) => (
                          <div
                            key={item?._id}
                            className="flex items-center text-gray-800 text-lg font-bold mb-3"
                          >
                            {item?.k}
                            <div className="ml-4">
                              {item?.v?.map((subItem) => (
                                <button
                                  key={subItem._id}
                                  onClick={() =>
                                    handleSelectVariant(subItem, item?._id)
                                  }
                                  className={`h-10 w-10  text-base font-bold text-emerald-600 rounded-md 
                                                        border-[1px] border-solid border-emerald-500 capitalize mr-2 ${
                                                          selectVariant.some(
                                                            (item) =>
                                                              item.valueId ===
                                                              subItem._id
                                                          )
                                                            ? "bg-emerald-500 text-white"
                                                            : ""
                                                        }`}
                                >
                                  {subItem.text}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="flex items-center text-gray-800  text-base font-bold mb-3">
                      <p className=" ">quantity:</p>
                      <div className="ml-4 flex">
                        <button
                          className="p-[2px_15px] text-base border-[1px] border-gray-400 hover:border-gray-600"
                          onClick={() => handleQuantity("decr")}
                        >
                          -
                        </button>
                        <input
                          type="text"
                          className="p-[2px_0] text-base border-[1px] border-gray-500 w-[50px] text-center"
                          value={
                            previewData.quantity ? previewData.quantity : ""
                          }
                          onBlur={(e) =>
                            !e.target.value &&
                            setPreviewData((pre) => ({ ...pre, quantity: 1 }))
                          }
                          onChange={(e) =>
                            handleQuantityNumber(
                              e.target.value,
                              productQuantity
                            )
                          }
                        />

                        <button
                          className={`p-[2px_15px] text-base border-[1px] border-gray-400 transition hover:border-gray-600 `}
                          onClick={() =>
                            handleQuantity("incr", productQuantity)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-lg font-bold">
                      {productSelected
                        ? productSelected?.quantity
                        : product.quantity}{" "}
                      products available
                    </div>

                    {isMaxQuantity ? (
                      <p className="text-main text-base normal-case">
                        {
                          "The quantity you selected has reached the maximum of this product"
                        }
                      </p>
                    ) : null}

                    <div>
                      <button
                        onClick={() => checkBeforeOrder()}
                        className="p-[10px] bg-white mr-4 text-emerald-500 rounded-md mt-4 border-[1px] 
                                            border-solid border-emerald-500 hover:opacity-80 transition"
                      >
                        Add to cart
                      </button>

                      <button
                        to={"/cart"}
                        className="p-[10px] bg-main text-white rounded-md mt-4 border-[1px] 
                                            border-solid border-main hover:bg-white hover:!text-main transition"
                        onClick={() => checkBeforeOrder(true)}
                      >
                        Order now
                      </button>
                    </div>

                    {error.type === "commonErr" ? (
                      <div className="mt-4">
                        <Message message={error.errorMsg} />
                      </div>
                    ) : null}

                    {error.type === "maximum" && error.errorMsg ? (
                      <div className="mt-4">
                        <Message message={error.errorMsg} />
                      </div>
                    ) : null}
                  </div>
                </Col>
              </Row>
            </Container>
          </section>

          {/* tab */}
          <section className="mt-10">
            <Container>
              <Row>
                {/* nav */}
                <Col lg={12}>
                  <div className="flex p-[10px_0] bordder shadow-bt">
                    <h1
                      className={`mr-4 text-lg font-bold text-gray-700 cursor-pointer ${
                        tab === "dsc" ? "!text-main" : ""
                      }`}
                      onClick={() => setTab("dsc")}
                    >
                      Description
                    </h1>
                    <h1
                      className={`ml-4 text-lg font-bold text-gray-700 cursor-pointer ${
                        tab === "rev" ? "!text-main" : ""
                      } `}
                      onClick={() => setTab("rev")}
                    >
                      Review
                    </h1>
                  </div>
                </Col>
                {/* content */}
                {tab === "dsc" ? (
                  <Col lg={12}>
                    <div className="p-[30px_0]">
                      <p className="text-base text-gray-limit00">
                        {product.description}
                      </p>
                    </div>
                  </Col>
                ) : (
                  <Col lg={6} className="min-h-[770px] relative">
                    {/* comment tab */}
                    <div className="p-[30px_0]">
                      <Comments
                        {...{
                          addComment,
                          updateComment,
                          delComment,
                          user,
                          comments,
                          commentBucketId: product?.commentBucket?._id,
                        }}
                      />
                      <div className="mt-10 absolute -bottom-20 right-0 left-0">
                        <Pagination
                          lengthItems={length}
                          limit={10}
                          limitPage={10}
                          currentPage={currentPage}
                          setCurrentPage={(page) => handleSetPagination(page)}
                        />
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
            </Container>
          </section>

          {/* the same food */}
          <section className="mt-10">
            <Container>
              <Row>
                <Col lg={12}>
                  <div className="m-[20px_0]">
                    <h1 className="text-3xl font-extrabold">
                      The same products
                    </h1>
                  </div>
                </Col>
                <Col lg={12}>
                  <Slider {...settings}>
                    {sameProducts.map((product) => (
                      <div key={product.id} className="p-2">
                        <Link to={`/foods/${product.id}`}>
                          <CardProduct data={product} />
                        </Link>
                      </div>
                    ))}
                  </Slider>
                </Col>
              </Row>
            </Container>
          </section>
        </div>
      ) : null}
    </div>
  );
};

export default FoodDetail;
