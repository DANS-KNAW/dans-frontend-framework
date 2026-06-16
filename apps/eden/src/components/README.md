EDEN FAIRiCat LinkSet editor
============================

The editor is part of the EDEN 'registry' web application. 
On the EDEN page there is a menu item for the editor, next to the default page 'Search' menu item. 

__NOTE__ This is not a finished product!


## Workflow

Current FAIRiCat LinkSet (JSON) editor workflow is a 3-step flow:

1. Choose start mode: user picks `Start new from scratch` or `Import a file` on the LinkSet editor page.

2. Import (optional): import via JSON upload (validated against expected linkset structure) or via URL fetch (Fetch is not implemented yet!).  

3. Edit: user edits one or more service contexts (anchor + service-desc/service-doc/service-meta targets), can add/remove services and relation targets.
There is a Validate + preview + export area: validation errors are shown live, preview is rendered as exchangeable FAIRiCat LinkSet JSON, and user can download `fairicat-linkset.json`.

Note: URL import is currently mocked (simulated fetch), and Save draft/Store buttons are present but not wired to persistence yet. 


## Testing

There is no automated testing, but a 'manual' linkset 'roundtrip' can be used to test the import/export logic. For this you need a JSON file that is formatted as the supplied download is doing, to prevent order differences. Importing this file and then downloading it again should result in the same file content. 
As a simple example we can use linkset from the FAIRiCat specification: 

```
{
  "linkset": [
    {
      "anchor": "https://triplestore.netwerkdigitaalerfgoed.nl/sparql",
      "service-doc": [
        {
          "href": "https://www.w3.org/TR/sparql11-query/",
          "type": "text/html",
          "title": "SPARQL 1.1 Query Language"
        }
      ]
    }
  ]
}
```

## Open issues

- Associate a repository with the FAIRiCat LinkSet. This could be done when storing it, or maybe when importing from a repository URL. 
- Implement the URL Fetching, which could try to use the FAIRiCat discovery mechanism or download the JSON file directly. 
- Provide a way to extract/import information from the registry or harvester to prefill the LinkSet editor form. 
- Provide a way to store; in the registry, or the harvester, or maybe even in the browser (as draft)
- Improve the edit form: 
  - Input for the URL could be improved, maybe even detect the MIME type via a HEAD request. 
  - The type field should be restricted to a list of MIME types, possibly via autocomplete. 
  - Allow selection of standard documentations; possible for common services as OAI, OpenAPI, SPARQL etc. Maybe we can provide selection from this. 
