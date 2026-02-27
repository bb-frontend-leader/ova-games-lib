/**
 * Disable all radio inputs in the given group.
 * @param {string} groupName - The name of the group to disable.
 */
export const disableGroup = (groupName: string) => {
  const inputs = document.querySelectorAll(
    `section:not([aria-hidden="true"]) input[type="radio"][name="${groupName}"][data-input="svg"]`
  );
  inputs.forEach((el) => ((el as HTMLInputElement).disabled = true));
};

/**
 * Enables all radio inputs in the given group and sets their state to the initial one.
 * @param {string} groupName - The name of the group to enable and clear.
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
 * Sets the data-state attribute for all radio inputs in the given group.
 * This is used to update the visual state of the radio buttons after validation.
 * @param {string} groupName - The name of the group to update.
 * @param {string} value - The value to set for the data-state attribute.
 */
export const setGroupStateAttr = (groupName: string, value: string) => {
  const inputs = document.querySelectorAll(
    `section:not([aria-hidden="true"]) input[type="radio"][name="${groupName}"][data-input="svg"]`
  );
  inputs.forEach((el) => el.setAttribute('data-state', value));
};
