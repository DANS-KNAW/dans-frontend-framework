import type { ResultBodyProps } from '@dans-framework/rdt-search-ui'

import React from 'react'

import styles from './index.module.css'
import { MetadataList } from '../record'

export function Rda2Result(props: ResultBodyProps) {
	const { result: item  } = props

	const title = item.highlight?.title?.[0] || item.title || '<i>empty</i>'

	return (
		<div className={styles.result}>
			<header className={styles.header}>
				<h3 dangerouslySetInnerHTML={{ __html: title }} />
				{
					item.dc_date &&
					<div>{new Date(item.dc_date).toDateString()}</div>
				}

			</header>
			{/* <div className="descriptions" dangerouslySetInnerHTML={{ __html: description }} /> */}
			<ReadMore item={item} />
			<MetadataList record={item} />
		</div>
	)
}

function ReadMore({ item }: { item: ResultBodyProps['result'] }) {
	const [active, setActive] = React.useState(false)

	const hasHighlight = item.highlight?.dc_description?.[0] != null

	// No description, return nothing
	if (item.dc_description == null) return null

	// Highlighted description, return it
	if (hasHighlight) {
		return (
			<div
				className={styles.description}
				dangerouslySetInnerHTML={{ __html: item.highlight?.dc_description?.[0] as string }}
			/>
		)
	}

	const [visibleText, hiddenText] = item.dc_description.split(/\. (.*)/)

	// There is only one sentence, return it
	if (hiddenText == null || hiddenText.trim().length === 0) {
		return <div className={styles.description}>{visibleText}</div>
	}

	return (
		<div className={styles.description}>
			{visibleText}.
			{	
				active &&
				` ${hiddenText}`
			}
			&nbsp;
			<button onClick={(ev) => {
				ev.stopPropagation()
				setActive(!active)
			}}>
				{ active ? 'Read less' : 'Read more' }
			</button>
		</div>
	)
}