# Lifely Test App as CUSTOM CHECKOUT UI Extension

The source code for custom Checkout UI Extension App for Lifely Furniture.

To see written source code for the app go to shipping-app -> src


# Shopify Task Specs Sheet 
[SPEC SHEET LINK ](https://mail.google.com/mail/u/0/popout?ver=1g3ytthb29lwb#attid%253Datt_18e786b1a9c3d491_0.1_03e4d675_5ad5cf43_1ce0f8f1_83447e28_29141d42%25252FChallenge%252520for%252520Seiji.pptx)
# Google Docs Sync Data sheet 
[GOOGLE SHEET LINK](https://docs.google.com/spreadsheets/d/11zbHnoYegLAkKj11rDhyqp1cblkNfzLXh7Jz_3ryJbU/edit#gid=0)



# Checkout UI Extension

Checkout UI extensions let app developers build custom functionality that merchants can install at defined targets in the checkout flow. You can learn more about checkout UI extensions in Shopify’s [developer documentation](https://shopify.dev/api/checkout-extensions/checkout).

## Prerequisites

Before you start building your extension, make sure that you’ve created a [development store](https://shopify.dev/docs/apps/tools/development-stores) with the [checkout extensibility developer preview](https://shopify.dev/docs/api/release-notes/developer-previews#previewing-new-features).

## Your new Extension

Your new extension contains the following files:

- `README.md`, the file you are reading right now.
- `shopify.extension.toml`, the configuration file for your extension. This file defines your extension’s name, where it will appear in the checkout, and other metadata.
- `src/Checkout.tsx`, the source code for your extension.
- `locales/en.default.json` and `locales/fr.json`, which contain translations used to [localized your extension](https://shopify.dev/docs/apps/checkout/best-practices/localizing-ui-extensions).

By default, your extension is configured to target the `purchase.checkout.block.render` [extension target](https://shopify.dev/docs/api/checkout-ui-extensions/extension-targets-overview). You will find the target both in your `shopify.extension.toml`, and in the source code of your extension. The default target allows the merchant to configure where in the checkout *they* want your extension to appear. If you are building an extension that is tied to existing UI element in the checkout, such as the cart lines or shipping options, you can change the extension target so that your UI extension will render in the correct location. Check out the list of [all available extension targets](https://shopify.dev/docs/api/checkout-ui-extensions/extension-targets-overview) to get some inspiration for the kinds of content you can provide with checkout UI extensions.

To build your extension, you will need to use APIs provided by Shopify that let you render content, and to read and write data in the checkout. The following resources will help you get started with checkout extensions:

- [Available components and their properties](https://shopify.dev/docs/api/checkout-ui-extensions/unstable/components)
- APIs for [reading](https://shopify.dev/docs/api/checkout-ui-extensions/unstable/apis/standardapi) and [writing checkout data](https://shopify.dev/docs/api/checkout-ui-extensions/unstable/apis/checkoutapi)
- [APIs by extension target](https://shopify.dev/docs/api/checkout-ui-extensions/unstable/apis/extensiontargets)

## Useful Links

- [Checkout app documentation](https://shopify.dev/apps/checkout)
- [Checkout UI extension documentation](https://shopify.dev/api/checkout-extensions)
  - [Configuration](https://shopify.dev/docs/api/checkout-ui-extensions/configuration)
  - [API Reference](https://shopify.dev/docs/api/checkout-ui-extensions/apis)
  - [UI Components](https://shopify.dev/docs/api/checkout-ui-extensions/components)
  - [Available React Hooks](https://shopify.dev/docs/api/checkout-ui-extensions/react-hooks)
- [Checkout UI extension tutorials](https://shopify.dev/docs/apps/checkout)
  - [Enable extended delivery instructions](https://shopify.dev/apps/checkout/delivery-instructions)
  - [Creating a custom banner](https://shopify.dev/apps/checkout/custom-banners)
  - [Thank you and order status pages](https://shopify.dev/docs/apps/checkout/thank-you-order-status)
  - [Adding field validation](https://shopify.dev/apps/checkout/validation)
  - [Localizing an extension](https://shopify.dev/apps/checkout/localize-ui-extensions)
