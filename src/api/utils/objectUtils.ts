export const removeObjectPropertyByKey = (
  object: Record<string, unknown>,
  key: string,
): Record<string, unknown> => {
  if (!object[key]) {
    return object
  }

  delete object[key]

  return {...object}
}
