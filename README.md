# ALIX VALEN — Men's Fashion Storefront (Frontend Demo)

## Files
- `index.html` – page structure (header, hero, sections, footer, cart/wishlist/product/account dialogs).
- `style.css` – design system, layout, responsive rules.
- `script.js` – product data, rendering, search, filters, cart, wishlist, modals, carousel, forms.
- `assets/images/` – local photos (see "Images" below).

## Open it
Double-click `index.html`, or in VS Code install **Live Server**, right-click `index.html` → **Open with Live Server**.
Fonts load from Google Fonts, so you need an internet connection for the intended typography (system fallbacks are used offline).

## Images (important)
The images in `assets/images/` are **crops taken from your reference screenshot** so the page matches it out of the box. They are low resolution and will look soft on large screens. Replace them with proper photos: keep the same file name (or edit the `img` / `src` paths in `script.js` and `index.html`). Square images work best for products (the grid uses a 1:1 ratio); the hero and editorial images should be wide, with the subject on the right. Images that fail to load are hidden and the neutral tone behind them shows. No remote image URLs are used, so nothing depends on third‑party hosting.

## Edit products
Open `script.js` and edit the `PRODUCTS` array (`name`, `price` as a number in rupees, `cat`, `colors`, `desc`, `img`). Categories and counts live in `CATEGORIES`. Contact details are in the footer of `index.html` (elements marked `data-contact`).

## How to test
- **Cart:** hover a product and press *Add to cart* (always visible on mobile). Open the bag icon to change quantity, remove items and see the total. Refresh: the cart persists (localStorage).
- **Wishlist:** tap the heart on a card; the heart icon in the header opens saved items. Persists after refresh.
- **Search / filters:** type in the search box (e.g. "coat"); a no-match term shows a message and a clear link. Click a category circle to filter; click it again or "Show all products" to reset.
- **Product details:** click any product image or name for the modal (colour, quantity, add to cart).
- **Newsletter:** enter an invalid email to see the error, then a valid one to see the demo success message.

## Demo vs production
Everything here runs in the browser only. For production you need a backend for: real newsletter delivery (an email service such as Mailchimp or Brevo), accounts and sign-in, checkout and payments, a product database and inventory, and order management. The account panel and checkout button are clearly marked demos. Footer social links are placeholders; add your real URLs.
