// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Authentication, Queries } from "./Utils";
import KustoClient from "azure-kusto-data/source/client";

enum SourceType {
    LocalFileSource = "localfilesource",
    BlobSource = "blobsource",
    NoSource = "nosource",
}

export enum AuthenticationModeOptions {
    UserPrompt = "UserPrompt",
    ManagedIdentity = "ManagedIdentity",
    AppKey = "AppKey",
    AppCertificate = "AppCertificate",
}

export class ConfigData {
   static sourceType: SourceType = SourceType.NoSource;
   static dataSourceUri: string = "";
   static format: string = "txt";
   static useExistingMapping: boolean = false;
   static mappingName: string = "compliancedata_mapping";
   static mappingValue: string = "";
}

export class BatchingPolicy  {
    static MaximumBatchingTimeSpan: string = "00:00:10";
    static MaximumNumberOfItems: number = 500;
    static MaximumRawDataSizeMB: number = 1024;
  }

export class ConfigJson {
   static kustoUri: string = "https://complainceinfo.centralus.kusto.windows.net/";
   static ingestUri: string = "https://ingest-complainceinfo.centralus.kusto.windows.net/";
   static databaseName: string = "complianceinfodb";
   static tableName: string = "compliancedata";
   static useExistingTable: boolean = true;
   static alterTable: boolean = true;
   static queryData: boolean = true;
   static ingestData: boolean = false;
   static tableSchema: string = "(DeviceId:guid, _AadDeviceId:guid, DeviceName:string, DeviceType:long, OSDescription:string, OSVersion:string, OwnerType:long, LastContact:string, InGracePeriodUntil:string, IMEI:real, SerialNumber:string, ManagementAgents:long, PrimaryUser:guid, UserId:guid, UPN:string, UserEmail:string, UserName:string, DeviceHealthThreatLevel:long, RetireAfterDatetime:string, PartnerDeviceId:string, _ComputedComplianceState:long, _OS:string, PartnerFeaturesBitmask:long, SettingName:string, PolicyName:string, CalculatedPolicyVersion:long, LatestPolicyVersion:long, SettingStatus:long, ErrorCode:long, ErrorCodeString:long)";
   static data: ConfigData[] = [ConfigData];
   static certificatePath: string;
   static certificatePassword: string;
   static applicationId: string = "";
   static tenantId: string = "72f988bf-86f1-41af-91ab-2d7cd011db47";
   static AppKey: string = "";
   static authenticationMode: AuthenticationModeOptions = AuthenticationModeOptions.AppKey;
   static waitForUser: boolean = false;
   static ignoreFirstRecord: boolean = false;
   static waitForIngestSeconds: number = 20;
   static batchingPolicy: BatchingPolicy = BatchingPolicy;
}

// TODO (config):
//  If this quickstart app was downloaded from OneClick, kusto_sample_ConfigJson.json should be pre-populated with your cluster's details.
//  If this quickstart app was downloaded from GitHub, edit kusto_sample_ConfigJson.json and modify the cluster URL and database fields appropriately.

export class SampleApp {
    private static step = 1;

    public static async start() {
        console.log("Kusto sample app is starting...");
        // if (ConfigJson.authenticationMode === AuthenticationModeOptions.AppKey) {
        //     await this.waitForUserToProceed(
        //         "You will be prompted *twice* for credentials during this script. Please return to the console after" + " authenticating."
        //     );
        // }
        const kustoAppKeyConnectionString = await Authentication.createAppKeyConnectionString(ConfigJson.kustoUri);
        console.log(kustoAppKeyConnectionString);

        const kustoConnectionString = await Authentication.generateConnectionString(
            ConfigJson.kustoUri
        );

        // Tip: Avoid creating a new Kusto/ingest client for each use.Instead, create the clients once and reuse them.
        if (!kustoConnectionString) {
            console.log("Connection String error. Please validate your configuration file.");
        } else {
            const kustoClient = new KustoClient(kustoConnectionString);

        //    await this.preIngestionQuerying(config, kustoClient);

            if (ConfigJson.ingestData) {
                await this.preIngestionQuerying(kustoClient);
            }

            if (ConfigJson.queryData) {
                await this.postIngestionQuerying(kustoClient, ConfigJson.databaseName, ConfigJson.tableName, ConfigJson.ingestData);
            }

            // Close the clients at the end of usage.
            kustoClient.close();
        }
        console.log("\nKusto sample app done");
    }


