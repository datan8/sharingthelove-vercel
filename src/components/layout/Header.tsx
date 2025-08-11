import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AlignRight, X, ShoppingCart, Plus, Minus } from "lucide-react";
import { NavDropdown } from "./NavDropdown";
import { mainNavItems, type MenuItem } from "@/data/navigationData";
import { useCart } from "@/contexts/CartContext";
import { formatPrice, getProductImage } from "@/services/products";

import { env } from "@/lib/env";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const location = useLocation();
  const { state: cartState, updateQuantity } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Check if the current path matches the menu item
  const isActive = (item: MenuItem) => {
    if (item.link === "/" && location.pathname === "/") {
      return true;
    }
    return location.pathname.startsWith(item.link) && item.link !== "/";
  };

  const handleCheckout = () => {
    window.location.href = '/checkout';
  };

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white text-gray-900 shadow-sm border-b">
      <div className="container mx-auto flex h-32 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex flex-col">
            <span className="text-3xl font-bold text-gray-900">
              Sharing the Love
            </span>
            <span className="text-sm text-brandGold font-medium">
              Organic products that change lives
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center" aria-label="organic products shop">
          <ul className="flex space-x-8">
            {mainNavItems.map((item, index) => (
              <li key={index} className="nav-item">
                <Link
                  to={item.link}
                  className={`py-6 font-medium text-lg ${
                    isActive(item) ? "text-brandGold" : "text-gray-700 hover:text-brandGold"
                  }`}
                >
                  {item.title}
                </Link>
                {item.subItems && item.subItems.length > 0 && (
                  <NavDropdown subItems={item.subItems} />
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-4">
          <Button asChild variant="organic" size="lg" className="text-lg px-8 py-3">
            <Link to="/contact">Get Started</Link>
          </Button>

          {/* Cart Button */}
          <Button
            onClick={() => setShowCart(!showCart)}
            variant="outline"
            size="lg"
            className="relative text-lg px-6 py-3"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Cart
            {cartState.itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">
                {cartState.itemCount}
              </span>
            )}
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button onClick={toggleMenu} variant="ghost" size="lg" className="p-4">
                {isMenuOpen ? <X className="h-8 w-8" /> : <AlignRight className="h-8 w-8" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px]">
              <nav className="flex flex-col gap-6 mt-12">
                {mainNavItems.map((item, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <Link
                      to={item.link}
                      className={`text-lg font-medium ${
                        isActive(item) ? "text-brandGold" : "text-gray-700"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                    {item.subItems && item.subItems.length > 0 && (
                      <div className="ml-4 flex flex-col gap-3 border-l border-gray-200 pl-4 mt-1">
                        {item.subItems.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem.link}
                            className="text-sm text-gray-600"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="mt-6">
                  <Button asChild variant="organic" className="w-full">
                    <Link to="/contact">Get Started</Link>
                  </Button>
                </div>

                {/* Mobile Cart Button */}
                <div className="mt-4">
                  <Button
                    onClick={() => setShowCart(!showCart)}
                    variant="outline"
                    className="w-full relative"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Cart
                    {cartState.itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">
                        {cartState.itemCount}
                      </span>
                    )}
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowCart(false)}>
          <div
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-emerald-800">Your Cart</h2>
              <Button variant="ghost" onClick={() => setShowCart(false)}>
                ×
              </Button>
            </div>

            {cartState.items.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cartState.items.map(cartItem => (
                    <div key={cartItem.product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={getProductImage(cartItem.product)}
                        alt={cartItem.product.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/hero-bg.jpg';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{cartItem.product.name}</h3>
                        <p className="text-emerald-600 font-bold">{formatPrice(cartItem.product.price, cartItem.product.currency)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(cartItem.product.id, cartItem.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{cartItem.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(cartItem.product.id, cartItem.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold">Total:</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      {formatPrice(cartState.total)}
                    </span>
                  </div>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={handleCheckout}
                    disabled={cartState.items.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    100% of profits fund food, education and healthcare for sixty-four orphans in Viet Nam
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
