import styles from './about.module.css'

export function Home() {
	return (
		<div className={styles.about}>
			<h2>DANS/ 4TU Search and Discovery</h2>
			<div className={styles.logos}>
				<img src="4TU/image/logo_4TU.png" />
				<img src="4TU/image/logo_dans.png" />
			</div>
			<p style={{ margin: '4rem 0' }}>
				Search across 4TU and DANS repositories in your field of interest.
			</p>
		</div>
	)
}