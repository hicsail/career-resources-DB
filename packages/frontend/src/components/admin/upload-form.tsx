import React from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { FilterDropdown } from "../filter-dropdown";
import { subjects } from "../../constants/subjects";
import { formats } from "../../constants/formats";
import { sources } from "../../constants/sources";
import { useApiServices } from "../../services/api";
import { useSnackbar } from "../../contexts/snackbar.context.tsx";

interface UploadFormProps {
  addUpload: (upload: any) => void;
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
  file: Yup.mixed<File>()
    .required("A file is required")
    .test(
      "fileFormat",
      "Only PDF files are allowed",
      (value) => value instanceof File && value.type === "application/pdf"
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
  const { push } = useSnackbar();
  const { uploadFile } = useApiServices();

  const handleSubmit = async (
    values: FormValues,
    { resetForm, setSubmitting }: any
  ) => {    
    if (!values.file) {
      push({ message: "Please select a file", type: "error" });
      return;
    }
    setSubmitting(true);

    try {
      await uploadFile(values.file, {
        title: values.title,
        subject: values.subject,
        format: values.format,
        source: values.source,
      });

      addUpload({
        title: values.title,
        subject: values.subject,
        format: values.format,
        source: values.source,
        fileName: values.file.name,
        uploadAt: new Date().toISOString().split("T")[0],
      });

      resetForm();
      push({ message: "File uploaded successfully!", type: "success" });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const backendMsg = err.response?.data?.message;
        push({ message: backendMsg, type: "error" });
      } else {
        push({ message: "Unexpected error occurred", type: "error" });
      }
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
          {(formik: FormikProps<FormValues>) => (
            <Form>
              {/* Row 1: Title + Choose File */}
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  variant="outlined"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  required
                />

                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    whiteSpace: "nowrap",
                    width: 140,
                    flexShrink: 0,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    display: "block",
                  }}
                  color={formik.errors.file && formik.touched.file ? "error" : "primary"}
                >
                  {formik.values.file ? formik.values.file.name : "Choose File"}
                  <input
                    type="file"
                    hidden
                    accept="application/pdf"
                    onChange={(e) => {
                      if (e.currentTarget.files && e.currentTarget.files.length > 0) {
                        formik.setFieldValue("file", e.currentTarget.files[0]);
                      }
                    }}
                  />
                </Button>
              </Box>

              {formik.touched.file && formik.errors.file && (
                <Box sx={{ color: "error.main", mb: 2, fontSize: "0.75rem" }}>
                  {formik.errors.file}
                </Box>
              )}

              {/* Row 2: Subject + Format + Source */}
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <FilterDropdown label="Subject" name="subject" options={subjects} formik={formik} />
                <FilterDropdown label="Format" name="format" options={formats} formik={formik} />
                <FilterDropdown label="Source" name="source" options={sources} formik={formik} />
              </Box>

              {/* Row 3: Upload Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={formik.isSubmitting}
                sx={{ mt: 1 }}
              >
                {formik.isSubmitting ? <CircularProgress size={24} /> : "Upload Resource"}
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};