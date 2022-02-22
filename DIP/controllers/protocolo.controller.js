
module.exports.enviarInf = async function(req, res, next) {
    let verb = req.query.verb;
    let set = req.query.set;
    let id = req.query.identifier;
    try {
        if (verb == 'Identify' && !set) {
            var XMLWriter = require('xml-writer');
    xw = new XMLWriter;
    xw.startDocument();
    xw.startElement('Identify').writeElement('repositoryName','Biblioteca digital').writeElement('baseURL','localhost').writeElement('protocolVersion','2.0').writeElement('EarlyDatestamp','fecha inicial de funcionamiento').writeElement('deleteRecords','persistente, transitorio, no').writeElement('gradualidad','AAAA-MM-DD').writeElement('adminEmail','zoigelyn@gmail.com');

    xw.endDocument();
 
    var doc = xw.toString();
    console.log(doc)
    res.status(200).send(doc);
        } else if (verb == 'Identify' && set) {
            res.status(500).send({
                message: 'badArgument',
              });
        } else if (verb == 'ListMetadataFormats' && identifier) {
            const libro = await Libros.findOne({
                where: {
                  dc_identifier: id
                }
              });

              var libroJson = JSON.stringify(libro);
              var json2xml = require('json2xml');
          
              var libroXml = json2xml(JSON.parse(libroJson));
              console.log(libroXml);
          


        } else if (verb == 'ListSets') {

        } else if (verb == 'ListIdentifiers') {

        } else if (verb == 'ListRecords') {

        } else if (verb == 'GetRecord') {

        } else {
            res.status(500).send({
                message: 'Ha ocurrido un error',
              });
        }
    } catch (error) {
        res.status(500).send({
            message: 'Ha ocurrido un error',
          });
    }
}