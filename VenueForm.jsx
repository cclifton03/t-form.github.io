import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import debug from "sabio-debug";
import toastr from "toastr";
import "../venues/venueform.css";
import venueFormSchema from "schemas/venueFormSchema";
import lookUpService from "services/lookUpService";
import { mapLookUpItem } from "helpers/utils";
import venuesService from "services/venuesService";
import FileUpload from "components/files/FileUpload";
import LocationForm from "components/locations/LocationForm";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";

toastr.options = {
  positionClass: "toast-top-right",
  hideDuration: 300,
  timeOut: 5000,
  closeButton: true,
};

const _logger = debug.extend("VenueForm");

function VenueForm() {
  const [venueData, setVenueData] = useState({
    name: "",
    description: "",
    venueTypeId: "disabled",
    fileId: 0,
    url: "",
  });

  const [lookUps, setLookUps] = useState({
    lookUpData: [],
    lookUpComponents: [],
  });

  const [location, setLocation] = useState(null);

  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    lookUpService
      .LookUp(["VenueTypes"])
      .then(onVenueTypeLookupSuccess)
      .catch(onVenueTypeLookupError);
  }, []);

  const onVenueTypeLookupSuccess = (response) => {
    let responseArray = response.item.venueTypes;

    setLookUps((prevState) => {
      let newState = { ...prevState };

      newState.lookUpData = responseArray;
      newState.lookUpComponents = responseArray.map(mapLookUpItem);

      return newState;
    });
  };

  const onVenueTypeLookupError = (error) => {
    _logger("onVenueTypeLookupError", error);
    toastr.error("Venue lookup error");
  };

  const handleFile = (response) => {
    const idOfFile = response.items[0].id;

    if (idOfFile !== null) {
      setVenueData((prevState) => {
        const newState = { ...prevState };
        newState.fileId = idOfFile;

        return newState;
      });
    } else {
      toastr.error("Error on file upload.");
    }
  };

  const onSubmitClicked = (values, { resetForm }) => {
    const { id } = location;
    let venueFormData;

    if (id !== 0) {
      venueFormData = {
        name: values.name,
        description: values.description,
        locationId: parseInt(id),
        venueTypeId: parseInt(values.venueTypeId),
        fileId: venueData.fileId,
        url: values.url,
      };

      venuesService
        .addVenue(venueFormData)
        .then((response) => {
          onVenueAddSuccess(response, resetForm);
        })
        .catch(onVenueAddError);
    } else {
      toastr.error("Must add location first.");
    }
  };

  const onVenueAddSuccess = (response, resetForm) => {
    _logger("onVenueAddSuccess success:::::", response);
    toastr.success("New venue added");

    resetForm();

    setVenueData({
      name: "",
      description: "",
      venueTypeId: "disabled",
      fileId: 0,
      url: "",
    });

    setLocation(null);
  };

  const onVenueAddError = (error) => {
    _logger("onVenueAddError error:::::", error);
    toastr.error(error);
  };

  const onCancelClicked = () => {
    toastr.error("Operation canceled");
    navigate("/");
  };

  const openLocationModal = () => {
    setShow(true);
  };

  const closeLocationModal = () => {
    setShow(false);
  };

  const returnId = (locationObj, locId) => {
    setLocation(() => {
      return { id: locId, ...locationObj };
    });
  };

  return (
    <div className="venue-form-container rounded-3 border border-1 border-white shadow mt-1 p-3 pb-md-5 pe-md-5 ps-md-5">
      <Formik
        initialValues={venueData}
        onSubmit={onSubmitClicked}
        validationSchema={venueFormSchema}
        enableReinitialize={false}
      >
        <div className="venue-form">
          <h2 className="text-center venue-form-heading">Add a Venue</h2>
          <Form>
            <div className="mb-3 venue-form-group">
              <label htmlFor="name" className="form-label">
                Name
              </label>

              <Field
                name="name"
                type="text"
                id="name"
                className="form-control"
                placeholder="Enter the name of the venue"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="hasError text-danger"
              />
            </div>
            <div className="mb-3 venue-form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                type="text"
                className="form-control description"
                placeholder="Describe the venue"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="hasError text-danger"
              />
            </div>
            <div className="py-2">
              {!location ? (
                <>
                  <button
                    type="button"
                    className={"btn btn-primary"}
                    onClick={openLocationModal}
                  >
                    Add Venue Location
                  </button>
                  <span>
                    <button
                      type="button"
                      className="ms-2 venue-form-cancel-btn btn btn-danger"
                      onClick={onCancelClicked}
                    >
                      Cancel
                    </button>
                  </span>
                </>
              ) : (
                <>
                  <label htmlFor="locationId">Location</label>
                  <div className="venues-location-display col-12 col-md-6 ">
                    <p onClick={openLocationModal} className="cursor-pointer">
                      {location.lineOne +
                        (location.lineTwo ? " " + location.lineTwo : "") +
                        ", " +
                        location.city}
                      <span>
                        <FontAwesomeIcon className="ms-2" icon={faMapPin} />
                      </span>
                    </p>
                  </div>
                </>
              )}
            </div>
            {location && (
              <div>
                <div className="mb-3 venue-form-group">
                  <label htmlFor="venueTypeId" className="form-label">
                    Venue Type
                  </label>
                  <Field
                    key={lookUps.lookUpComponents.key}
                    as="select"
                    name="venueTypeId"
                    id="venueTypeId"
                    className="form-control"
                  >
                    <option disabled value="disabled">
                      Select a Venue
                    </option>
                    {lookUps.lookUpComponents}
                  </Field>
                  <ErrorMessage
                    name="venueTypeId"
                    component="div"
                    className="hasError text-danger"
                  />
                </div>
                <div className="mb-3 venue-form-group venue-file-upload-container">
                  <label htmlFor="fileId" className="form-label">
                    Upload Image
                  </label>

                  <Field
                    as={FileUpload}
                    uploadComplete={handleFile}
                    type="fileId"
                    id="fileId"
                    name="fileId"
                    className="form-control w-100"
                  />

                  <ErrorMessage
                    name="fileId"
                    component="div"
                    className="hasError text-danger"
                  />
                </div>
                <div
                  className="mb-3 venue-form-group"
                  id="venue-url-form-group"
                >
                  <label htmlFor="url" className="form-label">
                    Venue Url
                  </label>
                  <Field
                    id="url"
                    name="url"
                    type="text"
                    className="form-control"
                    placeholder="Enter the Url of the venue"
                  />
                  <ErrorMessage
                    name="url"
                    component="div"
                    className="hasError text-danger"
                  />
                </div>
                <div className="venue-form-button-container">
                  <div className="venue-form-buttons">
                    <button
                      type="submit"
                      className="venue-form-submit-btn btn btn-success me-2"
                      disabled={venueData.fileId === 0 ? true : false}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="venue-form-cancel-btn btn btn-danger"
                      onClick={onCancelClicked}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Form>
        </div>
      </Formik>
      <Modal
        animation="fade"
        location={location && location}
        onHide={closeLocationModal}
        show={show}
      >
        <LocationForm
          returnId={returnId}
          location={!location ? null : location}
          closeLocationModal={closeLocationModal}
        ></LocationForm>
      </Modal>
    </div>
  );
}

export default React.memo(VenueForm);
