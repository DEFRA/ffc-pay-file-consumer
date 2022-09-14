# FFC Pay File Consumer

## Description

FFC Azure function app to transfer, return and acknowledge files from a Dynamics 365 (DAX) Azure File Share to an Azure Blob Storage location.

For how the repo fits into the architecture and what components or dependencies it interacts with please refer to the following diagram: [ffc-pay.drawio](https://github.com/DEFRA/ffc-diagrams/blob/main/Payments/ffc-pay.drawio)

# Prerequisites

## Software required

- Node.js LTS 16
- Access to an instance of [Azure Blob Storage](https://docs.microsoft.com/en-us/azure/storage/blobs/)
- Access to an instance of [Azure File Share](https://docs.microsoft.com/en-us/azure/storage/files/storage-files-introduction)
- [Azure Functions Core Tools V3](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4%2Clinux%2Ccsharp%2Cportal%2Cbash)

## Configuration

The `local.settings.json` is required to hold all local development environment values.  As this file contains sensitive values, it is excluded from source control.

Example:

```
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10007/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10008/devstoreaccount1;",
    "BATCH_STORAGE": "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10007/devstoreaccount1;",
    "DAX_STORAGE": "SHARE CONNECTION STING",
    "MESSAGE_CONNECTION": "SERVICE BUS CONNECTION STRING",
    "FILECONSUME_TOPIC_ADDRESS": "ffc-pay-file-consume",
    "FILECONSUME_SUBSCRIPTION_ADDRESS": "ffc-pay-file-consumer",
  }
}
```
> Note: if you wish to run this service end to end, then update the `BATCH_STORAGE` environment variable to use port `10002` instead of `10007`.

### Azure Blob Storage

This repository pushes files from Azure Blob storage to a `dax` container.

# How to start the File Consumer

The service can be run using the convenience script 
```
./scripts/start
```

# How to get an output

**To transfer a file from DAX**  
**Pre-requisite:** DAX has created a file in it's Azure File Share location.  
**Input:** A message is sent from DAX containing the name of the file to be transferred.  
**Output:** The referenced file is copied to the configured Azure Blob Storage location and the original is deleted.  

# How to stop the File Consumer

The service can be stopped by using the convenience script 
```
./scripts/stop
```

# How to test the File Consumer

Tests can be run in several modes:
- [Run tests and exit](#run-tests-and-exit)
- [Run tests with file watch](#run-tests-with-file-watch)

## Run tests and exit
```
./scripts/test
```

## Run tests with file watch
```
./scripts/test -w
```


## CI pipeline

This service uses the [FFC CI pipeline](https://github.com/DEFRA/ffc-jenkins-pipeline-library)

# Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
