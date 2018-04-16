import * as path from 'path';
import * as fs from 'fs';

export interface Config {
    spaceId: string;
    accessToken: string;
}

export async function writeConfig(config: Config, repositoryPath: string) {
    return new Promise((resolve, reject) => {
        const configFilePath = path.join(repositoryPath, "contentful.json");
        fs.writeFileSync(configFilePath, JSON.stringify(config));
        resolve();
    });
}
