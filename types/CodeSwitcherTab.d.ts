declare interface CodeSwitcherTabItem {
  /**
   * The label to display on the tab
   */
  label: string;
  /**
   * The name of the markdown partial to display when the tab is selected
   *
   * Example:
   *
   * aPartial => will search for _aPartial.md in the same folder
   * or lower as the parent markdown file
   */
  partial: string;
}
