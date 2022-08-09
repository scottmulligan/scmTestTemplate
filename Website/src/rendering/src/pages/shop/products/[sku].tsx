import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { logViewEvent } from '../../../services/CdpService';
import { Product, ShopLayout } from '../../../components/Products/Shop';

type ProductProps = {
  name: string;
  price: number;
  image_url: string;
  brand: string;
  sku: string;
};

type Widget = {
  widget: {
    rfkid: string;
  };
  content: {
    product: {
      value: [ProductProps];
    };
  };
};

type rfkResponse = {
  batch: [Widget];
};

// Example URL: /shop/products/64114
const ProductPage = (): JSX.Element => {
  const [productDetails, setProductDetails] = useState<ProductProps | undefined>(undefined);
  const [similarProducts, setSimilarProducts] = useState<ProductProps[] | undefined>(undefined);
  const [moreProducts, setMoreProducts] = useState<ProductProps[] | undefined>(undefined);

  const router = useRouter();
  const { sku } = router.query;

  const fetchData = useCallback(() => {
    const data = {
      context: {
        page: {
          uri: '/hs/product/details',
          locale_country: 'us',
          locale_language: 'en',
          sku: sku,
        },
        user: {
          uuid: '123',
          user_id: '123',
        },
      },
      batch: [
        { widget: { rfkid: 'hs_pdp' } },
        { widget: { rfkid: 'hs_sim' } },
        { widget: { rfkid: 'hs_more' } },
      ],
      content: { product: { field: { value: ['image_url', 'name', 'price', 'brand', 'sku'] } } },
    };

    const headers = [
      ['Authorization', '01-90d83624-99f708fa77a1e96a25c4a2afd0f28a4c23ff5251'],
      ['Content-Type', 'application/json'],
    ];

    const url = 'https://api.rfksrv.com/search-rec/11269-125757327/3';

    fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ data }),
    })
      .then((res) => res.json())
      .then((res) => {
        const productDetails = getWidgetById(res, 'hs_pdp');
        const similarProducts = getWidgetById(res, 'hs_sim');
        const moreProducts = getWidgetById(res, 'hs_more');

        setProductDetails(productDetails?.content.product.value[0]);
        setSimilarProducts(similarProducts?.content.product.value);
        setMoreProducts(moreProducts?.content.product.value);
      });
  }, [sku]);

  useEffect(() => {
    if (sku) {
      logViewEvent();
      fetchData();
    }
  }, [sku, fetchData]);

  return (
    <ShopLayout>
      <Head>
        <title>PLAY! SHOP - Product</title>
      </Head>

      <section className="section">
        <div className="section__content container">
          <div className="product-detail">
            <div className="product-detail-hero">
              <div className="product-image">
                <img className="product-image-main" src={productDetails?.image_url} alt="product" />
              </div>
              <div className="product-description">
                <h2>{productDetails?.name}</h2>
                <div className="product-brand">{productDetails?.brand}</div>
                <p>SKU: {sku}</p>
                <div>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo vitae alias
                  nostrum cum dolore eaque, ex accusantium officiis nam cumque.
                </div>
                <div>
                  Price: <span className="product-price">{productDetails?.price}</span>
                </div>
                <div>
                  Quantity:{' '}
                  <div className="product-quantity">
                    <div className="quantity-number">1</div>
                  </div>
                </div>
                <div className="product-add-to-cart">
                  <Link href="#">
                    <a className="btn--main btn--main--round">Add to cart</a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="product-info">
              <div className="product-list product-list-also-viewed">
                <h2>Customers who viewed this item also viewed</h2>
                <div className="shop-by-container">
                  {moreProducts?.map((product, index) => (
                    <Product key={index} {...product} />
                  ))}
                </div>
              </div>
              <div className="product-list product-list-similar">
                <h2>Similar items to explore</h2>
                <div className="shop-by-container">
                  {similarProducts?.map((product, index) =>
                    index < 5 ? <Product key={index} {...product} /> : ''
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ShopLayout>
  );
};

const getWidgetById = (res: rfkResponse, id: string) => {
  return res.batch.find((widget: Widget) => widget.widget.rfkid === id);
};

export default ProductPage;
