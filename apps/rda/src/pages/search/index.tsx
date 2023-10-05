import { FacetedSearch, RDTSearchUIProps } from '@dans-framework/rdt-search-ui'
import { DateChartFacet, PieChartFacet } from '@dans-framework/rdt-search-ui/build/facets/chart/view'
import { ListFacet } from '@dans-framework/rdt-search-ui/build/facets/list/view'
import '@dans-framework/rdt-search-ui/build/index.css'
import { Rda2Result } from './result'
import { useNavigate } from 'react-router-dom'

import styles from './index.module.css'

const config: Partial<RDTSearchUIProps> = {
	style: {
		background: '#F6F6F6',
		buttonBackground: '#ececec'
	},
	fullTextFields: ['title^2', 'dc_description'],
	fullTextHighlight: {
		fields: {
			'title': { number_of_fragments: 0 },
			'dc_description': { number_of_fragments: 0 },
		},
	},
}

export function RdaSearch({ dashboard }: { dashboard?: RDTSearchUIProps['dashboard']}) {
	const navigate = useNavigate()
	return (
		<div className={styles.wrapper}>
			<FacetedSearch
				dashboard={dashboard}
				fullTextFields={config.fullTextFields}
				fullTextHighlight={config.fullTextHighlight}
				onClickResult={(result) => navigate(`/record/${result.id}`)}
				ResultBodyComponent={Rda2Result}
				url="/api/search/dans-rda2/_search"
				style={config.style}
			>
				<DateChartFacet
					config={{
						id: 'date',
						field: "dc_date",
						title: "Year",
						interval: "year"
					}}
				/>
				<ListFacet
					config={{
						id: 'wf',
						field: "workflows.keyword",
						title: "Workflows"
					}}
				/>
				<ListFacet
					config={{
						id: 'pw',
						field: "pathways.keyword",
						title: "Pathways"
					}}
				/>
				<ListFacet
					config={{
						id: 'indi',
						field: "individuals.keyword",
						title: "Individuals",
						size: 10
					}}
				/>
				<PieChartFacet
					config={{
						id: "rights",
						field: "resource_rights_types.keyword",
						title: "Rights",
					}}
				/>
				<PieChartFacet
					config={{
						id: "lang",
						field: "dc_language.keyword",
						title: "Language",
					}}
				/>
				<ListFacet
					config={{
						id: 'restype',
						field: "resource_type.keyword",
						title: "Resource type",
					}}
				/>
				<ListFacet
					config={{
						id: 'reltype',
						field: "relation_types.keyword",
						title: "Relation types",
					}}
				/>
			</FacetedSearch>
		</div>
	)
}
