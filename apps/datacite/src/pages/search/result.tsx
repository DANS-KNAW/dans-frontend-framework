import { Label } from '@rudeti/search-ui'

import styles from './result.module.css'

export function Result(props: any) {
	const { result: item } = props

	const titles = item.highlight?.['attributes.titles.title'] || item.attributes.titles.map((t: any) => t.title) || '<i>empty</i>'
	const descriptions = item.highlight?.['attributes.descriptions.description'] || item.attributes.descriptions.map((t: any) => t.description) || '<i>empty</i>'

	return (
		<div className={styles.wrapper}>
			<ul className={styles.titles}>
				{
					titles.map((__html: any, i: number) => (
						<li
							key={i}
							title={__html}
							dangerouslySetInnerHTML={{ __html }}
						/>
					))
				}
			</ul>
			<ul className={styles.descriptions}>
				{
					descriptions.map((__html: any, i: number) => (
						<li
							key={i}
							title={__html}
							dangerouslySetInnerHTML={{ __html }}
						/>
					))
				}
			</ul>
			<ul className={styles.subjects}>
				{
					item.attributes.subjects.map((subject: any, i: number) => (
						<li key={i} title="subject">
							<Label>{subject.subject}</Label>
						</li>
					))
				}
			</ul>
		</div>
	)
}
