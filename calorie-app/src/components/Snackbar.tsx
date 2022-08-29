import { Box, Sheet, Typography } from '@mui/joy'
import React from 'react'

const Snackbar = ({ message, setMessage }: { message: string, setMessage: (v: string) => void }) => {
    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 10,
                right: 10,
            }}>
            {message &&
                <Sheet variant="soft"
                    color="danger"
                    sx={{ p: 3 }}
                    onClick={() => setMessage("")}
                >
                    <Typography fontSize="lg"  >
                        {message}  (click to close)
                    </Typography>

                </Sheet>
            }
        </Box>)
}

export default Snackbar