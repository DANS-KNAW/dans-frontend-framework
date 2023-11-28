import { Chip, Container } from "@mui/material"
import React from "react"
import { useParams } from "react-router-dom"

import styles from '../search/index.module.css'
import { Result } from "../search/result"

interface RdaRecord {
    card_url: string
    dc_date: string
    dc_description: string
    dc_language: string
    dc_type: string
    individuals: string[]
    page_url: string
    pathways: string[]
    pid_lod: string
    pid_lod_type: string
    relation_types: string
    resource_rights_types: string
    resource_type: string
    spec_url: string
    title: string
    uri: string
    uuid: string
    uuid_rda: string
    uuid_resource: string
    workflows: string[]
    workinggroupstring: string
}

export function RdaRecord() {
    const { id } = useParams()
    const [record, setRecord] = React.useState<any>(null)

    React.useEffect(() => {
		if (id == null) return
        fetch(`/api/search/dans-datacite/_source/${encodeURIComponent(id)}`)
        .then(res => res.json())
        .then(setRecord)
    }, [id])

    if (record == null) return

    return (
        <Container>
            <div style={{ margin: '3rem 0' }}>
					<Result result={record} />
                <ShowJSON record={record} />
            </div>
        </Container>
    )
}

const style = {
    display: 'grid',
    gridTemplateColumns: '200px 1fr',
}

function Metadata({ name, value }: { name: string, value: string | string[] }) {
    if (value == null) return null

    const _value = Array.isArray(value)
        ? value.join(' / ')
        : value

    return (
        <li style={style}>
            <div style={{ color: 'gray' }}>{name}</div>
            <div>{_value}</div>
        </li>
    )
}

export function MetadataList({ record }: { record: RdaRecord | any }) {
    return (
        <ul style={{listStyle: 'none', margin: 0, padding: 0}}>
            <Metadata name="Language" value={record.dc_language} />
            <Metadata name="Individuals" value={record.individuals} />
            <Metadata name="Rights" value={record.resource_rights_types} />
            <Metadata name="Relations" value={record.relation_types} />
            <Metadata name="Workflows" value={record.workflows} />
            <Metadata name="Pathways" value={record.pathways} />
        </ul>
    )
}

function ShowJSON({ record }: { record: RdaRecord }) {
    const [active, setActive] = React.useState(false)

    return (
        <div className={styles.showjson}>
            <button onClick={() => setActive(!active)}>
                {active ? 'Hide' : 'Show'} JSON
            </button>
            {
                active &&
                <pre>{JSON.stringify(record, undefined, 3)}</pre>
            }
        </div>
    )
}