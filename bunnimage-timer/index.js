const { BlobServiceClient } = require("@azure/storage-blob");
const connectionstring = process.env["AZURE_STORAGE_CONNECTION_STRING"];
const account = "saniasstorageaccount";

module.exports = async function (context, myTimer) {
    const blobServiceClient = await BlobServiceClient.fromConnectionString(connectionstring);
    const deletecontainer = "images";
    const blobContainerClient = await blobServiceClient.getContainerClient(deletecontainer);
    
    for await (const blob of blobContainerClient.listBlobsFlat()) {
        context.log(`Deleting blob name ${blob.name}`);
        
        await blobContainerClient.deleteBlob(blob.name)
    }

    context.log("Deleted all files from the container")
};