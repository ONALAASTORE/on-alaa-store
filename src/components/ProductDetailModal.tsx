import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Truck, 
  Check, 
  MessageCircle, 
  ShoppingCart, 
  ArrowLeftRight, 
  Heart,
  CreditCard
} from 'lucide-react';
import { Product, Currency, ProductVariant } from '../types';
import { formatPrice } from '../utils/currency';

interface ProductDetailModalProps {
  product: Product | null;
  currency: Currency;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  isCompared: boolean;
  onToggleCompare: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  isCompared,
  onToggleCompare,
}) => {
  if (!product) return null;

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'delivery'>('specs');
  const [added, setAdded] = useState(false);

  const currentVariant = product.variants[selectedVariantIndex] || product.variants[0];

  const handleAddToCart = () => {
    onAddToCart(product, currentVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello On Alaa Store! 🇱🇧\nI would like to order:\n- Item: ${product.name}\n- Variant: ${currentVariant.name}\n- Price: $${currentVariant.priceUSD}\n- Qty: ${quantity}\n\nPlease let me know delivery timeframe and payment details.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-5 space-y-4">
            {/* Main Stage */}
            <div className="relative aspect-square rounded-2xl bg-slate-50 border border-slate-100 p-6 flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain object-center"
                referrerPolicy="no-referrer"
              />
              {product.isHotDeal && (
                <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                  Hot Deal
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.galleryImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl border-2 p-1 bg-slate-50 shrink-0 transition overflow-hidden ${
                      selectedImage === img ? 'border-blue-600' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Guarantees Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>{product.warranty}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Direct dispatch • Fast nationwide delivery all Lebanon</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>Cash on Delivery in USD, L.L., or Whish Money</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Variant Selection */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Brand & Category */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {product.brand} • {product.category}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleWishlist(product.id)}
                    className={`p-2 rounded-xl border transition ${
                      isWishlisted ? 'border-rose-300 bg-rose-50 text-rose-500' : 'border-slate-200 text-slate-600 hover:text-rose-500'
                    }`}
                    title="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                  </button>
                  <button
                    onClick={() => onToggleCompare(product)}
                    className={`p-2 rounded-xl border transition ${
                      isCompared ? 'border-blue-300 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-600 hover:text-blue-600'
                    }`}
                    title="Compare"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display leading-snug">
                {product.name}
              </h2>

              {/* Reviews & Condition */}
              <div className="flex items-center gap-3 text-xs flex-wrap">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-1 rounded-md border border-amber-200/60 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-amber-700">({product.reviewCount} customer reviews)</span>
                </div>
                <span className="bg-emerald-50 text-emerald-800 px-2 py-1 rounded-md border border-emerald-200/60 font-semibold">
                  {product.condition}
                </span>
                <span className="text-slate-500">
                  Status: <strong className="text-emerald-600">In Stock (Warehouse Lebanon)</strong>
                </span>
              </div>

              {/* Price Block */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Price (Cash / COD)</div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                    {formatPrice(currentVariant.priceUSD, currency)}
                  </div>
                  {currency === 'USD' && (
                    <div className="text-xs text-slate-500 font-medium">
                      ≈ {formatPrice(currentVariant.priceUSD, 'LBP')} (Rate: 89,500 L.L.)
                    </div>
                  )}
                </div>

                {product.originalPriceUSD && (
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block line-through">
                      Was {formatPrice(product.originalPriceUSD, currency)}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Save ${(product.originalPriceUSD - currentVariant.priceUSD).toFixed(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Variant Selector */}
              {product.variants.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Select Model / Storage / Color Variant:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.variants.map((v, idx) => {
                      const isSelected = selectedVariantIndex === idx;
                      return (
                        <button
                          key={v.id}
                          id={`modal-variant-btn-${idx}`}
                          onClick={() => setSelectedVariantIndex(idx)}
                          className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {v.colorHex && (
                              <span 
                                className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" 
                                style={{ backgroundColor: v.colorHex }}
                              />
                            )}
                            <span className="text-xs font-semibold truncate">{v.name}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-900 shrink-0">
                            ${v.priceUSD}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-bold text-slate-800">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-slate-600 hover:text-slate-900 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-bold text-xs text-slate-900 min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-slate-600 hover:text-slate-900 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  id="modal-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className={`py-3.5 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart (${currentVariant.priceUSD * quantity})</span>
                    </>
                  )}
                </button>

                <a
                  id="modal-whatsapp-order-btn"
                  href={`https://wa.me/96171135241?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3.5 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Tabbed Specifications & Features Section */}
        <div className="border-t border-slate-200 bg-slate-50/50 p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-4">
            <button
              onClick={() => setActiveTab('specs')}
              className={`text-xs font-bold pb-1 cursor-pointer transition ${
                activeTab === 'specs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`text-xs font-bold pb-1 cursor-pointer transition ${
                activeTab === 'features' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Key Features
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`text-xs font-bold pb-1 cursor-pointer transition ${
                activeTab === 'delivery' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Lebanon Delivery & Warranty
            </button>
          </div>

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="bg-white p-3 rounded-xl border border-slate-200/80">
                  <span className="font-bold text-slate-500 block text-[11px] uppercase tracking-wider">{key}</span>
                  <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'features' && (
            <ul className="space-y-2.5 text-xs text-slate-700 bg-white p-4 rounded-xl border border-slate-200/80">
              {product.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{feat}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'delivery' && (
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 space-y-3 text-xs text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 text-sm">Delivery Guidelines for Lebanon</h4>
              <p>
                <strong>Dispatch & Coverage:</strong> Direct dispatch from Jadra Warehouse Store. Express delivery across Greater Beirut, Chouf, Mount Lebanon, Tripoli, Saida, Tyre, Nabatieh, and Bekaa within 24 to 48 hours.
              </p>
              <p>
                <strong>Warranty Claims:</strong> All sealed items include official agent barcode stickers. You can claim service directly at authorized brand centers in Lebanon (e.g. Apple Authorized, CTC Samsung, Xiaomi Lebanon) or through our Jadra Warehouse Store counter.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
