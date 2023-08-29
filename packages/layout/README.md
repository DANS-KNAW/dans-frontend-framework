# DANS layout components
Package that exports several layout components for use in your form application.

## Language bar
Use `import { LanguageBar } from @dans-framework/layout`. Takes the following props:

		<LanguageBar 
			// Languages need to be defined by their 2 letter code, e.g. 'en'
			languages={ ['en', 'nl'] }
    		// Function to change the language of the root app, usually i18n.changeLanguage
			changeLanguage={ (lang) => void }
		/>

## Menu bar
The navigation menu of your app. Takes an array of Page props: `<MenuBar pages={pages} />`. See @dans-framework/Pages

## Footer
The footer menu of your app. Takes props like this:
		
		<Footer
			// Top and bottom contain an array of footer items
			top=[{...}]
			bottom=[{...}]
		/>

A footer item is formatted as follows:

		{
			// a string or a language object, appears above a footer section
			header: {
				en: '',
				nl: '',
			},
		 	links: [{
		 		name: '' // or language object,
		 		link: '' // a URL,
		 		icon: '' // optionally a material icon identifier, can be 'twitter', 'youtube', 'email' for now
		 	}];
			freetext: 'some text' // instead of a link, display some text. Can be a string or language object
		}
