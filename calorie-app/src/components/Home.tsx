import { Box, Button, Card, Sheet, Container, Typography, TextField, Radio, RadioGroup } from "@mui/joy";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/apis";
import { FoodEntry, User } from "../utils/interfaces";
import FoodEntryForm from "./Form";
import Snackbar from "./Snackbar";

const dailyMaxCal = 2100
const dailyMaxSpend = 1000

export default function Home() {

    const [message, setMessage] = useState('')
    const [user, setUser] = useState<User>()
    const [displayDate, setDisplayDate] = useState(moment().format())
    const [showPrice, setShowPrice] = useState(false)

    // const displayDate = moment().add(-daybefore, "days")

    const foodEntries = user?.foodEntries
        .filter(foodEntry => moment(foodEntry.date).isSame(displayDate, "day"))
        .sort((a, b) => moment(a.date).diff(moment(b.date)) > 0 ? 1 : -1)

    const dailyTotalCal = foodEntries?.reduce((prev, curr) => prev + curr.calorie, 0) || 0
    const dailyTotalSpend = foodEntries?.reduce((prev, curr) => prev + curr.price || 0, 0) || 0

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

    const createEntry = async (values: Partial<FoodEntry>) => {
        try {
            setMessage("Loading...")
            const res = await API.createEntry(values)
            if (user) {
                setUser({ ...user, foodEntries: [...user.foodEntries, res] })
            }
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

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        if (showPrice) {
            if (dailyTotalSpend > dailyMaxSpend) {
                setMessage("Total spending has exceed the maximum")
            } else {
                setMessage("")
            }
        } else {
            if (dailyTotalCal > dailyMaxCal) {
                setMessage("Total calorie has exceed the maximum")
            } else {
                setMessage("")
            }
        }
    }, [dailyTotalCal, showPrice])


    const setPrev = () => {
        setDisplayDate(moment(displayDate).add(-1, "days").format())
    }


    const setNext = () => {
        if (moment(displayDate).isBefore(moment())) {
            setDisplayDate(moment(displayDate).add(1, "days").format())
        }
    }

    const filterDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayDate(moment(e.target.value).format())
    }

    const toggleShowValue = () => {
        setShowPrice(!showPrice)
    }




    return (
        <>
            <main>
                <Container sx={{ py: 4 }} maxWidth='xs'>
                    {foodEntries &&
                        <Card variant="outlined" sx={{
                            minWidth: '320px', my: 3,
                        }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button onClick={toggleShowValue}>
                                    {showPrice ? "Calorie" : "Spending"}
                                </Button>
                            </Box>


                            <Box sx={{
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                                <Button size="md" variant="plain" color="primary" onClick={setPrev}>
                                    &lt;
                                </Button>
                                <TextField
                                    onChange={filterDate}
                                    name="date"
                                    value={moment(displayDate).format('yyyy-MM-DD')}
                                    type="date"
                                    variant="plain"
                                    componentsProps={{ input: { componentsProps: { input: { max: moment().format().slice(0, 19) } } } }}
                                />
                                <Button size="md" variant="plain" color="primary" onClick={setNext}>
                                    &gt;
                                </Button>
                            </Box>

                            {showPrice ? <>
                                <Typography
                                    level="h2"
                                    fontWeight="lg"
                                    color={dailyTotalSpend < dailyMaxSpend ? "primary" : "danger"}
                                >
                                    ${dailyTotalSpend}
                                </Typography>
                                <Typography level="h2" fontWeight="sm"
                                >
                                    /${dailyMaxSpend}
                                </Typography></>
                                : <>
                                    <Typography
                                        level="h2"
                                        fontWeight="lg"
                                        color={dailyTotalCal < dailyMaxCal ? "primary" : "danger"}
                                    >
                                        {dailyTotalCal} cal
                                    </Typography>
                                    <Typography level="h2" fontWeight="sm"
                                    >
                                        /{dailyMaxCal} cal
                                    </Typography></>
                            }
                            {foodEntries.map((foodEntry) => <div key={foodEntry.id}>
                                <Box sx={{ display: 'flex' }}>
                                    <Box sx={{ flexGrow: 1, textAlign: 'left' }}>
                                        <Typography level="body3">{moment(foodEntry.date).format('h:mm a')}</Typography>
                                        <Typography fontSize="lg" fontWeight="lg">
                                            {foodEntry.food}
                                        </Typography>
                                    </Box>


                                    <Typography fontSize="lg" fontWeight="md" sx={{ alignSelf: 'flex-end' }}>
                                        {showPrice ? `$ ${foodEntry.price}` : `${foodEntry.calorie} cal`}

                                    </Typography>
                                </Box>
                            </div>)}

                        </Card>
                    }
                    <Card
                        variant="outlined"
                        sx={{
                            my: 3,
                            minWidth: '320px',
                        }}>
                        <Typography level="h4"
                            sx={{ alignSelf: 'flex-start' }}>
                            Add a new food entry
                        </Typography>

                        <FoodEntryForm createEntry={createEntry} />

                    </Card>

                </Container>

                <Snackbar message={message} setMessage={setMessage} />

            </main>
            <nav>
                <Link to="/admin">Admin</Link>
            </nav>
        </>
    );
}