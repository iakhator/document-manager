const paginationMetaData = (count, limit, offset) => ({
  totalCount: count,
  pageCount: Math.ceil(count / limit),
  page: Math.floor(offset / limit) + 1,
  pageSize: limit
});

module.exports.paginationMetaData = paginationMetaData;
