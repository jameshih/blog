---
title: Crypto TouchBar ₿
image: https://shih.app/blog/assets/crypto-touchbar/banner.jpeg
updated: 2017-12-10 02:30
---

## MacBook Touch Bar Crypto Price Ticker

A Touch Bar widget for cryptocurrency prices: Bitcoin, Ethereum, and Litecoin.

![banner](https://shih.app/blog/assets/crypto-touchbar/banner.jpeg)

## Dependencies

- Install BetterTouchBarTool - [https://www.boastr.net/downloads/](https://www.boastr.net/downloads/)
- Install Homebrew - [https://brew.sh/](https://brew.sh/)
- Install jq: open Terminal and enter `brew install jq`
- Download [touchbar_crypto.json](https://shih.app/blog/assets/crypto-touchbar/touchbar_crypto.json)

## Installation

Launch BetterTouchBarTool and open Preferences. Click Manage Presets, then import `touchbar_crypto.json`. Enjoy!

## Configuration

Bitcoin and Ethereum prices come from the Gemini exchange, while the Litecoin price comes from Bitstamp.
<br>
<br>
The widget uses the CryptoCompare API. You can point it to your preferred exchange and fiat currency by editing `COIN` and `EXCHANGE` in the URL below.

```
https://min-api.cryptocompare.com/data/price?fsym=COIN&tsyms=USD&e=EXCHANGE
```

Example: [Litecoin priced in USD on Coinbase](https://min-api.cryptocompare.com/data/price?fsym=LTC&tsyms=USD&e=coinbase)

For more information, see the [CryptoCompare API documentation](https://www.cryptocompare.com/api/#-api-data-price-).

## Integrating Other Coins

Adding a price ticker for another coin is easy.
<br>
<br>
Click the +Widget button in BetterTouchBarTool's preferences and assign the widget to “Run Apple Script and Show Return Value.”
<br>
<br>
If you are unfamiliar with AppleScript, copy and paste the template below, then follow the configuration instructions to assign the widget to your desired coin.

```
set p to do shell script "curl 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD&e=Gemini' | /usr/local/bin/jq .USD"
return "$" & p
```
