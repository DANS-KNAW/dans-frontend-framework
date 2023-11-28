import { FacetedSearch, RDTSearchUIProps } from '@rudeti/search-ui'
import { DateChartFacet, PieChartFacet } from '@rudeti/search-ui/build/facets/chart/view'
import { ListFacet } from '@rudeti/search-ui/build/facets/list/view'
import { MapFacet } from '@rudeti/search-ui/build/facets/map/view'
import { Result } from './result'
import { useNavigate } from 'react-router-dom'

import '@rudeti/search-ui/build/index.css'
import styles from './index.module.css'

import { spotColor } from '../../config/theme'

const config: Partial<RDTSearchUIProps> = {
	style: {
		background: '#F6F6F6',
		buttonBackground: '#FFF',
		spotColor,
	},
	fullTextFields: [{
			name: 'attributes.titles.title',
			label: "Title",
			boost: 2,
			fragments: 0,
		}, {
			name: 'attributes.descriptions.description',
			label: "Description",
			fragments: 0,
		}
	],
}

export function RdaSearch({ dashboard }: { dashboard?: RDTSearchUIProps['dashboard']}) {
	const navigate = useNavigate()
	return (
		<div className={styles.wrapper}>
			<FacetedSearch
				dashboard={dashboard}
				fullTextFields={config.fullTextFields}
				onClickResult={(result: any) => navigate(`/record/${encodeURIComponent(result.id)}`)}
				ResultBodyComponent={Result}
				url={`/api/search/dans-datacite/_search`}
				style={config.style}
			>
				<MapFacet
					config={{
						id: 'loc',
						field: "location",
					}}	
				/>
				<ListFacet
					config={{
						id: 'sub',
						field: "attributes.subjects.subject.keyword",
						title: "Subject"	
					}}
				/>
				<ListFacet
					config={{
						id: 'client',
						field: "relationships.client.data.id.keyword",
						title: "Client ID"	
					}}
				/>
				<PieChartFacet
					config={{
						id: 'client2',
						field: "relationships.client.data.id.keyword",
						title: "Client ID"	
					}}
				/>
				<ListFacet
					config={{
						id: 'creators',
						field: "attributes.creators.name.keyword",
						title: "Creators"	
					}}
				/>
				<ListFacet
					config={{
						id: 'lang',
						field: "attributes.subjects.lang.keyword",
						title: "Language"	
					}}
				/>
				<PieChartFacet
					config={{
						id: 'lang2',
						field: "attributes.subjects.lang.keyword",
						title: "Language"	
					}}
				/>
				<DateChartFacet
					config={{
						id: 'date',
						field: "attributes.dates.date",
						title: "Publication year",
						interval: "year"
					}}
				/>
			</FacetedSearch>
		</div>
	)
}
