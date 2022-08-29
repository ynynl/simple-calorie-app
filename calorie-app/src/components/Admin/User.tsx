import React, { useEffect, useState } from 'react'
import { Box, Container } from '@mui/joy';
import API from '../../utils/apis';
import { FoodEntry } from '../../utils/interfaces';
import { Link } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import moment from 'moment';


// const Admin = () => {
//     const [message, setMessage] = useState('')
//     const [entries, setEntries] = useState<FoodEntry[]>([])

//     const getEntries = async () => {
//         try {
//             setMessage("Loading...")
//             const res = await API.getAllEntries()
//             setEntries(res)
//             setMessage("")
//         } catch (error) {
//             if (error instanceof (Error)) {
//                 setMessage(error.message)
//             } else if (typeof error === "string") {
//                 setMessage(error)
//             } else {
//                 setMessage("unknown error")
//             }
//         }
//     }

//     useEffect(() => {
//         getEntries()
//     }, [])


//     const columns = [
//         { key: 'id', name: 'ID', width: 230 },
//         {
//             key: 'food',
//             name: 'Food',
//             width: 200,
//             editable: true,
//         },
//         {
//             key: 'calorie',
//             name: 'Calorie',
//             width: 110,
//             type: 'number',
//             editable: true,
//         },
//         {
//             key: 'price',
//             name: 'Price',
//             type: 'number',
//             width: 110,
//             editable: true,
//         },
//         {
//             key: 'date',
//             name: 'Datetime',
//             description: 'This column has a value getter and is not sortable.',
//             width: 230,
//             // formatter(props) {
//             //     return moment(props.row.date).format()
//             // }
//         },
//         {
//             key: 'user',
//             name: 'User',
//             description: 'This column has a value getter and is not sortable.',
//             width: 230,
//             // formatter(props) {
//             //     return <Link to={'/'}>
//             //         {props.row.user}
//             //     </Link>
//             // }
//         },
//     ];


//     return (
//         <>
//             <main>
//                 <Container maxWidth="xl">
//                     <h2>Admin</h2>
//                     <Box sx={{ height: 600, width: '100%' }}>
//                         <AgGridReact
//                             rowData={entries}
//                             columnDefs={columns}
//                         />
//                     </Box>
//                 </Container>
//             </main>
//             <nav>
//                 <Link to="/Admin">Admin</Link>
//             </nav>
//         </>
//     )
// }

// export default Admin