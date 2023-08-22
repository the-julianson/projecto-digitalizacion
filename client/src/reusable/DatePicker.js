import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

import { useMediaQuery } from '@mui/material';

export default function DatePicker(props) {

    const isMediumDevice = useMediaQuery('(max-width:900px');

    const datePickerCommonProperties = {
        // disableFuture:true,
        label: props.label,
        inputFormat: "dd/MM/yyyy",
        readOnly: !props.editable,
        id: props.id,
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
                {isMediumDevice ?
                    <MobileDatePicker
                        {...datePickerCommonProperties}
                        value={props.value}
                        onChange={value => props.onChange(props.id, value)}
                        renderInput={(params) =>
                            <TextField {...params}
                                error={props.errorProp}
                                helperText={props.helperTextProp} />}
                    />
                    :
                    <DesktopDatePicker
                        {...datePickerCommonProperties}
                        value={props.value}
                        onChange={value => props.onChange(props.id, value)}
                        renderInput={(params) =>
                            <TextField {...params}
                                error={props.errorProp}
                                helperText={props.helperTextProp} />}
                    />
                }
            </Stack>
        </LocalizationProvider>
    );
}


            // <DatePicker
            //     value={formik.values.fechaNacimiento || ""}
            //     id="fechaNacimiento"
            //     name="fechaNacimiento"
            //     editable={true}
            //     onChange={formik.setFieldValue}
            //     errorProp={
            //         formik.touched.fechaNacimiento &&
            //         Boolean(formik.errors.fechaNacimiento)
            //     }
            //     helperTextProp={
            //         formik.touched.fechaNacimiento &&
            //         formik.errors.fechaNacimiento
            //     }
            // />
