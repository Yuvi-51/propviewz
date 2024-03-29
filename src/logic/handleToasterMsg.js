export const setSuccessToast = (title, description) => ({
  variant: "success",
  title,
  description,
});

export const setFailureToast = (
  title = "Something went wrong",
  description = "Please try after some time"
) => ({
  variant: "destructive",
  title,
  description,
});
