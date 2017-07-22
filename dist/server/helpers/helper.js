"use strict";

var paginationMetaData = function paginationMetaData(count, limit, offset) {
  return {
    totalCount: count,
    pageCount: Math.ceil(count / limit),
    page: Math.floor(offset / limit) + 1,
    pageSize: limit
  };
};

module.exports.paginationMetaData = paginationMetaData;