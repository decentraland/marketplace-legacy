/// <reference types="chai" />

declare namespace Chai {
  interface Assertion
    extends LanguageChains,
      NumericComparison,
      TypeComparison {
    equalRow(row: any)
    equalRows(rows: any[])
  }
}
