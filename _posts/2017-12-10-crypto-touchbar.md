---
title: Crypto TouchBar ₿
updated: 2017-12-10 02:30
---

### Macbook Touchbar Crypto Price Ticker

A touch bar widget for crypto currency price (Bitcoin, Ethereum, and Litecoin)

![b](https://github.com/jameshih/crypto_touchbar/blob/master/banner.JPG)

### Dependencies

- Install BetterTouchBarTool - [https://www.boastr.net/downloads/](https://www.boastr.net/downloads/)
- Install Homebrew - [https://brew.sh/](https://brew.sh/)
- Install jq - open terminal and type <code>brew install jq</code>
- Download - touchbar_crypto.json [https://github.com/jameshih/crypto_touchbar/blob/master/touchbar_crypto.json](https://github.com/jameshih/crypto_touchbar/blob/master/touchbar_crypto.json)

### Installation

Launch BetterTouchBarTool and go to Preferences, click Manage Presets, and import touchbar_crypto.json into BetterTouchBarTool. Enjoy!

### Configuration

Bitcoin and Ethereum prices are both from Gemini exchange, and Litcoin price is from Bitstamp exchange.
<br>
<br>
I am using the web API by cryptocompare.com, which you can easily point the widget to your desired exchange and fiat currency by editing COIN and EXCHANGE in the url below

```
https://min-api.cryptocompare.com/data/price?fsym=COIN&tsyms=USD&e=EXCHANGE
```

ex: [https://min-api.cryptocompare.com/data/price?fsym=LTC&tsyms=USD&e=GDAX](https://min-api.cryptocompare.com/data/price?fsym=LTC&tsyms=USD&e=coinbase)

For more information on the API please visit [https://www.cryptocompare.com/api/#-api-data-price-](https://www.cryptocompare.com/api/#-api-data-price-)

### Integrating Other Coins

Adding price ticker for other coin is easy
<br>
<br>
Simply click the +Widget button in BetterTouchBarTool's Preferences and assign the widget to "Run Apple Script and Show Return Value"
<br>
<br>
If you are unfamiliar with Apple Script, you can copy and paste the template code below and follow the configuration section to assign the widge to your desired coin.

```
set p to do shell script "curl 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD&e=Gemini' | /usr/local/bin/jq .USD"
return "$" & p
```
