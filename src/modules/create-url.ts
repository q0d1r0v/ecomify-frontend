export const CreateUrl = (name: string) => {
  const UrlName = import.meta.env.VITE_APP_FILE_URL + name;
  console.log(UrlName);
  return UrlName;
};
