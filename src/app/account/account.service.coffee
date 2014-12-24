angular
.module 'lendbitcoin'
.service 'Account',
  class Account
    constructor: (@$cookieStore, @_) ->

    @getAddressBook = () ->
      $cookieStore.get('AddressBook') ? {}

    @getFavs = () ->
      $cookieStore.get('Favs') ? {bonds: [], issuers: []}

    @addIssuer = (issuer, nickname) ->
      ab = @getAddressBook()
      ab[issuer] = nickname
      $cookieStore.put 'AddressBook', ab

    @removeIssuer = (issuer) ->
      ab = @getAddressBook()
      delete ab[issuer]
      $cookieStore.put 'AddressBook', ab

    @addFavBond = (bond) ->
      favs = @getFavs()
      cleanBond = _.pick(bond, ['i', 's'])
      favs.bonds.push(cleanBond) if _.find(favs.bonds, cleanBond) is false
      $cookieStore.put 'Favs', favs

    @removeFavBond = (bond) ->
      favs = @getFavs()
      favs.bonds = _.remove(favs.bonds, _.pick(bond, ['i', 's']))
      $cookieStore.put 'Favs', favs

    @getFavBonds = () ->
      @getBonds().bonds

    Object.defineProperties Account,
      'acc':
        get: -> @acc ?= @$cookieStore.get 'acc'
        set: (@_acc) ->
          regexp = val.match(/r[\w]{33}/)
          if regexp[0]
            acc = regexp[0]
            $cookieStore.put('acc', acc)
            true
          else
            false

