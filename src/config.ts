import * as path from 'path';
import * as fs from 'fs';

export interface Config {
    spaceId: string;
    accessToken: string;
}

export async function writeConfig(config: Config, parentPath: string) {
    return new Promise((resolve, reject) => {
        const configFilePath = path.join(parentPath, "contentful.json");
        fs.exists(parentPath, value => {
            fs.mkdir(parentPath, err => {
                if (err)
                    return reject(err);
                fs.writeFile(configFilePath, JSON.stringify(config), err => {
                    if (err)
                        return reject(err);
                    return resolve();
                });
            });
        });
    });
}
