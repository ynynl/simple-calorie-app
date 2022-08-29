import React, { useEffect, useState } from 'react'
import { Box, Container } from '@mui/joy';
import API from '../../utils/apis';
import { FoodEntry } from '../../utils/interfaces';
import { Link } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import moment from 'moment';
import { ValueFormatterParams } from 'ag-grid-community';

const Admin = () => {
    const [message, setMessage] = useState('')
    const [entries, setEntries] = useState<FoodEntry[]>([])

    

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

    useEffect(() => {
        getEntries()
    }, [])


    const columns = [
        // {
        //     field: 'id',
        //     headerName: 'ID',
        //     width: 230
        // },
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
            // type: 'number',
            editable: true,
        },
        {
            field: 'price',
            headerName: 'Price',
            // type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'date',
            headerName: 'Datetime',
            width: 230,
            filter: 'agDateColumnFilter',
            filterParams: {
                // provide comparator function
                comparator: (filterLocalDate: Date, cellValue: string) => {
                    if (cellValue == null) {
                        return 0;
                    }
                    // Now that both parameters are Date objects, we can compare
                    if (moment(cellValue).isSame(moment(filterLocalDate), "days")) {
                        return 0;
                    }else if (moment(cellValue).isBefore(moment(filterLocalDate), "days")) {
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
            // @ts-ignore
            // formatter(props) {
            //     return moment(props.row.date).format()
            // }
        },
        {
            field: 'user',
            headerName: 'User',
            width: 230,
            // @ts-ignore
            // formatter(props) {
            //     return <Link to={'/'}>
            //         {props.row.user}
            //     </Link>
            // }
        },
    ];


    return (
        <>
            <main>
                <Container maxWidth="xl">
                    <h2>Admin</h2>
                    <div className="ag-theme-alpine" style={{ width: "100%", height: 600 }}>

                        <AgGridReact
                            rowData={entries}
                            columnDefs={columns}
                        />
                    </div>
                </Container>
            </main>
            <nav>
                <Link to="/">Home</Link>
            </nav>
        </>
    )
}

export default Admin