
import * as path from 'path';
import * as fs from 'fs';
import { createClient as createManagementClient } from 'contentful-management';
import { Config, writeConfig } from './config';

export async function clone(spaceId: string, parentPath: string, accessToken: string): Promise<void> {
    const workingCopyPath = path.join(parentPath, spaceId);
    fs.mkdirSync(workingCopyPath);

    const hiddenDataPath = path.join(workingCopyPath, '.contentful-scm');
    fs.mkdirSync(hiddenDataPath);

    const entriesPath = path.join(hiddenDataPath, 'entries');
    fs.mkdirSync(entriesPath);

    const contentTypesPath = path.join(hiddenDataPath, 'content-types');
    fs.mkdirSync(contentTypesPath);

    const config: Config = {
        spaceId,
        accessToken
    };
    await writeConfig(config, hiddenDataPath);

    const managementClient = getContentfulManagementClient(accessToken);
    const managementSpace = await managementClient.getSpace(spaceId);
    const masterEnvironment = await managementSpace.getEnvironment('master');

    const contentTypes = await masterEnvironment.getContentTypes();
    for (const contentType of contentTypes.items) {
        const contentTypePath = path.join(contentTypesPath, `${contentType.sys.id}.json`);
        fs.writeFileSync(contentTypePath, JSON.stringify(contentType));
    }

    // TODO: Get more than 100 entries
    const entries = await masterEnvironment.getEntries();

    for (const entry of entries.items) {
        const entryPath = path.join(entriesPath, `${entry.sys.id}.json`);
        fs.writeFileSync(entryPath, JSON.stringify(entry));
    }

    for (const entry of entries.items) {
        const entryPath = path.join(workingCopyPath, `${entry.sys.id}.json`);
        const workingCopyEntry = entry.fields;
        fs.writeFileSync(entryPath, JSON.stringify(workingCopyEntry, null, 2));
    }
}

function getContentfulManagementClient(accessToken: string) {
    return createManagementClient({
        accessToken
    });
}
