
import * as path from 'path';
import * as fs from 'fs';
import { createClient as createManagementClient } from 'contentful-management';
import { Config, writeConfig } from './config';

export async function clone(spaceId: string, parentPath: string, accessToken: string): Promise<void> {
    try {
        const repositoryPath = path.join(parentPath, spaceId);
        fs.mkdirSync(repositoryPath);

        const config: Config = {
            spaceId,
            accessToken
        };
        await writeConfig(config, repositoryPath);
    } catch (e) {
        console.log(e);
    }

    const managementClient = getContentfulManagementClient(accessToken);
    const managementSpace = await managementClient.getSpace(spaceId);
    // TODO: Fetch entries and write them to disk
    // TODO: Get more than 100 entries
    const entries = await managementSpace.getEntries();
    for (const entry of entries.items) {
        const entryFilePath = path.join();
        fs.writeFileSync(entryFilePath, entry);
    }
}

function getContentfulManagementClient(accessToken: string) {
    return createManagementClient({
        accessToken
    });
}