    /**
     * First phase, pre ingestion - will reach the provided DB with several control commands and a query based on the configuration file.
     *
     * @param config ConfigJson object containing the SampleApp configuration
     * @param kustoClient Client to run commands
     */
    private static async preIngestionQuerying(kustoClient: KustoClient) {
        if (ConfigJson.useExistingTable) {
            if (ConfigJson.alterTable) {
                // Tip: Usually table was originally created with a schema appropriate for the data being ingested, so this wouldn't be needed.
                // Learn More: For more information about altering table schemas, see:
                // https://docs.microsoft.com/azure/data-explorer/kusto/management/alter-table-command
                await this.waitForUserToProceed(`Alter-merge existing table '${ConfigJson.databaseName}.${ConfigJson.tableName}' to align with the provided schema`);
                await this.alterMergeExistingTableToProvidedSchema(kustoClient, ConfigJson.databaseName, ConfigJson.tableName, ConfigJson.tableSchema);
            }
            if (ConfigJson.queryData) {
                // Learn More: For more information about Kusto Query Language (KQL), see: https://docs.microsoft.com/azure/data-explorer/write-queries
                await this.waitForUserToProceed(`Get existing row count in '${ConfigJson.databaseName}.${ConfigJson.tableName}'`);
                await this.queryExistingNumberOfRows(kustoClient, ConfigJson.databaseName, ConfigJson.tableName);
            }
        } else {
            // Tip: This is generally a one-time configuration
            // Learn More: For more information about creating tables, see: https://docs.microsoft.com/azure/data-explorer/one-click-table
            await this.waitForUserToProceed(`Creating table '${ConfigJson.databaseName}.${ConfigJson.tableName}'`);
            await this.createNewTable(kustoClient, ConfigJson.databaseName, ConfigJson.tableName, ConfigJson.tableSchema);
        }

        // Learn More: Kusto batches data for ingestion efficiency. The default batching policy ingests data when one of the following conditions are met:
        //   1) More than 1,000 files were queued for ingestion for the same table by the same user
        //   2) More than 1GB of data was queued for ingestion for the same table by the same user
        //   3) More than 5 minutes have passed since the first file was queued for ingestion for the same table by the same user
        //  For more information about customizing the ingestion batching policy, see:
        // https://docs.microsoft.com/azure/data-explorer/kusto/management/batchingpolicy
        // TODO: Change if needed. Disabled to prevent an existing batching policy from being unintentionally changed
        if (false && ConfigJson.batchingPolicy != null) {
            // // await this.waitForUserToProceed(`Alter the batching policy for table '${ConfigJson.databaseName}.${ConfigJson.tableName}'`);
            // // await this.alterBatchingPolicy(kustoClient, ConfigJson.databaseName, ConfigJson.tableName, ConfigJson.batchingPolicy);
        }
    }

    /**
     * Alter-merges the given existing table to provided schema.
     *
     * @param kustoClient Client to run commands
     * @param databaseName DB name
     * @param tableName Table name
     * @param tableSchema Table schema
     */
    private static async alterMergeExistingTableToProvidedSchema(kustoClient: KustoClient, databaseName: string, tableName: string, tableSchema: string) {
        const command = `.alter-merge table ${tableName} ${tableSchema}`;
        await Queries.executeCommand(kustoClient, databaseName, command, "Node_SampleApp_ControlCommand");
    }

