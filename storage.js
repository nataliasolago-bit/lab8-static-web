const { BlobServiceClient } = require('@azure/storage-blob');
const { TableClient } = require('@azure/data-tables');
const { QueueServiceClient } = require('@azure/storage-queue');

const CONN = 'DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;';

async function main() {
  // ---- BLOB ----
  console.log('\n=== BLOB STORAGE ===');
  const blobService = BlobServiceClient.fromConnectionString(CONN);
  const container = blobService.getContainerClient('documentos');
  await container.createIfNotExists();
  const contenido = 'Informe del laboratorio 8 - ' + new Date().toISOString();
  await container.getBlockBlobClient('informe.txt').upload(contenido, contenido.length);
  console.log('Blob subido: informe.txt');
  for await (const b of container.listBlobsFlat()) console.log(' - Blob en contenedor:', b.name, '(' + b.properties.contentLength + ' bytes)');
  const dl = await container.getBlobClient('informe.txt').downloadToBuffer();
  console.log('Contenido descargado:', dl.toString());

  // ---- TABLE ----
  console.log('\n=== TABLE STORAGE ===');
  const table = TableClient.fromConnectionString(CONN, 'Estudiantes', { allowInsecureConnection: true });
  await table.createTable();
  await table.upsertEntity({ partitionKey: 'sistemas', rowKey: '1', nombre: 'Ana', nota: 4.5 });
  await table.upsertEntity({ partitionKey: 'sistemas', rowKey: '2', nombre: 'Luis', nota: 3.8 });
  for await (const e of table.listEntities()) console.log(' - Fila:', e.partitionKey, e.rowKey, e.nombre, e.nota);

  // ---- QUEUE ----
  console.log('\n=== QUEUE STORAGE ===');
  const q = QueueServiceClient.fromConnectionString(CONN).getQueueClient('tareas');
  await q.createIfNotExists();
  await q.sendMessage('Procesar informe 1');
  await q.sendMessage('Procesar informe 2');
  const msgs = await q.receiveMessages({ numberOfMessages: 2 });
  for (const m of msgs.receivedMessageItems) {
    console.log(' - Mensaje recibido:', m.messageText);
    await q.deleteMessage(m.messageId, m.popReceipt);
  }
  console.log('Mensajes procesados y eliminados de la cola.');
}
main().catch(e => { console.error('Error:', e.message); process.exit(1); });
