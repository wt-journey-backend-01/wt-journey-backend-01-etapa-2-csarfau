export function formatZodErrors(err) {
  const errors = {};
  err.errors.forEach((e) => {
    errors[e.path[0]] = e.message;
  });
  return errors;
}
