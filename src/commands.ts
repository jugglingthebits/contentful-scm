import * as yargs from 'yargs';
import { clone } from './scm';

export function registerCommands(argv: yargs.Argv) {
    argv.command('clone', 'Clone a contentful space', (args: yargs.Argv) => {
        args.option('spaceId', {
            type: 'string',
            demandOption: true
        });
        args.option('contentfulManagementAccessToken', {
            type: 'string',
            demandOption: true
        })
        return args;
    }, cloneCommand);
}

async function cloneCommand(args: yargs.Arguments): Promise<void> {
    const spaceId: string = args.spaceId;
    const contentfulManagementAccessToken: string = args.contentfulManagementAccessToken;

    const actualParentPath = 'c:\\workspace';
    await clone(spaceId, actualParentPath, contentfulManagementAccessToken);
    process.exit(0);
}
