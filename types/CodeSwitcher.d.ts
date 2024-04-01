declare interface ContentSwitcherItem {
  /**
   * The label to display on the tab
   */
  label: string;
  /**
   * The general path to the partial that is relative to the parent markdown.
   *
   * Example:
   *
   * "_getting-started/_aPartial" => `_getting-started/_aPartial.md`
   */
  partial: string;
}
