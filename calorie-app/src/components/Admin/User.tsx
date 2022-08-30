import React, { useCallback, useRef, useState } from 'react'
import { Box, Button, Container, } from '@mui/joy';
import API from '../../utils/apis';
import { FoodEntry, User } from '../../utils/interfaces';
import { Link } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import moment from 'moment';
import { RowSelectedEvent, ValueFormatterParams, ValueParserParams } from 'ag-grid-community';
import DatePicker from './DatePicker';
import Snackbar from '../Snackbar';
import { useParams } from 'react-router-dom'
import Form from '../Form';

const UserAdmin = () => {
    const [message, setMessage] = useState('')
    const [entries, setEntries] = useState<FoodEntry[]>([])
    const [user, setUser] = useState<User>()
    const [selectedRow, setSelectedRow] = useState<FoodEntry>()
    const [createNew, setCreateNew] = useState(false)
    const { id } = useParams()

    const lastWeekCount = user?.foodEntries
        .filter(entry => moment(entry.date)
            .isBetween(moment().add(-7, "days"), moment()))
        .reduce((prev, curr) => prev + curr.calorie, 0) || 0

    const getUsers = async () => {
        if (id) {
            try {
                setMessage("Loading...")
                const res = await API.getUserAdmin(id)
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
    }

    const deleteEntry = async (id: string) => {
        try {
            setMessage("Loading...")
            const res = await API.deleteEntry(id)
            if (user) {
                setUser({ ...user, foodEntries: user?.foodEntries.filter(e => e.id !== id) })
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

    const handleDeleteButton = () => {
        if (selectedRow?.id) {
            deleteEntry(selectedRow.id)
        }
    }

    const createEntry = async (values: Partial<FoodEntry>) => {
        if (id) {
            try {
                setMessage("Loading...")
                const res = await API.createEntryAdmin({ ...values, user: id })
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
    }
    const updateEntry = async (values: Partial<FoodEntry>) => {
        try {
            setMessage("Loading...")
            const res = await API.createEntry(values)
            // if (entries) {
            //     setEntries(entries.map(entry => entry.id === res.id ? res : entry))
            // }
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

    const gridRef = useRef<AgGridReact<FoodEntry>>(null);

    const onGridReady = useCallback(() => {
        getUsers()
    }, []);

    const onSelectionChanged = useCallback(() => {
        if (gridRef?.current?.api) {
            const selected = gridRef.current.api.getSelectedRows()[0];
            setSelectedRow(selected)
        }
    }, []);

    const columns = [
        {
            field: 'food',
            headerName: 'Food',
            width: 200,
            editable: true,
        },
        {
            field: 'calorie',
            headerName: 'Calorie',
            width: 110,
            editable: true,
            valueParser: (params: ValueParserParams) => Number(params.newValue)
        },
        {
            field: 'price',
            headerName: 'Price',
            width: 110,
            editable: true,
            valueParser: (params: ValueParserParams) => Number(params.newValue)
        },
        {
            field: 'date',
            headerName: 'Datetime',
            width: 230,
            filter: 'agDateColumnFilter',
            editable: true,
            cellEditor: DatePicker,
            cellEditorPopup: true,
            sortable: true,
            filterParams: {
                // provide comparator function
                comparator: (filterLocalDate: Date, cellValue: string) => {
                    if (cellValue == null) {
                        return 0;
                    }
                    // Now that both parameters are Date objects, we can compare
                    if (moment(cellValue).isSame(moment(filterLocalDate), "days")) {
                        return 0;
                    } else if (moment(cellValue).isBefore(moment(filterLocalDate), "days")) {
                        return -1;
                    } else if (moment(cellValue).isAfter(moment(filterLocalDate), "days")) {
                        return 1;
                    }
                }
            },
            valueFormatter: (params: ValueFormatterParams<FoodEntry, number>) => {
                // params.value : number
                return moment(params.value).format();
            }
        },
    ];

    const onRowValueChanged = useCallback((event: RowSelectedEvent<FoodEntry>) => {
        if (event.data) {
            var data = event.data;
            updateEntry(data)
        }
    }, []);

    return (
        <>
            <main>
                <Container maxWidth="xl">
                    <h2>Admin</h2>
                    <h3>{user?.username}</h3>

                    <p> The average number of calories added per user for the last 7 days is {lastWeekCount / 7}
                    </p>

                    <Box display="flex">
                        <Button
                            sx={{ m: 1 }}
                            onClick={() => setCreateNew(!createNew)}
                        >
                            Create</Button>
                        <Button
                            color="danger"
                            sx={{ m: 1 }}
                            onClick={handleDeleteButton}
                        >
                            Delete
                        </Button>
                    </Box>

                    {createNew &&
                        <div>
                            <Form createEntry={createEntry}></Form>
                        </div>
                    }


                    <div className="ag-theme-alpine" style={{ width: "100%", height: 600 }}>
                        <AgGridReact
                            rowData={user?.foodEntries || []}
                            columnDefs={columns}
                            ref={gridRef}
                            rowSelection={'single'}
                            onGridReady={onGridReady}
                            onSelectionChanged={onSelectionChanged}
                            editType={'fullRow'}
                            onRowValueChanged={onRowValueChanged}
                        ></AgGridReact>
                    </div>
                </Container>

                <Snackbar message={message} setMessage={setMessage} />

            </main>
            <nav>
                <Link to="/admin">Admin</Link>
            </nav>
        </>
    )
}

export default UserAdmin