    /**
     * Queries the data on the existing number of rows
     *
     * @param kustoClient Client to run commands
     * @param databaseName DB name
     * @param tableName Table name
     */
    private static async queryExistingNumberOfRows(kustoClient: KustoClient, databaseName: string, tableName: string) {
        // const query = `${tableName} | count`;
        const query = `${tableName} | where _ComputedComplianceState != 0 | summarize DeviceCount=count() by SettingName | top 3 by DeviceCount desc`;
        await Queries.executeCommand(kustoClient, databaseName, query, "Node_SampleApp_Query");
    }

    /**
     * Queries the first two rows of the table.
     *
     * @param kustoClient Client to run commands
     * @param databaseName DB name
     * @param tableName Table name
     * @private
     */
    private static async queryFirstTwoRows(kustoClient: KustoClient, databaseName: string, tableName: string) {
        const query = `${tableName} | take 2`;
        await Queries.executeCommand(kustoClient, databaseName, query, "Node_SampleApp_Query");
    }

    /**
     * Creates a new table.
     *
     * @param kustoClient Client to run commands
     * @param databaseName DB name
     * @param tableName Table name
     * @param tableSchema Table schema
     */
    private static async createNewTable(kustoClient: KustoClient, databaseName: string, tableName: string, tableSchema: string) {
        const command = `.create table ${tableName} ${tableSchema}`;
        await Queries.executeCommand(kustoClient, databaseName, command, "Node_SampleApp_ControlCommand");
    }

    /**
     * Alters the batching policy based on BatchingPolicy const.
     *
     * @param kustoClient Client to run commands
     * @param databaseName DB name
     * @param tableName Table name
     * @param batchingPolicy Ingestion batching policy
     */
    // // private static async alterBatchingPolicy(kustoClient: KustoClient, databaseName: string, tableName: string, batchingPolicy: string) {
    // //     // Tip 1: Though most users should be fine with the defaults, to speed up ingestion, such as during development and in this sample app, we opt to
    // //     // modify the default ingestion policy to ingest data after at most 10 seconds.
    // //     // Tip 2: This is generally a one-time configuration.
    // //     // Tip 3: You can also skip the batching for some files using the Flush-Immediately property, though this option should be used with care as it is
    // //     // inefficient.
    // //     const command = `.alter table ${tableName} policy ingestionbatching @'${batchingPolicy}'`;
    // //     await Queries.executeCommand(kustoClient, databaseName, command, "Node_SampleApp_ControlCommand");
    // // }

     /**
     * Third and final phase - simple queries to validate the hopefully successful run of the script.
     *
     * @param kustoClient Client to run commands
     * @param databaseName DB name
     * @param tableName Table name
     * @param ingestData Flag noting whether any data was ingested by the script
     * @private
     */
    private static async postIngestionQuerying(kustoClient: KustoClient, databaseName: string, tableName: string, ingestData: boolean) {
        const optionalPostIngestionPrompt = ingestData ? "post-ingestion " : "";

        await this.waitForUserToProceed(`Get ${optionalPostIngestionPrompt}row count for '${databaseName}.${tableName}':`);
        await this.queryExistingNumberOfRows(kustoClient, databaseName, tableName);

        await this.waitForUserToProceed(`Get sample (2 records) of ${optionalPostIngestionPrompt}data:`);
        await this.queryFirstTwoRows(kustoClient, databaseName, tableName);
    }

    /**
     * Handles UX on prompts and flow of program
     *
     * @param promptMsg Prompt to display to user
     */
    private static async waitForUserToProceed(promptMsg: string): Promise<any> {
        console.log(`\nStep ${this.step}: ${promptMsg}`);
        this.step++;
        // if (this.waitForUser) {
        //     const rl = readline.createInterface({
        //         input: process.stdin,
        //         output: process.stdout,
        //     });
        //     return new Promise((resolve) =>
        //         rl.question("Press ENTER to proceed with this operation...", (ans) => {
        //             rl.close();
        //             resolve(ans);
        //         })
        //     );
        // }
    }
}

void SampleApp.start();
