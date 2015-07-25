module.exports = (tagName, opts) ->
  tpl = do require "../riot/#{tagName}/#{tagName}.jade"
  ctrl = require "../riot/#{tagName}/#{tagName}.coffee"
  riot.tag tagName, tpl, ctrl
  riot.mount tagName, opts