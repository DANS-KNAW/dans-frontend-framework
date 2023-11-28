import styles from './about.module.css'

export function About() {
	return (
		<div className={styles.about}>
			<h2>About the DANS/ 4TU Search and Discovery Application</h2>
			<div className={styles.logos}>
				<img src="4TU/image/logo_4TU.png" />
				<img src="4TU/image/logo_dans.png" />
			</div>
			<p>
				The DANS/ 4TU Search and DIscovery Application serves as a prototype for shared infrastructure envisaged by DANS and 4TU.
				This infrastructure aims to remove complexity from end users in terms of deposit to and subsequent discovery of resources
				in repositories managed by teh two institutons. In the field of physical, engineering, and technical sciences, both DANS and 4TU
				offers more than one repository service to end users.
			</p>
			<p>
				The Search and Discovery interface takes care of aggregation of these resources using a different perspective: it harvests minimum metadata
				directly from DataCite, which is used by both institutions to register PIDs for deposits, and contains kernel metadata for these resources.
				Since the persistent identifiers resolve to the original landing pages for the resources in the appropriate repository, such an aggregation
				serves as a useful staritng point tfor a federated search across all repositories.
			</p>
			<p>
				The search and discovery interface was developed to provide a set of enhancements to saerch capabilities that are not normally found in
				standard search and discovery applications, but have nevertheless been included and refined in specific instances over time. These included
			</p>
			<ul>
				<li>
					The ability to create custom facets, using representations appropriate to the facet. type. It is, for example, possible to create
					searchable lists of text facets, timeline views of date-time facets, map-based views of spatial coordinates, and chart-loike views of any
					numeric facet.
				</li>
				<li>
					Secondly, these facets can be configured into dashboards that are linked to the uderlying catalogue query interface. Using these
					configurable dashboards, one can instantly present an overview of the contents of a catalogue, and it is possible to configure as many of
					these dashbaords as needed: for example, to show the scope of resources within one or more collections in the catalogue. Selectiong elements of
					the facets in dashbaords update the search criteria for the basic search and dscovery interface, and vice versa - allowing us to interacttively
					narrow down and drill into a subset of resources of interest.
				</li>
				<li>
					Finally, the other significant functionality added to the search interface involves the naming and saving of predefined queries. This mas many potential
					applications, including provision of predefined subsets of a catalogue to reflect a collection and/ or tailor a view of the catalogue to a specific community or
					institution, and also allowing individual users to construct lists of favourite search criteria.
				</li>
			</ul>
			<p>
				The software was developed using Javascript, React, and ElasticSearch, and is a relatively lightweight deployment that accomplishes a lot.
			</p>
		</div>
	)
}