/** Gera um erro customizado
 *
 * @param { string } message
 * @param { string } status
 * @param { string[] } errors
 * @returns
 */
export function createError(status, errors = []) {
  return {
    status,
    errors,
    isCustom: true,
  };
}
