import { Box, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import type { Employee } from '../types/employee'
import { employeeService } from '../services/api'

function InsightsPage() {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [country, setCountry] = useState('')
    const [jobTitle, setJobTitle] = useState('')

    useEffect(() => {
        employeeService.getAll().then(data => {
            setEmployees(data)
            if (data.length > 0) {
                const firstCountry = data[0].country
                setCountry(firstCountry)
                const firstTitle = data.find(e => e.country === firstCountry)?.job_title ?? ''
                setJobTitle(firstTitle)
            }
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
                </Box>
            )}
        </Box>
    )
}

export default InsightsPage