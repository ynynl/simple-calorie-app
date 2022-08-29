import React from 'react'
import { Box, Button, Card, Sheet, TextField, Typography } from "@mui/joy";
import moment from "moment";
import * as Yup from 'yup';
import { FoodEntry, User } from "../utils/interfaces";
import { useFormik, withFormik } from "formik";

const fromSchema = Yup.object().shape({
    food: Yup.string()
        .required('Required'),
    calorie: Yup.number()
        .min(0, 'Enter a value larger than zero')
        .required('Required'),
    price: Yup.number().min(0, 'Enter a value larger than zero'),
    date: Yup.string().required('Required'),
});

interface PropsType {
    createEntry: (values: Partial<FoodEntry>) => void;
}

const Form = ({ createEntry }: PropsType) => {

    const formik = useFormik<Partial<FoodEntry>>({
        initialValues: {
            food: undefined,
            calorie: undefined,
            price: undefined,
            date: moment().format().slice(0, 19)
        },
        validationSchema: fromSchema,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
            createEntry(values);
        },
    });

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <Box
                    sx={{
                        py: 2,
                        display: 'grid',
                        gap: 2,
                        alignItems: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    <TextField
                        label="Food Name"
                        name="food"
                        onChange={formik.handleChange}
                        value={formik.values.food}
                        placeholder="Type in here…"
                        error={!!formik.errors.food}
                        helperText={formik.errors.food}
                        variant="soft"
                        autoFocus />
                    <TextField
                        name="calorie"
                        value={formik.values.calorie}
                        onChange={formik.handleChange}
                        label="Calorie"
                        type="number"
                        error={!!formik.errors.calorie}
                        helperText={formik.errors.calorie}
                        variant="soft"
                    />
                    <TextField
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        name="price"
                        label="Price ($)"
                        type="number"
                        error={!!formik.errors.price}
                        helperText={formik.errors.price}
                        variant="soft" />
                    <TextField
                        onChange={formik.handleChange}
                        label="Datetime"
                        name="date"
                        value={formik.values.date}
                        type="datetime-local"
                        error={!!formik.errors.date}
                        helperText={formik.errors.date}
                        variant="soft"
                        componentsProps={{ input: { componentsProps: { input: { max: moment().format().slice(0, 19) } } } }}
                    />
                    <Button type="submit" >Submit</Button>
                </Box>
            </form>
        </div>
    )
}

export default Form