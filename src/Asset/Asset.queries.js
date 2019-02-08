export const AssetQueries = Object.freeze({
  selectAssetsSQL: assets =>
    assets
      .map(({ tableName }) => `row_to_json(${tableName}.*) as ${tableName}`)
      .join(', '),

  joinAssetsSQL: assets =>
    assets
      .map(
        ({ tableName }) =>
          `LEFT JOIN ${tableName} as ${tableName} ON ${tableName}.id = bid.asset_id`
      )
      .join('\n')
})
