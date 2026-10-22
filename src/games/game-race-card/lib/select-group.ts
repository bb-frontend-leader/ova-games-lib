/**
 * Disables all radio inputs with the given groupName.
 * Sets the "disabled" property of all radio inputs to true.
 * @param {string} groupName - The name of the radio inputs to disable.
 */
export const disableGroup = (groupName: string) => {
  const inputs = document.querySelectorAll(
    `section:not([aria-hidden="true"]) input[type="radio"][name="${groupName}"][data-input="svg"]`
  );
  inputs.forEach((el) => ((el as HTMLInputElement).disabled = true));
};

/**
 * Enables all radio inputs with the given groupName and clears their state.
 * Sets the "disabled" property of all radio inputs to false and the "checked" property to false.
 * Removes the "data-state" attribute from all radio inputs.
 * @param {string} groupName - The name of the radio inputs to enable and clear.
 */
export const enableAndClearGroup = (groupName: string) => {
  const inputs = document.querySelectorAll(
    `section:not([aria-hidden="true"]) input[type="radio"][name="${groupName}"][data-input="svg"]`
  );
  inputs.forEach((el) => {
    const input = el as HTMLInputElement;
    input.disabled = false;
    input.checked = false;
    input.setAttribute('data-state', '');
  });
};

/**
 * Sets the "data-state" attribute of all radio inputs with the given groupName to the given value.
 * This is used to visually indicate the correct or incorrect state of the radio inputs.
 * @param {string} groupName - The name of the radio inputs to select.
 * @param {string} value - The value to set the "data-state" attribute to.
 */
export const setGroupStateAttr = (groupName: string, value: string) => {
  const inputs = document.querySelectorAll(
    `section:not([aria-hidden="true"]) input[type="radio"][name="${groupName}"][data-input="svg"]`
  );
  inputs.forEach((el) => el.setAttribute('data-state', value));
};
