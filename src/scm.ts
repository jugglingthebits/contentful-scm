
import * as path from 'path';
import * as fs from 'fs';
import { createClient as createManagementClient } from 'contentful-management';
import { Config, writeConfig } from './config';

class ContentType {
    static fromContentfulContentType(contentfulConentType: any) {
        const contentType = new ContentType(contentfulConentType.sys.id);
        return contentType;
    }

    constructor(public id: string) {}
}

class Entry {
    static fromContentfulEntry(contentfulEntry: any, contentTypes: ContentType[]) {
        const contentType = contentTypes.find(ct => ct.id === contentfulEntry.contentType.sys.id);
        if (!contentType)
            throw new Error(`Unknown content type ${contentfulEntry.contentType.sys.id}`);
        const entry = new Entry(contentfulEntry.sys.id, contentType);
        return entry;
    }

    constructor(public id: string, public contentType: ContentType) {}
}

export async function clone(spaceId: string, parentPath: string, accessToken: string): Promise<void> {
    const workingCopyPath = path.join(parentPath, spaceId);
    fs.mkdirSync(workingCopyPath);

    const hiddenDataPath = path.join(workingCopyPath, '.contentful-scm');
    fs.mkdirSync(hiddenDataPath);

    const config: Config = {
        spaceId,
        accessToken
    };
    await writeConfig(config, hiddenDataPath);

    const managementClient = getContentfulManagementClient(accessToken);
    const managementSpace = await managementClient.getSpace(spaceId);
    const masterEnvironment = await managementSpace.getEnvironment('master');

    // TODO: Get more than 100 entries
    const contentfulContentTypes = await masterEnvironment.getContentTypes();
    // TODO: Get more than 100 entries
    const contentfulEntries = await masterEnvironment.getEntries();

    const contentTypes = contentfulContentTypes.items.map((ct: any) => ContentType.fromContentfulContentType(ct));
    const entries = contentfulEntries.items.map((ce: any) => Entry.fromContentfulEntry(ce, contentTypes));

    writeHiddenCopy(contentfulContentTypes, contentfulEntries, hiddenDataPath);
    writeWorkingCopy(entries, workingCopyPath);
}

function getContentfulManagementClient(accessToken: string) {
    return createManagementClient({
        accessToken
    });
}

function writeHiddenCopy(contentTypes: any, entries: any, hiddenDataPath: string) {
    const contentTypesPath = path.join(hiddenDataPath, 'content-types');
    fs.mkdirSync(contentTypesPath);

    for (const contentType of contentTypes.items) {
        const contentTypePath = path.join(contentTypesPath, `${contentType.sys.id}.json`);
        fs.writeFileSync(contentTypePath, JSON.stringify(contentType));
    }

    const entriesPath = path.join(hiddenDataPath, 'entries');
    fs.mkdirSync(entriesPath);

    for (const entry of entries.items) {
        const entryPath = path.join(entriesPath, `${entry.sys.id}.json`);
        fs.writeFileSync(entryPath, JSON.stringify(entry));
    }
}

function writeWorkingCopy(entries: Entry[], workingCopyPath: string) {
    for (const entry of entries) {
        const entryPath = path.join(workingCopyPath, `${entry.id}.json`);
        fs.writeFileSync(entryPath, JSON.stringify(entry, null, 2));
    }
}
