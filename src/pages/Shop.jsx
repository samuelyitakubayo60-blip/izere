import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useFadeIn } from '../hooks/useFadeIn';
import T from '../components/T';
import Icon from '../components/Icon';
import {
  getDeliveryQuote,
  listLocationChildren,
  listShopProducts,
  placeShopOrder,
} from '../services/shopService';

const CATEGORIES = ['all', 'menstrual', 'prevention', 'testing', 'mama', 'hygiene'];
const SORTS = ['featured', 'price_asc', 'price_desc', 'name'];
const EMPTY_LOCATION = { province: '', district: '', sector: '', cell: '', village: '' };

function formatRwf(value) {
  return `${Number(value || 0).toLocaleString()} RWF`;
}

export default function Shop() {
  const { language, t } = useLanguage();
  const fadeRef = useFadeIn([]);
  const { items, addItem, setQuantity, removeItem, clearCart, count, totalRwf } = useCart();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [checkout, setCheckout] = useState({ customer_name: '', phone: '', notes: '' });
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [location, setLocation] = useState(EMPTY_LOCATION);
  const [options, setOptions] = useState({
    province: [],
    district: [],
    sector: [],
    cell: [],
    village: [],
  });
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const mixedTypes = useMemo(() => new Set(items.map((row) => row.category)).size > 1, [items]);
  const grandTotal = totalRwf + (deliveryMethod === 'delivery' ? deliveryFee : 0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await listShopProducts({
          category: category === 'all' ? undefined : category,
          sort,
        });
        if (!cancelled) setProducts(data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.detail || err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [category, sort]);

  useEffect(() => {
    listLocationChildren().then((names) => {
      setOptions((prev) => ({ ...prev, province: names }));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!location.province) {
      setOptions((prev) => ({ ...prev, district: [], sector: [], cell: [], village: [] }));
      return;
    }
    listLocationChildren({ province: location.province }).then((names) => {
      setOptions((prev) => ({ ...prev, district: names, sector: [], cell: [], village: [] }));
    }).catch(() => {});
  }, [location.province]);

  useEffect(() => {
    if (!location.province || !location.district) {
      setOptions((prev) => ({ ...prev, sector: [], cell: [], village: [] }));
      return;
    }
    listLocationChildren({ province: location.province, district: location.district }).then((names) => {
      setOptions((prev) => ({ ...prev, sector: names, cell: [], village: [] }));
    }).catch(() => {});
  }, [location.province, location.district]);

  useEffect(() => {
    if (!location.sector) {
      setOptions((prev) => ({ ...prev, cell: [], village: [] }));
      return;
    }
    listLocationChildren({
      province: location.province,
      district: location.district,
      sector: location.sector,
    }).then((names) => {
      setOptions((prev) => ({ ...prev, cell: names, village: [] }));
    }).catch(() => {});
  }, [location.province, location.district, location.sector]);

  useEffect(() => {
    if (!location.cell) {
      setOptions((prev) => ({ ...prev, village: [] }));
      return;
    }
    listLocationChildren({
      province: location.province,
      district: location.district,
      sector: location.sector,
      cell: location.cell,
    }).then((names) => {
      setOptions((prev) => ({ ...prev, village: names }));
    }).catch(() => {});
  }, [location.province, location.district, location.sector, location.cell]);

  useEffect(() => {
    getDeliveryQuote(deliveryMethod, location.province || undefined)
      .then((data) => setDeliveryFee(Number(data.delivery_rwf || 0)))
      .catch(() => setDeliveryFee(0));
  }, [deliveryMethod, location.province]);

  const setLocationField = (field, value) => {
    setLocation((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'province') Object.assign(next, { district: '', sector: '', cell: '', village: '' });
      if (field === 'district') Object.assign(next, { sector: '', cell: '', village: '' });
      if (field === 'sector') Object.assign(next, { cell: '', village: '' });
      if (field === 'cell') Object.assign(next, { village: '' });
      return next;
    });
  };

  const onCheckout = async (e) => {
    e.preventDefault();
    if (!items.length) return;
    setPlacing(true);
    setNotice('');
    try {
      const order = await placeShopOrder({
        ...checkout,
        delivery_method: deliveryMethod,
        ...location,
        items: items.map((row) => ({ product_id: row.id, quantity: row.quantity })),
      });
      clearCart();
      setReceipt(order);
      setCheckout({ customer_name: '', phone: '', notes: '' });
      setLocation(EMPTY_LOCATION);
    } catch (err) {
      setNotice(err.response?.data?.detail || err.message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div ref={fadeRef}>
      <section className="page-hero">
        <div className="container">
          <span className="section-label"><T k="shop.label" /></span>
          <h1 className="hero-title"><T k="shop.title" /></h1>
          <p className="hero-desc mt-3"><T k="shop.intro" /></p>
        </div>
      </section>

      <section className="section">
        <div className="container shop-pillars">
          <article className="glass-card shop-pillar">
            <h3><T k="shop.pillar1Title" /></h3>
            <p><T k="shop.pillar1Text" /></p>
          </article>
          <article className="glass-card shop-pillar">
            <h3><T k="shop.pillar2Title" /></h3>
            <p><T k="shop.pillar2Text" /></p>
          </article>
        </div>
      </section>

      <section className="section shop-section">
        <div className="container shop-layout">
          <div>
            <div className="shop-toolbar">
              <div className="shop-filters" role="tablist" aria-label={t('shop.filterLabel')}>
                {CATEGORIES.map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={category === id ? 'is-active' : ''}
                    onClick={() => setCategory(id)}
                  >
                    {t(`shop.cat.${id}`)}
                  </button>
                ))}
              </div>
              <label className="shop-sort">
                <span>{t('shop.sortLabel')}</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  {SORTS.map((id) => (
                    <option key={id} value={id}>{t(`shop.sort.${id}`)}</option>
                  ))}
                </select>
              </label>
            </div>

            {error && <p className="shop-notice">{error}</p>}
            {loading && <p className="shop-muted">{t('common.loading')}</p>}

            {!loading && (
              <div className="shop-grid">
                {products.map((product) => {
                  const name = language === 'rw' ? (product.name_rw || product.name_en) : product.name_en;
                  const desc = language === 'rw' ? (product.description_rw || product.description_en) : product.description_en;
                  const unit = language === 'rw' ? (product.unit_rw || product.unit_en) : product.unit_en;
                  return (
                    <article key={product.id} className="shop-card">
                      <div className="shop-card-image">
                        <img src={product.image_url || '/shop/pads.svg'} alt={name} />
                        <span className="shop-card-cat">{t(`shop.cat.${product.category}`)}</span>
                      </div>
                      <div className="shop-card-body">
                        <h3>{name}</h3>
                        <p>{desc}</p>
                        <div className="shop-card-meta">
                          <strong>{formatRwf(product.price_rwf)}</strong>
                          <span>{unit}</span>
                        </div>
                        <button
                          type="button"
                          className="shop-add"
                          disabled={!product.in_stock}
                          onClick={() => addItem(product)}
                        >
                          <Icon name="shopping-cart" /> {product.in_stock ? t('shop.add') : t('shop.out')}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="shop-cart glass-card" id="cart">
            <h2><T k="shop.cartTitle" /> {count > 0 && <span>({count})</span>}</h2>
            <p className="shop-muted"><T k="shop.cartHint" /></p>
            {mixedTypes && <p className="shop-mixed"><T k="shop.mixed" /></p>}
            {!items.length && !receipt && <p className="shop-muted"><T k="shop.emptyCart" /></p>}
            <ul className="shop-cart-list">
              {items.map((row) => {
                const name = language === 'rw' ? (row.name_rw || row.name_en) : row.name_en;
                return (
                  <li key={row.id}>
                    <img src={row.image_url || '/shop/pads.svg'} alt="" />
                    <div>
                      <strong>{name}</strong>
                      <em>{t(`shop.cat.${row.category}`)}</em>
                      <span>{formatRwf(row.price_rwf * row.quantity)}</span>
                    </div>
                    <div className="shop-qty">
                      <button type="button" onClick={() => setQuantity(row.id, row.quantity - 1)}>-</button>
                      <input
                        type="number"
                        min="1"
                        value={row.quantity}
                        onChange={(e) => setQuantity(row.id, e.target.value)}
                      />
                      <button type="button" onClick={() => setQuantity(row.id, row.quantity + 1)}>+</button>
                      <button type="button" className="shop-remove" onClick={() => removeItem(row.id)}>×</button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="shop-totals">
              <p><span><T k="shop.productsPrice" /></span> <strong>{formatRwf(totalRwf)}</strong></p>
              <p><span><T k="shop.deliveryPrice" /></span> <strong>{formatRwf(deliveryMethod === 'delivery' ? deliveryFee : 0)}</strong></p>
              <p className="shop-total"><span><T k="shop.grandTotal" /></span> <strong>{formatRwf(grandTotal)}</strong></p>
            </div>

            <form onSubmit={onCheckout} className="shop-checkout">
              <input
                required
                placeholder={t('shop.name')}
                value={checkout.customer_name}
                onChange={(e) => setCheckout({ ...checkout, customer_name: e.target.value })}
              />
              <input
                required
                placeholder={t('shop.phone')}
                value={checkout.phone}
                onChange={(e) => setCheckout({ ...checkout, phone: e.target.value })}
              />

              <fieldset className="shop-method">
                <legend><T k="shop.deliveryChoose" /></legend>
                <label>
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'delivery'}
                    onChange={() => setDeliveryMethod('delivery')}
                  />
                  <T k="shop.methodDelivery" />
                </label>
                <label>
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'pickup'}
                    onChange={() => setDeliveryMethod('pickup')}
                  />
                  <T k="shop.methodPickup" />
                </label>
              </fieldset>

              {deliveryMethod === 'delivery' && (
                <div className="shop-location">
                  <p className="shop-muted"><T k="shop.locationHint" /></p>
                  <select required value={location.province} onChange={(e) => setLocationField('province', e.target.value)}>
                    <option value="">{t('shop.province')}</option>
                    {options.province.map((name) => <option key={name} value={name}>{name}</option>)}
                  </select>
                  <select required disabled={!location.province} value={location.district} onChange={(e) => setLocationField('district', e.target.value)}>
                    <option value="">{t('shop.district')}</option>
                    {options.district.map((name) => <option key={name} value={name}>{name}</option>)}
                  </select>
                  <select required disabled={!location.district} value={location.sector} onChange={(e) => setLocationField('sector', e.target.value)}>
                    <option value="">{t('shop.sector')}</option>
                    {options.sector.map((name) => <option key={name} value={name}>{name}</option>)}
                  </select>
                  <select required disabled={!location.sector} value={location.cell} onChange={(e) => setLocationField('cell', e.target.value)}>
                    <option value="">{t('shop.cell')}</option>
                    {options.cell.map((name) => <option key={name} value={name}>{name}</option>)}
                  </select>
                  <select required disabled={!location.cell} value={location.village} onChange={(e) => setLocationField('village', e.target.value)}>
                    <option value="">{t('shop.village')}</option>
                    {options.village.map((name) => <option key={name} value={name}>{name}</option>)}
                  </select>
                </div>
              )}

              <textarea
                placeholder={t('shop.notes')}
                value={checkout.notes}
                onChange={(e) => setCheckout({ ...checkout, notes: e.target.value })}
              />
              <button type="submit" className="shop-add" disabled={!items.length || placing}>
                {placing ? t('shop.placing') : t('shop.place')}
              </button>
            </form>
            {notice && <p className="shop-notice">{notice}</p>}

            {receipt && (
              <div className="shop-receipt">
                <h3><T k="shop.receiptTitle" /></h3>
                <p className="shop-muted">{t('shop.orderOk').replace('{id}', String(receipt.id))}</p>
                {receipt.village && (
                  <p className="shop-muted">
                    {receipt.province} · {receipt.district} · {receipt.sector} · {receipt.cell} · {receipt.village}
                  </p>
                )}
                <p><span><T k="shop.productsPrice" /></span> <strong>{formatRwf(receipt.products_rwf)}</strong></p>
                <p><span><T k="shop.deliveryPrice" /></span> <strong>{formatRwf(receipt.delivery_rwf)}</strong></p>
                <p className="shop-total"><span><T k="shop.grandTotal" /></span> <strong>{formatRwf(receipt.total_rwf)}</strong></p>
                <p className="shop-muted"><T k="shop.payNote" /></p>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
