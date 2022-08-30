import React, { useCallback, useRef, useState } from 'react'
import { Box, Button, Container,} from '@mui/joy';
import API from '../../utils/apis';
import { FoodEntry } from '../../utils/interfaces';
import { Link } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import moment from 'moment';
import { ICellRendererParams, RowSelectedEvent, ValueFormatterParams, ValueParserParams } from 'ag-grid-community';
import DatePicker from './DatePicker';
import Snackbar from '../Snackbar';


const Admin = () => {
    const [message, setMessage] = useState('')
    const [entries, setEntries] = useState<FoodEntry[]>([])
    const [selectedRow, setSelectedRow] = useState<FoodEntry>()

    const lastWeekCount = entries.filter(entry => moment(entry.date)
        .isBetween(moment().add(-7, "days"), moment())).length

    const WeekBeforeCount = entries.filter(entry => moment(entry.date)
        .isBetween(moment().add(-14, "days"), moment().add(-7, "days"))).length

    const getEntries = async () => {
        try {
            setMessage("Loading...")
            const res = await API.getAllEntries()
            setEntries(res)
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

    const deleteEntry = async (id: string) => {
        try {
            setMessage("Loading...")
            const res = await API.deleteEntry(id)
            setEntries(entries.filter(e => e.id !== id))
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
        getEntries()
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
        {
            field: 'user',
            headerName: 'User',
            width: 230,
            cellRenderer: (props: ICellRendererParams) => <Link to={`users/${props.value}`}>{props.value}</Link>
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

                    <p>Entries last week: {lastWeekCount}</p>
                    <p>Entries the week before last week: {WeekBeforeCount}</p>

                    <Box display="flex">
                        <Button
                            color="danger"
                            sx={{ m: 1 }}
                            onClick={handleDeleteButton}
                        >
                            Delete
                        </Button>
                    </Box>

                    <div className="ag-theme-alpine" style={{ width: "100%", height: 600 }}>
                        <AgGridReact
                            rowData={entries}
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
                <Link to="/">Home</Link>
            </nav>
        </>
    )
}

export default Admin
