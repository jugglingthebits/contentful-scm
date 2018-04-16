
import * as path from 'path';
import * as fs from 'fs';
import { createClient as createManagementClient } from 'contentful-management';
import { Config, writeConfig } from './config';

export async function clone(spaceId: string, parentPath: string, accessToken: string): Promise<void> {
    const basePath = path.join(parentPath, spaceId);
    const hiddenDataPath = path.join(basePath, '.contentful-scm');
    try {
        fs.mkdirSync(basePath);
        fs.mkdirSync(hiddenDataPath);

        const config: Config = {
            spaceId,
            accessToken
        };
        await writeConfig(config, hiddenDataPath);
    } catch (e) {
        console.log(e);
    }

    const managementClient = getContentfulManagementClient(accessToken);
    const managementSpace = await managementClient.getSpace(spaceId);
    const masterEnvironment = await managementSpace.getEnvironment('master');
    // TODO: Get more than 100 entries
    const entries = await masterEnvironment.getEntries();

    for (const entry of entries.items) {
        const entryFilePath = path.join(hiddenDataPath, `${entry.sys.id}.json`);
        fs.writeFileSync(entryFilePath, JSON.stringify(entry));
    }

    for (const entry of entries.items) {
        const workingCopyEntryPath = path.join(basePath, `${entry.sys.id}.json`);
        const workingCopyEntry = entry.fields;
        fs.writeFileSync(workingCopyEntryPath, JSON.stringify(workingCopyEntry, null, 2));
    }
}

function getContentfulManagementClient(accessToken: string) {
    return createManagementClient({
        accessToken
    });
}
