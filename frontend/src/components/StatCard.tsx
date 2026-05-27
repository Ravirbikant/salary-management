import { Card, CardContent, Typography } from '@mui/material'

interface Props {
    label: string
    value: string | number
}

function StatCard({ label, value }: Props) {
    return (
        <Card sx={{ minWidth: 160 }}>
            <CardContent>
                <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
                <Typography variant="h6">{value}</Typography>
            </CardContent>
        </Card>
    )
}

export default StatCard