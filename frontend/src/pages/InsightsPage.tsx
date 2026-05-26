import { Box, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import type { Employee } from '../types/employee'

const DUMMY_EMPLOYEES: Employee[] = [
    { id: 1, first_name: 'Ravi', last_name: 'Sharma', job_title: 'Engineer', country: 'India', salary: 50000, department: 'Engineering', email: 'ravi@test.com' },
    { id: 2, first_name: 'Anita', last_name: 'Patel', job_title: 'Engineer', country: 'India', salary: 70000, department: 'Engineering', email: 'anita@test.com' },
    { id: 3, first_name: 'John', last_name: 'Doe', job_title: 'Manager', country: 'USA', salary: 90000, department: 'Management', email: 'john@test.com' },
    { id: 4, first_name: 'Jane', last_name: 'Smith', job_title: 'Engineer', country: 'USA', salary: 80000, department: 'Engineering', email: 'jane@test.com' }
]

function InsightsPage() {
    const [country, setCountry] = useState('India')
    const [jobTitle, setJobTitle] = useState('Engineer')

    const countries = useMemo(
        () => Array.from(new Set(DUMMY_EMPLOYEES.map(e => e.country))),
        []
    )

    const jobTitlesForCountry = useMemo(
        () => Array.from(new Set(DUMMY_EMPLOYEES.filter(e => e.country === country).map(e => e.job_title))),
        [country]
    )

    const stats = useMemo(() => {
        const inCountry = DUMMY_EMPLOYEES.filter(e => e.country === country)
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
    }, [country, jobTitle])

    return (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h4">Salary Insights</Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl sx={{ minWidth: 160 }}>
                    <InputLabel>Country</InputLabel>
                    <Select
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
                </Box>
            )}
        </Box>
    )
}

export default InsightsPage