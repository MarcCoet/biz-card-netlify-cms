'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _templateObject = _taggedTemplateLiteral(['{bgCyan Plugin ApiServer} Object with key "', '" breaks GraphQL naming convention. Renamed to "', '"'], ['{bgCyan Plugin ApiServer} Object with key "', '" breaks GraphQL naming convention. Renamed to "', '"']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var crypto = require('crypto');
var stringify = require('json-stringify-safe');
var deepMapKeys = require('deep-map-keys');
var nanoid = require('nanoid');
var chalk = require('chalk');
var log = console.log;

/**
 * Encrypts a String using md5 hash of hexadecimal digest.
 *
 * @param {any} str
 */
var digest = function digest(str) {
  return crypto.createHash('md5').update(str).digest('hex');
};

// Prefix to use if there is a conflict with key name
var conflictFieldPrefix = 'alternative_';

// Keys that will conflic with graphql
var restrictedNodeFields = ['id', 'children', 'parent', 'fields', 'internal'];

// Create nodes from entities
exports.createNodesFromEntities = function (_ref) {
  var entities = _ref.entities,
      entityType = _ref.entityType,
      schemaType = _ref.schemaType,
      createNode = _ref.createNode,
      reporter = _ref.reporter;

  var dummyEntity = _extends({
    id: 'dummy',
    __type: entityType
  }, schemaType);
  entities.push(dummyEntity);

  entities.forEach(function (e) {
    var __type = e.__type,
        entity = _objectWithoutProperties(e, ['__type']);

    // if (schemaType) {
    //   const fieldNames = Object.keys(entity)
    //   fieldNames.forEach(fieldName => {
    //     entity[fieldName] = setBlankValue(schemaType[fieldName], entity[fieldName])
    //   })
    // }

    var node = _extends({}, entity, {
      parent: null,
      children: [],
      mediaType: 'application/json',
      internal: {
        type: e.__type,
        contentDigest: digest(JSON.stringify(e))
      }
    });
    // console.log(`node: `, node);
    createNode(node);
  });
};

// If entry is not set by user, provide an empty value of the same type
var setBlankValue = function setBlankValue(shemaValue, fieldValue) {
  if (typeof shemaValue === 'string') {
    return typeof fieldValue === 'undefined' || fieldValue === null ? '' : fieldValue;
  } else if (typeof shemaValue === 'number') {
    return typeof fieldValue === 'undefined' || fieldValue === null ? NaN : fieldValue;
  } else if ((typeof shemaValue === 'undefined' ? 'undefined' : _typeof(shemaValue)) === 'object' && !Array.isArray(shemaValue)) {
    var obj = typeof fieldValue === 'undefined' || fieldValue === null ? {} : fieldValue;
    Object.keys(shemaValue).forEach(function (itemName) {
      obj[itemName] = setBlankValue(shemaValue[itemName]);
    });
    return obj;
  } else if ((typeof shemaValue === 'undefined' ? 'undefined' : _typeof(shemaValue)) === 'object' && Array.isArray(shemaValue)) {
    // TODO: Need to fix it
    return [setBlankValue(shemaValue[0])];
  } else if (typeof shemaValue === 'boolean') {
    return typeof fieldValue === 'undefined' || fieldValue === null ? false : fieldValue;
  } else {
    return fieldValue;
  }
};

/**
 * Validate the GraphQL naming convetions & protect specific fields.
 *
 * @param {any} key
 * @returns the valid name
 */
function getValidKey(_ref2) {
  var key = _ref2.key,
      _ref2$verbose = _ref2.verbose,
      verbose = _ref2$verbose === undefined ? false : _ref2$verbose;

  var nkey = String(key);
  var NAME_RX = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
  var changed = false;
  // Replace invalid characters
  if (!NAME_RX.test(nkey)) {
    changed = true;
    nkey = nkey.replace(/-|__|:|\$|\.|\s/g, '_');
  }
  // Prefix if first character isn't a letter.
  if (!NAME_RX.test(nkey.slice(0, 1))) {
    changed = true;
    nkey = '' + conflictFieldPrefix + nkey;
  }
  if (restrictedNodeFields.includes(nkey)) {
    changed = true;
    nkey = ('' + conflictFieldPrefix + nkey).replace(/-|__|:|\$|\.|\s/g, '_');
  }
  if (changed && verbose) log(chalk(_templateObject, key, nkey));

  return nkey;
}

exports.getValidKey = getValidKey;

// Standardize ids + make sure keys are valid.
exports.standardizeKeys = function (entities) {
  return entities.map(function (e) {
    return deepMapKeys(e, function (key) {
      return key === 'ID' ? getValidKey({ key: 'id' }) : getValidKey({ key: key });
    });
  });
};

// Generate a unique id for each entity
exports.createGatsbyIds = function (createNodeId, idField, entities, reporter) {
  return entities.map(function (e) {
    e.id = createNodeId('' + nanoid());
    return e;
  });
};

// Add entity type to each entity
exports.createEntityType = function (entityType, entities) {
  return entities.map(function (e) {
    e.__type = entityType;
    return e;
  });
};