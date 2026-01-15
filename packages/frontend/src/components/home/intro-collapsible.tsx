import { FC, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Divider,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export type GettingStartedCollapseProps = {
  defaultOpen?: boolean;
};

export const GettingStartedCollapse: FC<GettingStartedCollapseProps> = ({
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      {/* Toggle button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          variant="contained"
          onClick={() => setOpen((v) => !v)}
          endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          {open
            ? 'Hide getting started resources'
            : 'Show getting started resources'}
        </Button>
      </Box>

      {/* Collapsible content */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Getting started resources
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Below you will find a couple resources to start with, depending on what
            you are hoping to find.
          </Typography>

          <Stack spacing={2}>
            {/* Caregivers */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                For caregivers
              </Typography>
              <Stack spacing={0.5}>
                <Link
                  href="https://drive.google.com/file/d/1K6CV_sVXZGiuvrnYWJCabShKTZqv3Yor/view"
                  target="_blank"
                >
                  Guideposts for Success 2.0
                </Link>
                <Link
                  href="https://drive.google.com/file/d/1h6qf5N2-bJ_-TNlrOKsZ2g-5e5-zeM9E/view"
                  target="_blank"
                >
                  2023 Coalition for Career Development Center – Condition of Career Readiness report
                </Link>
              </Stack>
            </Box>

            {/* Counselors */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                For counselors
              </Typography>
              <Stack spacing={0.5}>
                <Link
                  href="https://drive.google.com/file/d/1Dnwt869U774H0GbNKO14ip0xJqrSXuXM/view"
                  target="_blank"
                >
                  CASEL Guide to Schoolwide SEL – establishing school-family partnerships
                </Link>
                <Link
                  href="https://drive.google.com/file/d/1bf6hwxp1xBf2g6gZN3XNbp8YusLYWLy8/view"
                  target="_blank"
                >
                  CASEL Guide to Schoolwide SEL – 5 minute chats
                </Link>
              </Stack>
            </Box>

            {/* Teachers */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                For teachers
              </Typography>
              <Stack spacing={0.5}>
                <Link
                  href="https://drive.google.com/file/d/1Bi3fWRSWarqLrK4AuSiNiJWHttAoN-ye/view"
                  target="_blank"
                >
                  Youth – I’m Determined: Goal Plan Implementation and Template
                </Link>
                <Link
                  href="https://drive.google.com/file/d/1HwGXr4Z6noFy6rMAmvFUEvugohpmdrSx/view"
                  target="_blank"
                >
                  I’m Determined – supporting resource
                </Link>
                <Link
                  href="https://drive.google.com/file/d/1oytqSevdY0eVDZH-UWb8LatCYy-Umb7X/view"
                  target="_blank"
                >
                  ILP How To Guide 2.0
                </Link>

                <Typography variant="body2" color="text.secondary">
                  Also recommended: your state’s Work-Based Learning, CTE, or Perkins V documents.
                </Typography>
              </Stack>
            </Box>

            {/* Researchers */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                For researchers
              </Typography>
              <Stack spacing={0.5}>
                <Link
                  href="https://drive.google.com/file/d/18_ZH51FAKQFThFRtbr0BpeDpZ-BWAP3f/view"
                  target="_blank"
                >
                  Guide for Designing State-Wide Career Development Strategies and Programs
                </Link>
                <Link
                  href="https://drive.google.com/file/d/1xXyhqBcj-Ldx1PjIg5hOUIJeNnjzYJdV/view"
                  target="_blank"
                >
                  ILO/OECD resources: international quality career guidance
                </Link>
              </Stack>
            </Box>

            <Divider />

            <Typography variant="body2" color="text.secondary">
              Please email <Link href="mailto:bucfr@bu.edu">bucfr@bu.edu</Link> with any questions.
            </Typography>
          </Stack>
        </Box>
      </Collapse>
    </>
  );
};