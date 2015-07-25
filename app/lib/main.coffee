#Kefir = require 'kefir'
#ripple = require 'ripple-lib'
#riot = require 'riot'
#$ = require 'jquery'

main = require './main.jade'

#Remote = ripple.Remote
#
#remote = new Remote
#  servers: ['wss://s1.ripple.com:443']
#
## remote.trace = true
#
#remote.connect ->
#
#    remote.requestAccountOffers
#        account : 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
#        (resp, req) ->
#            console.log req


    # BASE =
    #    currency :'USD'
    #    issuer : 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'

    # TRADE =
    #    currency :'XRP'
    #    issuer : null

    # mybook_bid = remote.book
    #     currency_pays: BASE.currency
    #     issuer_pays: BASE.issuer
    #     currency_gets: TRADE.currency
    #     issuer_gets: TRADE.issuer

    # mybook_ask = remote.book
    #     currency_pays: TRADE.currency
    #     issuer_pays: TRADE.issuer
    #     currency_gets: BASE.currency
    #     issuer_gets: BASE.issuer

    # bookHandler = (type)->
    #     (offers, second, third) ->
    #         console.log "#{type} changed", offers

    # # mybook_bid.on 'model', bookHandler 'bid'
    # # mybook_ask.on 'model', bookHandler 'ask'

    # tradeHandler = (amt) ->
    #     v = ripple.Amount.from_json amt
    #     console.log 'Trade happened', do v.to_human_full

    # mybook_ask.on 'trade', tradeHandler
    # mybook_bid.on 'trade', tradeHandler



    # streamTrx = Kefir.fromEvents remote, 'transaction'
    # onlyParity = streamTrx.filter (x) ->
    #     x.ledger_index % 5 == 0
    # do onlyParity.log