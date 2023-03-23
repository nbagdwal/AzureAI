// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import KustoConnectionStringBuilder from "azure-kusto-data/source/connectionBuilder";
import ClientRequestProperties from "azure-kusto-data/source/clientRequestProperties";
import { v4 as uuidv4 } from "uuid";
import KustoClient from "azure-kusto-data/source/client";
import { ConfigJson } from "./SampleApp";


/**
 * Authentication module of Utils - in charge of authenticating the user with the system
 */
export class Authentication {
    /**
     * Generates Kusto Connection String based on given Authentication Mode.
     *
     * @param clusterUri Cluster to connect to.
     * @param authenticationMode User Authentication Mode, Options: (UserPrompt|ManagedIdentity|AppKey|AppCertificate)
     * @param certificatePath Given certificate path
     * @param certificatePassword Given certificate password
     * @param applicationId Given application id
     * @param tenantId Given tenant id
     * @returns A connection string to be used when creating a Client
     */
    public static async generateConnectionString(
        clusterUri: string
    ): Promise<KustoConnectionStringBuilder> {
        // Learn More: For additional information on how to authorize users and apps in Kusto see:
        // https://docs.microsoft.com/azure/data-explorer/manage-database-permissions
        return this.createAppKeyConnectionString(clusterUri);
    }

    /**
     * Generates Kusto Connection String based on 'AppKey' Authentication Mode.
     *
     * @param clusterUri Url of cluster to connect to
     * @returns AppKey Kusto Connection String
     */
    public static createAppKeyConnectionString(clusterUri: string): KustoConnectionStringBuilder {
        const aadAppId: string | undefined = ConfigJson.applicationId;
        const appKey: string | undefined = ConfigJson.AppKey;
        const authorityId: string | undefined = ConfigJson.tenantId;

        return KustoConnectionStringBuilder.withAadApplicationKeyAuthentication(clusterUri, aadAppId, appKey, authorityId);
    }
}

/**
 * Queries module of Utils - in charge of querying the data - either with management queries, or data queries
 */
export class Queries {
    /**
     * Creates a fitting ClientRequestProperties object, to be used when executing control commands or queries.
     *
     * @param scope Working scope
     * @param timeout Requests default timeout
     * @returns ClientRequestProperties object
     */
    public static createClientRequestProperties(scope: string, timeout: number | null = null): ClientRequestProperties {
        // It is strongly recommended that each request has its own unique request identifier.
        // This is mandatory for some scenarios (such as cancelling queries) and will make troubleshooting easier in others
        const clientRequestProperties: ClientRequestProperties = new ClientRequestProperties({
            application: "kustoSampleApp.js",
            clientRequestId: `${scope};${uuidv4()}`,
        });
        // Tip: Though uncommon, you can alter the request default command timeout using the below command, e.g. to set the timeout to 10 minutes, use "10m"
        if (timeout != null) {
            clientRequestProperties.setTimeout(timeout);
        }
        return clientRequestProperties;
    }

    /**
     * Executes a command using the kustoClient
     *
     * @param kustoClient Client to run commands
     * @param databaseName DB name
     * @param command The command to run. can either be management(control) command or query.
     * @param scope Working scope
     */
    public static async executeCommand(kustoClient: KustoClient, databaseName: string, command: string, scope: string) {
        try {
            const clientRequestProperties = this.createClientRequestProperties(scope);
            const responseDataSet = await kustoClient.execute(databaseName, command, clientRequestProperties);
            // Tip: Actual implementations wouldn't generally print the response from a control command.We print here to demonstrate what a sample of the
            // response looks like.
            console.log(`Response from executed control command '${command}':\n--------------------`);
            for (const row of responseDataSet.primaryResults[0].rows()) {
                console.log(row.toJSON());
            }
        } catch (ex: any) {
            console.log(`Failed to execute command: '${command}'`, ex);
        }
    }
}

