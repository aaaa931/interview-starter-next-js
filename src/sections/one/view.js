'use client';

import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { Stack, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';

import { fetcher, endpoints } from 'src/utils/axios';

import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export default function OneView() {
  const settings = useSettingsContext();

  const [figures, setFigures] = useState({});
  const [inputDate, setInputDate] = useState({
    start: '2021-07-01',
    end: '2023-12-31',
  });

  useEffect(() => {
    const fetchFigures = async () => {
      const _figures = await fetcher(endpoints.figures);
      setFigures(_figures);
    };
    fetchFigures();
  }, []);

  const totalFinancial = useMemo(() => {
    if (!inputDate.start && !inputDate.end) return '';
    if (!figures.data) return '';

    return figures.data
      .filter(({ attributes }) => {
        const startDates = inputDate.start.split('-');
        const endDates = inputDate.end.split('-');

        if (
          attributes.yearPeriod >= Number(startDates[0]) &&
          attributes.monthPeriod >= Number(startDates[1]) &&
          attributes.yearPeriod <= Number(endDates[0]) &&
          attributes.monthPeriod <= Number(endDates[1])
        ) {
          return true;
        }

        return false;
      })
      .reduce((accumulator, currentData) => accumulator + currentData.attributes.totalAmount, 0);
  }, [figures.data, inputDate]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Page One </Typography>

      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      >
        <Stack direction="row" gap={4} sx={{ marginBottom: 4 }}>
          <Stack>
            start date
            <TextField
              type="date"
              value={inputDate.start}
              onChange={(e) => setInputDate({ ...inputDate, start: e.target.value })}
              inputProps={{ min: '2021-07-01', max: '2023-12-31' }}
            />
          </Stack>
          <Stack>
            end date
            <TextField
              type="date"
              value={inputDate.end}
              onChange={(e) => setInputDate({ ...inputDate, end: e.target.value })}
              inputProps={{ min: '2021-07-01', max: '2023-12-31' }}
            />
          </Stack>
        </Stack>
        <span>{`sums the totalAmount: ${totalFinancial}`}</span>
      </Box>
    </Container>
  );
}
