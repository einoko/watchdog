export const removeEmpty = (obj) => {
  Object.keys(obj).forEach(
    (k) => !obj[k] && obj[k] !== undefined && delete obj[k]
  );
  if (obj.jobType === "visual") {
    delete obj["text_type"];
    delete obj["text_words"];
  }
  return obj;
};
