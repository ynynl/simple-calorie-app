import { Box, Button, Card, Sheet, TextField, Typography } from "@mui/joy";
import { Container } from "@mui/system";
import { useFormik, withFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/apis";
import moment from "moment";
import * as Yup from 'yup';
import { FoodEntry, User } from "../utils/interfaces";

const fromSchema = Yup.object().shape({
    food: Yup.string()
        .required('Required'),
    calorie: Yup.number()
        .min(0, 'Enter a value larger than zero')
        .max(20000, 'Too much!')
        .required('Required'),
    price: Yup.number(),
    date: Yup.string().required('Required'),
});


export default function Home() {
    const formik = useFormik<FoodEntry>({
        initialValues: {
            food: '',
            calorie: 0,
            price: 0,
            date: moment().format().slice(0, 19)
        },
        validationSchema: fromSchema,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
            postEntry(values);
        },
    });

    const [message, setMessage] = useState('')
    const [user, setUser] = useState<User>()

    const postEntry = async (values: FoodEntry) => {
        try {
            setMessage("Loading...")
            const res = await API.createEntry(values)
            setMessage("")
        } catch (error) {
            if (error instanceof (Error)) {
                setMessage(error.message)
            } else if (typeof error === "string") {
                setMessage(error)
            } else {
                setMessage("unknown error")
            }
        }
    }

    const getUser = async () => {
        try {
            setMessage("Loading...")
            const res = await API.getUser()
            setUser(res)
            setMessage("")
        } catch (error) {
            if (error instanceof (Error)) {
                setMessage(error.message)
            } else if (typeof error === "string") {
                setMessage(error)
            } else {
                setMessage("unknown error")
            }
        }
    }

    console.log(user);


    useEffect(() => {
        getUser()
    }, [])


    return (
        <>
            <main>
                <Container sx={{ py: 4 }} maxWidth='xs'>
                    <Card variant="outlined" sx={{ minWidth: '320px' }}>
                        <Typography level="h4"
                            sx={{ alignSelf: 'flex-start' }}>
                            Add a new food entry
                        </Typography>
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
                                    variant="soft" />
                                <TextField
                                    name="calorie"
                                    value={formik.values.calorie}
                                    onChange={formik.handleChange}
                                    label="Calorie"
                                    type="number"
                                    error={!!formik.errors.price}
                                    helperText={formik.errors.price}
                                    variant="soft" />
                                <TextField
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    name="price"
                                    label="Price"
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
                                    variant="soft" />
                                <Button type="submit" >Submit</Button>
                            </Box>
                        </form>
                    </Card>

                </Container>

            </main>
            <nav>
                <Link to="/admin">Admin</Link>
            </nav>
        </>
    );
}