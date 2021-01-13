# Usage
  - git clone
  - remove git version
  ```
  rm -rf .git
  ```
  - git init
  - Create file .js to Shopify theme Assets from file assets/main.bundle.js
  - Create file .css to Shopify theme Assets from file assets/main.bundle.css
  - Include element
  ```html
  <div id="react-embedded-shopify"></div>
  ```
  - Include file js
  ```javascript
    <script defer type="module" src="{{ "2b.bundle.js" | asset_url }}"></script>
  ```