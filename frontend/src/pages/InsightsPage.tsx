import { Box, Card, CardContent, FormControl, InputLabel, MenuItem, Paper, TableRow, TableHead, Table, TableContainer, Typography, TableBody, TableCell, Select } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import type { Employee } from '../types/employee'
import { employeeService } from '../services/api'

function InsightsPage() {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [country, setCountry] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        employeeService.getAll().then(data => {
            setEmployees(data)
            if (data.length > 0) {
                const firstCountry = data[0].country
                setCountry(firstCountry)
                const firstTitle = data.find(e => e.country === firstCountry)?.job_title ?? ''
                setJobTitle(firstTitle)
            }
            setLoading(false)
        })
    }, [])

    const countries = useMemo(
        () => Array.from(new Set(employees.map(e => e.country))),
        [employees]
    )

    const jobTitlesForCountry = useMemo(
        () => Array.from(new Set(employees.filter(e => e.country === country).map(e => e.job_title))),
        [employees, country]
    )

    const stats = useMemo(() => {
        const inCountry = employees.filter(e => e.country === country)
        if (!inCountry.length) return null

        const salaries = inCountry.map(e => e.salary)
        const min = Math.min(...salaries)
        const max = Math.max(...salaries)
        const avg = Math.round(salaries.reduce((sum, s) => sum + s, 0) / salaries.length)

        const inCountryAndJob = inCountry.filter(e => e.job_title === jobTitle)
        const avgForJob =
            inCountryAndJob.length === 0
                ? null
                : Math.round(
                    inCountryAndJob.reduce((sum, e) => sum + e.salary, 0) / inCountryAndJob.length
                )

        return { min, max, avg, avgForJob }
    }, [employees, country, jobTitle])

    if (loading) return <Typography>Loading...</Typography>

    return (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h4">Salary Insights</Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl sx={{ minWidth: 160 }}>
                    <InputLabel id="country-label">Country</InputLabel>
                    <Select
                        id="country-select"
                        labelId="country-label"
                        label="Country"
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                    >
                        {countries.map(c => (
                            <MenuItem key={c} value={c}>
                                {c}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Job Title</InputLabel>
                    <Select
                        label="Job Title"
                        value={jobTitle}
                        onChange={e => setJobTitle(e.target.value)}
                    >
                        {jobTitlesForCountry.map(title => (
                            <MenuItem key={title} value={title}>
                                {title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {stats && (
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2">Min salary in {country}</Typography>
                            <Typography variant="h6">${stats.min.toLocaleString()}</Typography>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2">Max salary in {country}</Typography>
                            <Typography variant="h6">${stats.max.toLocaleString()}</Typography>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2">Avg salary in {country}</Typography>
                            <Typography variant="h6">${stats.avg.toLocaleString()}</Typography>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2">
                                Avg salary for {jobTitle} in {country}
                            </Typography>
                            <Typography variant="h6">
                                {stats.avgForJob == null
                                    ? 'No data'
                                    : `$${stats.avgForJob.toLocaleString()}`}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2">Total Employees in {country}</Typography>
                            <Typography variant="h6">Total Employees: {employees.filter(e => e.country === country).length}</Typography>
                        </CardContent>
                    </Card>

                    <Typography variant="h6" sx={{ mt: 2 }}>Department Breakdown</Typography>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Department</TableCell>
                                    <TableCell>Avg Salary</TableCell>
                                    <TableCell>Min Salary</TableCell>
                                    <TableCell>Max Salary</TableCell>
                                    <TableCell>Employees</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(
                                    employees
                                        .filter(e => e.country === country)
                                        .reduce((acc: any, e) => {
                                            if (!acc[e.department]) acc[e.department] = []
                                            acc[e.department].push(e.salary)
                                            return acc
                                        }, {})
                                ).map(([dept, salaries]: any) => (
                                    <TableRow key={dept}>
                                        <TableCell>{dept}</TableCell>
                                        <TableCell>${Math.round(salaries.reduce((a: number, b: number) => a + b, 0) / salaries.length).toLocaleString()}</TableCell>
                                        <TableCell>${Math.min(...salaries).toLocaleString()}</TableCell>
                                        <TableCell>${Math.max(...salaries).toLocaleString()}</TableCell>
                                        <TableCell>{salaries.length}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </Box>
    )
}

export default InsightsPage