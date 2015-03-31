module.exports = {
	port: 4000,
	sparql: {
        sparqlEndpoint: "http://localhost:9882/sparql",
        yasguiVersion: "1.0.17",
        baseUrl: "/sparql/query"
	},
	bash: {
	    addMd5: "loadFromLodLaundromat",
	    checkDocStatus: "virtuosoCheckStatus",
	    
	}
}
