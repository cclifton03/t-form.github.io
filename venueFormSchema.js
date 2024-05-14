import * as Yup from "yup";

const venueFormSchema = Yup.object().shape({
  name: Yup.string().required("Venue name is required").max(255),
  description: Yup.string().required("Venue description is required").max(4000),
  venueTypeId: Yup.number().required("Venue is required").positive().integer(),
  url: Yup.string().required("Venue url is required").max(255),
});

export default venueFormSchema;
