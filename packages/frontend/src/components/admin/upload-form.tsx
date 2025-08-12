import React from "react";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { Formik, Form } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import type { UploadedResource } from "../../pages/admin.page";
import { FilterDropdown } from "../filter-dropdown";
import { subjects } from "../../constants/subjects";
import { formats } from "../../constants/formats";
import { sources } from "../../constants/sources";

interface UploadFormProps {
  addUpload: (upload: UploadedResource) => void;
}

interface FormValues {
  title: string;
  subject: string;
  format: string;
  source: string;
  file: File | null;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  subject: Yup.string().required("Subject is required"),
  format: Yup.string().required("Format is required"),
  source: Yup.string().required("Source is required"),
  file: Yup.mixed()
    .required("A file is required")
    .test(
      "fileFormat",
      "Only PDF files are allowed",
      (value) => value && value.type === "application/pdf"
    ),
});

const initialValues: FormValues = {
  title: "",
  subject: "",
  format: "",
  source: "",
  file: null,
};

export const UploadForm: React.FC<UploadFormProps> = ({ addUpload }) => {
  const handleSubmit = async (
    values: FormValues,
    { resetForm, setSubmitting }: FormikHelpers<FormValues>
  ) => {
    setSubmitting(true);

    try {
      // Simulate upload delay
      await new Promise((res) => setTimeout(res, 1000));

      if (!values.file) {
        alert("Please select a file.");
        setSubmitting(false);
        return;
      }

      const newUpload: UploadedResource = {
        title: values.title,
        subject: values.subject,
        format: values.format,
        source: values.source,
        fileName: values.file.name,
        uploadDate: new Date().toISOString().split("T")[0],
      };

      addUpload(newUpload);

      resetForm();
      alert("File uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Error uploading file.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mb: 4 }}>
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            isSubmitting,
          }) => (
            <Form>
              {/* Row 1: Title + Choose File */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  variant="outlined"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                  required
                />

                <Button
                  variant="outlined"
                  component="label"
                  sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
                  color={errors.file && touched.file ? "error" : "primary"}
                >
                  {values.file ? values.file.name : "Choose File"}
                  <input
                    type="file"
                    hidden
                    accept="application/pdf"
                    onChange={(e) => {
                      if (
                        e.currentTarget.files &&
                        e.currentTarget.files.length > 0
                      ) {
                        setFieldValue("file", e.currentTarget.files[0]);
                      }
                    }}
                  />
                </Button>
              </Box>

              {touched.file && errors.file && (
                <Box sx={{ color: "error.main", mb: 2, fontSize: "0.75rem" }}>
                  {errors.file}
                </Box>
              )}

              {/* Row 2: Subject + Format + Source */}
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <FilterDropdown
                  label="Subject"
                  name="subject"
                  options={subjects}
                  value={values.subject || ""}
                  setFieldValue={setFieldValue}
                />
                <FilterDropdown
                  label="Format"
                  name="format"
                  options={formats}
                  value={values.format || ""}
                  setFieldValue={setFieldValue}
                />
                <FilterDropdown
                  label="Source"
                  name="source"
                  options={sources}
                  value={values.source || ""}
                  setFieldValue={setFieldValue}
                />
              </Box>

              {/* Row 3: Upload Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 1 }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Upload Resource"}
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};