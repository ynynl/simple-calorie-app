import React from 'react'
import { Box, Button, Card, Sheet, TextField, Typography } from "@mui/joy";
import moment from "moment";
import * as Yup from 'yup';
import { FoodEntry, User } from "../../utils/interfaces";
import { useFormik } from "formik";

const fromSchema = Yup.object().shape({
    food: Yup.string()
        .required('Required'),
    calorie: Yup.number()
        .min(0, 'Enter a value larger than zero')
        .required('Required'),
    price: Yup.number().min(0, 'Enter a value larger than zero'),
    date: Yup.string().required('Required'),
    user: Yup.string().required('Required'),
});

interface PropsType {
    createEntry: (values: Partial<FoodEntry> & { user: string; }) => void;
}

const Form = ({ createEntry }: PropsType) => {

    const formik = useFormik<Partial<FoodEntry> & { user: string }>({
        initialValues: {
            food: undefined,
            calorie: undefined,
            price: undefined,
            date: moment().format().slice(0, 19),
            user: ""
        },
        validationSchema: fromSchema,
        onSubmit: values => {
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
                        label="User Id"
                        name="user"
                        onChange={formik.handleChange}
                        value={formik.values.user}
                        placeholder="Type in here…"
                        error={!!formik.errors.user}
                        helperText={formik.errors.user}
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
                    <Button type="submit" >Create</Button>
                </Box>
            </form>
        </div>
    )
}

export default Form